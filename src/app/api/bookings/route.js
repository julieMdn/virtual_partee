import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { offerId, timeSlotId, date } = body;

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        status: "pending",
        userId: 1, // À remplacer par l'ID de l'utilisateur connecté
        offerId: parseInt(offerId),
        timeSlotId: parseInt(timeSlotId),
      },
    });

    // Mettre à jour le créneau horaire comme non disponible
    await prisma.timeSlot.update({
      where: {
        id: parseInt(timeSlotId),
      },
      data: {
        isAvailable: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
