import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies, headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

// Vérification de la clé Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "STRIPE_SECRET_KEY n'est pas définie dans les variables d'environnement"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Vérification de l'authentification
    const headersList = await headers();
    const authHeader = headersList.get("Authorization");
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("token")?.value;

    // Essayer d'obtenir le token soit des cookies, soit du header Authorization
    const token = cookieToken || (authHeader ? authHeader.split(" ")[1] : null);

    if (!token) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUserId = decodedToken.userId;

    // Récupérer les données du panier
    const data = await request.json();
    const { cartItems } = data;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Panier invalide ou vide" },
        { status: 400 }
      );
    }

    // Créer la session Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: decodedUserId.toString(),
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: `Le ${new Date(item.selectedDate).toLocaleDateString(
              "fr-FR"
            )} à ${item.timeSlot.startTime}`,
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pages/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pages/payment/cancel`,
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            date: item.selectedDate,
            timeSlot: item.timeSlot,
          }))
        ),
      },
    });

    // Créer les réservations et les créneaux horaires
    for (const item of cartItems) {
      // Combiner la date et l'heure
      const [hours, minutes] = item.timeSlot.startTime.split(":");
      const startDateTime = new Date(item.selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);

      // Créer le créneau horaire
      const timeSlot = await prisma.timeSlot.create({
        data: {
          date: new Date(item.selectedDate),
          startTime: startDateTime,
          endTime: endDateTime,
          isAvailable: false,
        },
      });

      // Créer la réservation
      const booking = await prisma.booking.create({
        data: {
          status: "pending",
          stripeSessionId: stripeSession.id,
          userId: decodedUserId,
          offerId: item.id,
          timeSlotId: timeSlot.id,
        },
      });
    }

    console.log(
      "Session Stripe créée avec succès et réservations enregistrées"
    );

    return NextResponse.json({
      success: true,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
