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
    console.log("🔵 Webhook Stripe reçu");
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      console.log("❌ Signature Stripe manquante");
      return NextResponse.json(
        { error: "Signature Stripe manquante" },
        { status: 400 }
      );
    }

    console.log("✅ Signature Stripe présente");
    const event = await verifyStripeSignature(request, sig);
    console.log("🎯 Type d'événement reçu:", event.type);

    // Gérer l'événement de paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(
        "💳 Session Stripe complétée:",
        JSON.stringify(session, null, 2)
      );

      try {
        // Créer d'abord le paiement
        console.log("💰 Création du paiement...");
        console.log("Montant total TTC (en centimes):", session.amount_total);
        const amountTTC = session.amount_total / 100; // Convertir en euros
        console.log("Montant total TTC (en euros):", amountTTC);
        const tvaRate = 0.2; // TVA à 20%
        // Pour calculer le montant HT à partir du TTC : TTC / (1 + tvaRate)
        const amountHT = amountTTC / (1 + tvaRate);
        const tvaAmount = amountTTC - amountHT;

        console.log("Montant HT:", amountHT);
        console.log("Montant TVA:", tvaAmount);

        const payment = await prisma.payment.create({
          data: {
            amount: amountHT,
            tvaAmount: tvaAmount,
            date: new Date(),
            status: "completed",
          },
        });
        console.log("✅ Paiement créé:", payment);

        // Mettre à jour la réservation avec le payment_id et le statut
        console.log("🔄 Mise à jour de la réservation...");
        console.log(
          "Recherche de la réservation avec stripeSessionId:",
          session.id
        );
        const updateResult = await prisma.booking.updateMany({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            status: "confirmed",
            paymentId: payment.id,
            // La date de création est automatiquement gérée par @default(now())
          },
        });
        console.log("✅ Résultat de la mise à jour:", updateResult);

        if (updateResult.count === 0) {
          console.log("⚠️ Aucune réservation trouvée avec ce stripeSessionId");
        }
      } catch (error) {
        console.error("❌ Erreur lors du traitement de la session:", error);
        console.error("Stack trace:", error.stack);
        throw error; // Relancer l'erreur pour la capturer dans le catch principal
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erreur webhook:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 500 }
    );
  }
}
