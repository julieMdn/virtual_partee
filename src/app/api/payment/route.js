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
    console.log("Début de la requête de paiement");

    // Vérification de l'authentification
    const headersList = await headers();
    const authHeader = headersList.get("Authorization");
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("token")?.value;

    // Essayer d'obtenir le token soit des cookies, soit du header Authorization
    const token = cookieToken || (authHeader ? authHeader.split(" ")[1] : null);

    console.log("Token trouvé:", token ? "Oui" : "Non");

    if (!token) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // Décoder le token pour obtenir l'ID de l'utilisateur
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUserId = decodedToken.userId;
    console.log("UserId décodé:", decodedUserId);

    // Récupérer les données du panier
    const data = await request.json();
    const { cartItems } = data;
    console.log("Données reçues:", data);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    console.log("Création de la session Stripe...");
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
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
      console.log("Traitement de l'item:", JSON.stringify(item, null, 2));

      // Combiner la date et l'heure
      const [hours, minutes] = item.timeSlot.startTime.split(":");
      const startDateTime = new Date(item.selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);

      console.log("Date et heure de début:", startDateTime);
      console.log("Date et heure de fin:", endDateTime);

      // Créer le créneau horaire
      const timeSlot = await prisma.timeSlot.create({
        data: {
          date: new Date(item.selectedDate),
          startTime: startDateTime,
          endTime: endDateTime,
          isAvailable: false,
        },
      });

      console.log("Créneau horaire créé:", timeSlot);

      // Créer la réservation
      const booking = await prisma.booking.create({
        data: {
          eventDate: startDateTime, // Utiliser la date/heure de l'événement
          status: "pending",
          stripeSessionId: stripeSession.id,
          userId: decodedUserId,
          offerId: item.id,
          timeSlotId: timeSlot.id,
        },
      });

      console.log("Réservation créée:", booking);
    }

    console.log(
      "Session Stripe créée avec succès et réservations enregistrées"
    );
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Erreur détaillée lors de la création de la session:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      {
        error: "Erreur lors de la création de la session de paiement",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
