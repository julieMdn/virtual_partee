import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies, headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Vérification de l'authentification
    const headersList = headers();
    const authHeader = headersList.get("Authorization");
    const cookieToken = cookies().get("token")?.value;

    // Essayer d'obtenir le token soit des cookies, soit du header Authorization
    const token = cookieToken || (authHeader ? authHeader.split(" ")[1] : null);

    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Décodage du token pour obtenir l'ID de l'utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { amount, cartItems } = await request.json();

    // Créer une description détaillée pour le paiement
    const description = cartItems
      .map(
        (item) =>
          `${item.title} - ${new Date(item.selectedDate).toLocaleDateString(
            "fr-FR"
          )} à ${item.timeSlot.startTime}`
      )
      .join(", ");

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: userId.toString(), // ID de l'utilisateur pour le webhook
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: `Le ${new Date(item.selectedDate).toLocaleDateString(
              "fr-FR"
            )} à ${item.timeSlot.startTime}`,
          },
          unit_amount: item.price * 100, // Stripe utilise les centimes
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
            timeSlot: item.timeSlot.id,
          }))
        ),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
