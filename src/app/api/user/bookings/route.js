import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Récupérer le token du cookie ou de l'en-tête Authorization
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("token")?.value;
    const authHeader = request.headers.get("authorization");

    console.log("Cookie token:", cookieToken ? "Présent" : "Absent");
    console.log("Auth header:", authHeader ? "Présent" : "Absent");

    // Essayer d'obtenir le token soit des cookies, soit du header Authorization
    let token = cookieToken;

    // Si pas de token dans les cookies, essayer de l'extraire de l'en-tête Authorization
    if (!token && authHeader) {
      // Vérifier si le format est "Bearer <token>"
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    console.log("Token trouvé:", token ? "Oui" : "Non");

    if (!token) {
      console.log("Aucun token trouvé");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que le token est une chaîne valide
    if (typeof token !== "string" || token.trim() === "") {
      console.log("Token invalide (vide ou non-chaîne)");
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Décoder le token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token décodé:", decodedToken);
    } catch (tokenError) {
      console.error("Erreur lors de la vérification du token:", tokenError);
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    const userId = decodedToken.userId;
    console.log("UserId:", userId);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Compter les réservations
    const bookingsCount = await prisma.booking.count({
      where: { userId: userId },
    });

    console.log(
      `Nombre de réservations pour l'utilisateur ${userId}:`,
      bookingsCount
    );

    // Récupérer les réservations avec les relations
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        offer: {
          include: {
            activity: true,
          },
        },
      },
    });

    console.log("Réservations récupérées:", bookings.length);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    console.error("Stack trace:", error.stack);

    // Vérifier si c'est une erreur Prisma
    if (error.code) {
      console.error("Code d'erreur Prisma:", error.code);
      console.error("Message d'erreur Prisma:", error.message);
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des réservations",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
