const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed des horaires d'ouverture...");

  // Supprimer tous les horaires existants
  await prisma.openingHours.deleteMany({});

  // Créer les horaires d'ouverture
  const openingHours = [
    {
      id: 26,
      dayOfWeek: "monday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
    {
      id: 27,
      dayOfWeek: "tuesday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
    {
      id: 28,
      dayOfWeek: "wednesday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
    {
      id: 29,
      dayOfWeek: "thursday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
    {
      id: 30,
      dayOfWeek: "friday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
    {
      id: 31,
      dayOfWeek: "saturday",
      morningStart: new Date("2024-01-01T09:00:00.000Z"),
      morningEnd: new Date("2024-01-01T12:00:00.000Z"),
      afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
      afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
    },
  ];

  for (const hours of openingHours) {
    await prisma.openingHours.create({
      data: hours,
    });
    console.log(`Horaires créés pour ${hours.dayOfWeek}`);
  }

  console.log("Seed des horaires d'ouverture terminé !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
