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
        duration: 120,
      },
      {
        title: "Entraînement et parcours sur simulateur Trackman en autonomie",
        description:
          "Entrainez-vous avec la technologie Trackman ou jouez, seul ou entre amis, sur un des nombreux célèbres parcours proposés par le simulateur.",
        price: 30,
        picture:
          "https://res.cloudinary.com/dvngzrunp/image/upload/v1738932527/entrainement-parcours-golf-sur-simulateur.jpg_ozmid5.webp",
        createdAt: new Date("2025-02-24T10:33:22.346Z"),
        duration: 60,
      },
      {
        title: "Performance Pro Golf - Analyse et Optimisation",
        description:
          "Session personnalisée pour les golfeurs professionnels souhaitant optimiser leurs performances. Inclut une analyse complète du swing avec la technologie Trackman 4, analyse biomécanique détaillée, et recommandations d'amélioration ciblées. La séance comprend :\n\n- Analyse approfondie du swing en 3D\n- Mesures précises de la vitesse de la tête de club, du spin et de la trajectoire\n- Évaluation de la régularité et de la répétabilité\n- Conseils personnalisés pour l'optimisation de la performance\n- Rapport détaillé post-session\n\nIdéal pour les professionnels cherchant à affiner leur technique et améliorer leurs résultats en compétition.",
        price: 50,
        picture:
          "https://res.cloudinary.com/dvngzrunp/image/upload/v1738932527/pro-golf-performance.jpg",
        createdAt: new Date(),
        duration: 120,
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

// Exécute la fonction de seed
seedOffers().catch((error) => {
  console.error("Erreur lors du seeding des offres:", error);
  process.exit(1);
});

module.exports = seedOffers;
