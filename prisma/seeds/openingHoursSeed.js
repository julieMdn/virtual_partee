const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.openingHours.deleteMany({});

  const daysOfWeek = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  for (const day of daysOfWeek) {
    await prisma.openingHours.create({
      data: {
        dayOfWeek: day,
        morningStart: new Date("2024-01-01T09:00:00.000Z"),
        morningEnd: new Date("2024-01-01T12:00:00.000Z"),
        afternoonStart: new Date("2024-01-01T14:00:00.000Z"),
        afternoonEnd: new Date("2024-01-01T20:00:00.000Z"),
      },
    });
  }

  console.log("Les horaires d'ouverture ont été créés avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
