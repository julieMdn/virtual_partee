const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.timeSlot.deleteMany({});

  // Créer des créneaux pour chaque heure de 9h à 20h
  for (let hour = 9; hour < 20; hour++) {
    const startTime = new Date();
    startTime.setHours(hour, 0, 0, 0);

    await prisma.timeSlot.create({
      data: {
        startTime: startTime,
        endTime: new Date(startTime.setHours(hour + 1)),
        isAvailable: true,
      },
    });

    console.log(`Créneau créé: ${hour}:00 - ${hour + 1}:00`);
  }

  console.log("Les créneaux horaires ont été créés avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
