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
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error("❌ Erreur de signature webhook:", err.message);
      return NextResponse.json(
        { error: `Erreur de signature webhook: ${err.message}` },
        { status: 400 }
      );
    }

    // Gérer l'événement
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Créer d'abord le paiement
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

        // Mettre à jour les réservations
        const bookings = await prisma.booking.findMany({
          where: {
            stripeSessionId: session.id,
          },
        });

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

        console.log(`✅ ${updateResult.count} réservation(s) mise(s) à jour`);
      } catch (error) {
        console.error("❌ Erreur lors du traitement de la session:", error);
        throw error;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    return NextResponse.json(
      { error: "Erreur interne du webhook" },
      { status: 500 }
    );
  }
}
