import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        picture: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        price: "asc",
      },
    });

    return {
      success: true,
      data: offers,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    return {
      success: false,
      error: "Impossible de récupérer les offres",
    };
  }
}
