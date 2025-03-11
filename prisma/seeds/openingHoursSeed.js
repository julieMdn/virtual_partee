const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    // Supprime toutes les horaires existantes
    await prisma.openingHours.deleteMany({});

    // Réinitialise l'auto-increment
    await prisma.$executeRaw`ALTER TABLE OpeningHours AUTO_INCREMENT = 1`;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const day of days) {
      // On ne crée les horaires que pour les jours de semaine (lundi au samedi)
      if (day !== "sunday") {
        await prisma.openingHours.create({
          data: {
            dayOfWeek: day,
            morningStart: new Date(new Date().setHours(9, 0, 0, 0)),
            morningEnd: new Date(new Date().setHours(12, 0, 0, 0)),
            afternoonStart: new Date(new Date().setHours(14, 0, 0, 0)),
            afternoonEnd: new Date(new Date().setHours(20, 0, 0, 0)),
          },
        });
      }
    }

    console.log("Les horaires d'ouverture ont été ajoutés avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout des horaires:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
