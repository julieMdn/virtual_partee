import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// Cette clé secrète doit être la même que celle configurée dans votre dashboard Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    console.log("🔵 Webhook Stripe reçu");
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get("stripe-signature");

    console.log("Signature Stripe reçue:", sig ? "Oui" : "Non");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log("✅ Événement webhook validé:", event.type);
    } catch (err) {
      console.error("❌ Erreur de signature webhook:", err.message);
      return NextResponse.json(
        { error: `Erreur de signature webhook: ${err.message}` },
        { status: 400 }
      );
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("💳 Session de paiement complétée:", session.id);

        try {
          // Créer d'abord le paiement
          console.log("💰 Création du paiement...");
          const amountTTC = session.amount_total / 100; // Convertir en euros
          const tvaRate = 0.2; // TVA à 20%
          const amountHT = amountTTC / (1 + tvaRate);
          const tvaAmount = amountTTC - amountHT;

          const payment = await prisma.payment.create({
            data: {
              amount: amountHT,
              tvaAmount: tvaAmount,
              date: new Date(),
              status: "completed",
            },
          });
          console.log("✅ Paiement créé:", payment.id);

          // Vérifier si nous avons des cartItems dans les métadonnées (de stripe-config)
          if (session.metadata && session.metadata.cartItems) {
            // Récupérer les articles du panier depuis les métadonnées
            const cartItems = JSON.parse(session.metadata.cartItems);

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
                    userId: session.client_reference_id,
                  },
                });
              })
            );
            console.log(
              `Réservations créées avec succès pour la session: ${session.id}`
            );
          } else {
            // Mettre à jour les réservations existantes (de webhook)
            const bookings = await prisma.booking.findMany({
              where: {
                stripeSessionId: session.id,
              },
            });

            console.log(`📋 Réservations trouvées: ${bookings.length}`);

            if (bookings.length === 0) {
              console.warn(
                `⚠️ Aucune réservation trouvée pour la session ${session.id}`
              );
            }

            const updateResult = await prisma.booking.updateMany({
              where: {
                stripeSessionId: session.id,
              },
              data: {
                status: "confirmed",
                paymentId: payment.id,
              },
            });

            console.log(
              `✅ ${updateResult.count} réservation(s) mise(s) à jour`
            );
          }
        } catch (error) {
          console.error("❌ Erreur lors du traitement de la session:", error);
          // On ne renvoie pas d'erreur à Stripe pour éviter les retentatives
          // mais on log l'erreur pour pouvoir la traiter manuellement
        }
        break;

      case "charge.updated":
      case "charge.succeeded":
        const charge = event.data.object;
        console.log("💰 Charge mise à jour ou réussie:", charge.id);

        try {
          // Récupérer le payment_intent associé à cette charge
          const paymentIntentId = charge.payment_intent;

          if (paymentIntentId && charge.status === "succeeded") {
            console.log(
              "🔍 Recherche des réservations liées au payment_intent:",
              paymentIntentId
            );

            // Rechercher les sessions de checkout liées à ce payment_intent
            const sessions = await stripe.checkout.sessions.list({
              payment_intent: paymentIntentId,
              expand: ["data.payment_intent"],
            });

            if (sessions.data.length > 0) {
              const sessionId = sessions.data[0].id;
              console.log("🔗 Session trouvée:", sessionId);

              // Vérifier si des réservations existent pour cette session
              const pendingBookings = await prisma.booking.findMany({
                where: {
                  stripeSessionId: sessionId,
                  status: "pending",
                },
              });

              if (pendingBookings.length > 0) {
                console.log(
                  `📋 Réservations en attente trouvées: ${pendingBookings.length}`
                );

                // Créer un nouveau paiement
                const amountTTC = charge.amount / 100; // Convertir en euros
                const tvaRate = 0.2; // TVA à 20%
                const amountHT = amountTTC / (1 + tvaRate);
                const tvaAmount = amountTTC - amountHT;

                const payment = await prisma.payment.create({
                  data: {
                    amount: amountHT,
                    tvaAmount: tvaAmount,
                    date: new Date(),
                    status: "completed",
                  },
                });

                console.log("✅ Paiement créé:", payment.id);

                // Mettre à jour les réservations en attente
                const updateResult = await prisma.booking.updateMany({
                  where: {
                    stripeSessionId: sessionId,
                    status: "pending",
                  },
                  data: {
                    status: "confirmed",
                    paymentId: payment.id,
                  },
                });

                console.log(
                  `✅ ${updateResult.count} réservation(s) mise(s) à jour depuis l'état "pending"`
                );
              } else {
                console.log(
                  "ℹ️ Aucune réservation en attente trouvée pour cette session"
                );
              }
            } else {
              console.log("⚠️ Aucune session trouvée pour ce payment_intent");
            }
          }
        } catch (error) {
          console.error("❌ Erreur lors du traitement de la charge:", error);
          console.error("Stack trace:", error.stack);
        }
        break;

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object;
        console.log("❌ Échec du paiement:", paymentIntent.id);
        // Pas besoin de traitement particulier car les réservations
        // ne sont créées qu'après le paiement réussi
        break;

      default:
        console.log(`ℹ️ Event non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Erreur interne du webhook" },
      { status: 500 }
    );
  }
}
