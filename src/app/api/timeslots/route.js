import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = new Date(searchParams.get("date"));
    const now = new Date();

    // Convertir le jour en anglais pour correspondre à la base de données
    const days = {
      dimanche: "sunday",
      lundi: "monday",
      mardi: "tuesday",
      mercredi: "wednesday",
      jeudi: "thursday",
      vendredi: "friday",
      samedi: "saturday",
    };

    const dayOfWeek =
      days[date.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase()];

    // 1. Récupérer les horaires d'ouverture pour ce jour
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
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
        },
        isAvailable: false,
      },
    });

    // 3. Générer tous les créneaux disponibles
    const availableSlots = [];
    const isToday = date.toDateString() === now.toDateString();

    // Créneaux du matin
    for (
      let h = openingHours.morningStart.getHours();
      h < openingHours.morningEnd.getHours();
      h++
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(h, 0, 0, 0);

      // Vérifier si le créneau n'est pas déjà passé pour aujourd'hui
      if (isToday && slotStart <= now) {
        continue; // Sauter ce créneau
      }

      // Vérifier si le créneau n'est pas déjà réservé
      const isReserved = unavailableSlots.some(
        (slot) => slot.startTime.getHours() === h
      );

      if (!isReserved) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: new Date(slotStart.setHours(h + 1)).toISOString(),
        });
      }
    }

    // Créneaux de l'après-midi
    for (
      let h = openingHours.afternoonStart.getHours();
      h < openingHours.afternoonEnd.getHours();
      h++
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(h, 0, 0, 0);

      // Vérifier si le créneau n'est pas déjà passé pour aujourd'hui
      if (isToday && slotStart <= now) {
        continue; // Sauter ce créneau
      }

      // Vérifier si le créneau n'est pas déjà réservé
      const isReserved = unavailableSlots.some(
        (slot) => slot.startTime.getHours() === h
      );

      if (!isReserved) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: new Date(slotStart.setHours(h + 1)).toISOString(),
        });
      }
    }

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
