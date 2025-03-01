import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
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

    // Décoder le token pour obtenir l'ID de l'utilisateur
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Récupérer les réservations avec les relations
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        offer: true,
        timeSlot: true,
        payment: true,
      },
      orderBy: {
        eventDate: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}
