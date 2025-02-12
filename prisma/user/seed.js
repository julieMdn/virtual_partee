const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Hasher les mots de passe
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password456", 10);
  const password3 = await bcrypt.hash("password789", 10);

  const users = [
    {
      username: "jean.dupont",
      email: "jean.dupont@example.com",
      password: password1,
      firstName: "Jean",
      lastName: "Dupont",
      role: "user",
      birthday: new Date("1990-05-15"),
    },
    {
      username: "marie.martin",
      email: "marie.martin@example.com",
      password: password2,
      firstName: "Marie",
      lastName: "Martin",
      role: "user",
      birthday: new Date("1988-09-23"),
    },
    {
      username: "pierre.durand",
      email: "pierre.durand@example.com",
      password: password3,
      firstName: "Pierre",
      lastName: "Durand",
      role: "user",
      birthday: new Date("1995-12-10"),
    },
  ];

  console.log("Début de la création des utilisateurs...");

  for (const user of users) {
    try {
      const createdUser = await prisma.user.create({
        data: user,
      });
      console.log(`Utilisateur créé avec succès: ${createdUser.email}`);
    } catch (error) {
      if (error.code === "P2002") {
        console.log(`L'utilisateur ${user.email} existe déjà.`);
      } else {
        console.error(`Erreur lors de la création de ${user.email}:`, error);
      }
    }
  }

  console.log("Création des utilisateurs terminée !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
