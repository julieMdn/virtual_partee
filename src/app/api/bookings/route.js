import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { offerId, date, timeSlotId } = body;

    // Vérifier si le créneau est déjà marqué comme non disponible
    const existingUnavailableSlot = await prisma.timeSlot.findFirst({
      where: {
        date: new Date(date),
        startTime: new Date(timeSlotId), // On utilise l'heure comme ID
        isAvailable: false,
      },
    });

    if (existingUnavailableSlot) {
      return NextResponse.json({
        success: false,
        error: "Ce créneau n'est plus disponible",
      });
    }

    // Créer un créneau non disponible
    const timeSlot = await prisma.timeSlot.create({
      data: {
        date: new Date(date),
        startTime: new Date(timeSlotId),
        endTime: new Date(
          new Date(timeSlotId).setHours(new Date(timeSlotId).getHours() + 1)
        ),
        isAvailable: false,
      },
    });

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        status: "confirmed",
        userId: 1,
        offerId: parseInt(offerId),
        timeSlotId: timeSlot.id,
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la création de la réservation",
    });
  }
}

// Optionnel : Ajouter une route GET pour récupérer les réservations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const bookings = await prisma.booking.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      include: {
        offer: true,
        timeSlot: true,
      },
    });

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des réservations",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
