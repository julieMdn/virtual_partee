const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed des créneaux horaires...");

  // Supprimer tous les créneaux existants
  await prisma.timeSlot.deleteMany({});

  // Date du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Créneaux du matin (9h-12h)
  for (let hour = 9; hour < 12; hour++) {
    const startTime = new Date(today);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(hour + 1, 0, 0, 0);

    await prisma.timeSlot.create({
      data: {
        date: today,
        startTime,
        endTime,
        isAvailable: true,
      },
    });
    console.log(`Créneau créé: ${hour}:00 - ${hour + 1}:00`);
  }

  // Créneaux de l'après-midi (14h-20h)
  for (let hour = 14; hour < 20; hour++) {
    const startTime = new Date(today);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(hour + 1, 0, 0, 0);

    await prisma.timeSlot.create({
      data: {
        date: today,
        startTime,
        endTime,
        isAvailable: true,
      },
    });
    console.log(`Créneau créé: ${hour}:00 - ${hour + 1}:00`);
  }

  console.log("Seed des créneaux horaires terminé !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
