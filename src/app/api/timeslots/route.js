import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const selectedDate = new Date(dateStr);

  try {
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        isAvailable: true,
        booking: {
          is: null,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const formattedTimeSlots = timeSlots.map((slot) => ({
      id: slot.id,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isAvailable: slot.isAvailable,
    }));

    return NextResponse.json({
      success: true,
      data: formattedTimeSlots,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des créneaux:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des créneaux horaires",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
