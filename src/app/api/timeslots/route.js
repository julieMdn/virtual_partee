import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = new Date(searchParams.get("date"));

    // 1. Récupérer les horaires d'ouverture pour ce jour
    const dayOfWeek = date.toLocaleDateString("fr-FR", { weekday: "long" });
    const openingHours = await prisma.openingHours.findFirst({
      where: { dayOfWeek },
    });

    if (!openingHours) {
      return NextResponse.json({
        success: false,
        error: "Ce jour n'est pas ouvert",
      });
    }

    // 2. Récupérer les créneaux non disponibles pour cette date
    const unavailableSlots = await prisma.timeSlot.findMany({
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        isAvailable: false,
      },
    });

    // 3. Générer tous les créneaux d'une heure basés sur les horaires d'ouverture
    const allSlots = [];

    // Créneaux du matin
    for (
      let h = openingHours.morningStart.getHours();
      h < openingHours.morningEnd.getHours();
      h++
    ) {
      allSlots.push({
        startTime: `${h.toString().padStart(2, "0")}:00`,
        endTime: `${(h + 1).toString().padStart(2, "0")}:00`,
        isAvailable: !unavailableSlots.some(
          (slot) => slot.startTime.getHours() === h
        ),
      });
    }

    // Créneaux de l'après-midi
    for (
      let h = openingHours.afternoonStart.getHours();
      h < openingHours.afternoonEnd.getHours();
      h++
    ) {
      allSlots.push({
        startTime: `${h.toString().padStart(2, "0")}:00`,
        endTime: `${(h + 1).toString().padStart(2, "0")}:00`,
        isAvailable: !unavailableSlots.some(
          (slot) => slot.startTime.getHours() === h
        ),
      });
    }

    return NextResponse.json({
      success: true,
      data: allSlots.filter((slot) => slot.isAvailable),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la récupération des créneaux",
    });
  }
}
