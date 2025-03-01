import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = new Date(searchParams.get("date"));
    const offerId = searchParams.get("offerId");
    const now = new Date();

    // Récupérer l'offre pour connaître sa durée
    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(offerId) },
      select: { duration: true },
    });

    if (!offer) {
      return NextResponse.json({
        success: false,
        error: "Offre non trouvée",
      });
    }

    const durationInHours = offer.duration / 60; // Convertir les minutes en heures

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
      h < openingHours.morningEnd.getHours() - durationInHours + 1;
      h++
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(h, 0, 0, 0);

      if (isToday && slotStart <= now) {
        continue;
      }

      const slotEnd = new Date(slotStart);
      slotEnd.setHours(h + durationInHours);

      // Vérifier si le créneau complet est disponible
      const isReserved = await prisma.timeSlot.findFirst({
        where: {
          date: {
            gte: slotStart,
            lt: slotEnd,
          },
          isAvailable: false,
        },
      });

      if (!isReserved) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }

    // Créneaux de l'après-midi
    for (
      let h = openingHours.afternoonStart.getHours();
      h < openingHours.afternoonEnd.getHours() - durationInHours + 1;
      h++
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(h, 0, 0, 0);

      if (isToday && slotStart <= now) {
        continue;
      }

      const slotEnd = new Date(slotStart);
      slotEnd.setHours(h + durationInHours);

      // Vérifier si le créneau complet est disponible
      const isReserved = await prisma.timeSlot.findFirst({
        where: {
          date: {
            gte: slotStart,
            lt: slotEnd,
          },
          isAvailable: false,
        },
      });

      if (!isReserved) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }

    console.log("Received request for offerId:", offerId);
    console.log("Offer found:", offer);
    console.log("Duration in hours:", durationInHours);
    console.log("Generated slots:", availableSlots);

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
