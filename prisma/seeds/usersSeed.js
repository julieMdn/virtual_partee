const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed des utilisateurs...");

  // Supprimer tous les utilisateurs existants
  await prisma.user.deleteMany({});

  // Créer les utilisateurs
  const users = [
    {
      id: 1,
      username: "jeanDpt",
      email: "jean.dupont@mail.com",
      password: "$2b$10$J9s3hYdD/p4t5tyBrM6nRuYAe6NwxMxaiXvHytEfFetCckMyfvEZS",
      firstName: "jean",
      lastName: "dupont",
      createdAt: new Date("2025-02-12T09:38:46.151Z"),
      role: "admin",
      birthday: new Date("1970-01-01T00:00:00.000Z"),
    },
    {
      id: 3,
      username: "marie.martin",
      email: "marie.martin@example.com",
      password: "$2a$10$mkHM5lFWHAuLHk9onyCXn.E6b9AboFf/AeT1KWXTfQdgQnOrT6Ekm",
      firstName: "Marie",
      lastName: "Martin",
      createdAt: new Date("2025-02-12T15:40:44.050Z"),
      role: "user",
      birthday: new Date("1988-09-23T00:00:00.000Z"),
    },
    {
      id: 4,
      username: "pierre.durand",
      email: "pierre.durand@example.com",
      password: "$2a$10$goiuWUPH0nVTcQ1MHTVCP.eoN/1Z5wCLqcmu.0kgLr.UFsACMFjSu",
      firstName: "Pierre",
      lastName: "Durand",
      createdAt: new Date("2025-02-12T15:40:44.051Z"),
      role: "user",
      birthday: new Date("1995-12-10T00:00:00.000Z"),
    },
    {
      id: 5,
      username: "lauraTnt",
      email: "laura.tenin@mail.com",
      password: "$2a$10$5yxKFTSPZsCIiOYUGjX/Z.FCywN4CMNN08nwO0hn7G..jV54TBh0O",
      firstName: "laura",
      lastName: "TENIN",
      createdAt: new Date("2025-02-12T16:55:57.062Z"),
      role: "user",
      birthday: new Date("1995-02-01T00:00:00.000Z"),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
    console.log(`Utilisateur créé: ${user.username}`);
  }

  console.log("Seed des utilisateurs terminé !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
