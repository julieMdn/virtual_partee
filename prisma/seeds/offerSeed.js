const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOffers() {
  try {
    // Supprime toutes les offres existantes
    await prisma.offer.deleteMany({});

    // Réinitialise l'auto-increment
    await prisma.$executeRaw`ALTER TABLE Offer AUTO_INCREMENT = 1`;

    // Crée les nouvelles offres
    const offers = [
      {
        title: "Initiation collective au golf (1h)",
        description:
          "Initiez-vous au golf en famille ou entre amis afin d'avoir les bases nécessaires pour vous amuser très rapidement.  – 4 personnes maximum – Niveau débutant – à partir de 5 ans – Indoor – Matériel compris",
        price: 20,
        picture:
          "https://res.cloudinary.com/dvngzrunp/image/upload/v1738930676/initiation-collective-golf.jpg_ulkwyv.webp",
        createdAt: new Date("2025-02-24T10:30:41.200Z"),
      },
      {
        title: "Entraînement et parcours sur simulateur Trackman en autonomie",
        description:
          "Entrainez-vous avec la technologie Trackman ou jouez, seul ou entre amis, sur un des nombreux célèbres parcours proposés par le simulateur.",
        price: 30,
        picture:
          "https://res.cloudinary.com/dvngzrunp/image/upload/v1738932527/entrainement-parcours-golf-sur-simulateur.jpg_ozmid5.webp",
        createdAt: new Date("2025-02-24T10:33:22.346Z"),
      },
    ];

    // Insère les offres dans la base de données
    for (const offer of offers) {
      await prisma.offer.create({
        data: offer,
      });
    }

    console.log("Les offres ont été ajoutées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout des offres:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedOffers;
