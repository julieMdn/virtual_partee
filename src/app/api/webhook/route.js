import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// Cette fonction vérifie la signature du webhook Stripe
const verifyStripeSignature = async (request, sig) => {
  const chunks = [];
  for await (const chunk of request.body) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");

  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Erreur de signature webhook: ${err.message}`);
    throw new Error("Invalid signature");
  }
};

export async function POST(request) {
  try {
    const headersList = headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Signature Stripe manquante" },
        { status: 400 }
      );
    }

    const event = await verifyStripeSignature(request, sig);

    // Gérer l'événement de paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Mettre à jour toutes les réservations associées à cette session
      await prisma.booking.updateMany({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          status: "confirmed",
          paymentIntentId: session.payment_intent,
        },
      });

      console.log(`Réservations confirmées pour la session ${session.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 500 }
    );
  }
}
