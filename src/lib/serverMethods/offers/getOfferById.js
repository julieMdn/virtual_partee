import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOfferById(id) {
  try {
    const offer = await prisma.offer.findUnique({
      where: {
        id: parseInt(id),
      },
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
    });

    if (!offer) {
      return {
        success: false,
        error: "Offre non trouvée",
      };
    }

    return {
      success: true,
      data: offer,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'offre:", error);
    return {
      success: false,
      error: "Impossible de récupérer l'offre",
    };
  }
}
