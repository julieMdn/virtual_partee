import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        try {
          // Récupérer les articles du panier depuis les métadonnées
          const cartItems = JSON.parse(session.metadata.cartItems);

          // Créer un paiement dans la base de données
          const payment = await prisma.payment.create({
            data: {
              amount: session.amount_total / 100, // Convertir les centimes en euros
              tvaAmount: (session.amount_total * 0.2) / 100, // TVA à 20%
              status: "COMPLETED",
            },
          });

          // Créer les réservations pour chaque article
          await Promise.all(
            cartItems.map(async (item) => {
              await prisma.booking.create({
                data: {
                  offerId: parseInt(item.id),
                  timeSlotId: parseInt(item.timeSlot),
                  date: new Date(item.date),
                  status: "CONFIRMED",
                  paymentId: payment.id,
                  userId: session.client_reference_id, // Assurez-vous d'envoyer l'ID de l'utilisateur dans la session
                },
              });
            })
          );

          console.log(
            `Réservations créées avec succès pour la session: ${session.id}`
          );
        } catch (error) {
          console.error("Erreur lors de la création des réservations:", error);
          // On ne renvoie pas d'erreur à Stripe pour éviter les retentatives
          // mais on log l'erreur pour pouvoir la traiter manuellement
        }
        break;

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object;
        console.error("Échec du paiement:", paymentIntent.id);
        // Pas besoin de traitement particulier car les réservations
        // ne sont créées qu'après le paiement réussi
        break;

      default:
        // Pas besoin de log pour les événements non gérés
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Erreur dans le webhook:", err.message);
    return NextResponse.json(
      { error: "Erreur dans le webhook" },
      { status: 500 }
    );
  }
}
