import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = new Date(searchParams.get("date"));
    const dayOfWeek = date
      .toLocaleDateString("fr-FR", { weekday: "long" })
      .toLowerCase();

    // Vérifier les horaires d'ouverture
    const openingHours = await prisma.openingHours.findFirst({
      where: { dayOfWeek },
    });

    if (!openingHours) {
      return NextResponse.json({
        success: false,
        error: "Nous sommes fermés ce jour-là",
      });
    }

    // Récupérer tous les créneaux
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Récupérer les réservations existantes pour cette date
    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
    });

    // Générer les créneaux disponibles
    const slots = [];

    // Créneaux du matin (9h-12h)
    for (let hour = 9; hour < 12; hour++) {
      slots.push({
        id: hour,
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      });
    }

    // Créneaux de l'après-midi (14h-20h)
    for (let hour = 14; hour < 20; hour++) {
      slots.push({
        id: hour,
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      });
    }

    // Filtrer les créneaux déjà réservés
    const availableSlots = slots.filter((slot) => {
      return !existingBookings.some(
        (booking) => booking.timeSlotId === slot.id
      );
    });

    return NextResponse.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la récupération des créneaux",
    });
  } finally {
    await prisma.$disconnect();
  }
}
