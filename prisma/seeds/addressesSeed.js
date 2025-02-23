const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed des adresses...");

  // Supprimer toutes les adresses existantes
  await prisma.address.deleteMany({});

  // Créer les adresses
  const addresses = [
    {
      id: 1,
      street: "8 rue du cheyroux",
      city: "limoges",
      postCode: "87000",
      country: "france",
      phoneNumber: "0612589632",
      type: "billing",
    },
    {
      id: 2,
      street: "78",
      city: "BRIVE LA GAILLARDE",
      postCode: "19100",
      country: "FRANCE",
      phoneNumber: "0678964523",
      type: "billing",
    },
  ];

  for (const address of addresses) {
    await prisma.address.create({
      data: address,
    });
    console.log(`Adresse créée: ${address.street}, ${address.city}`);
  }

  console.log("Seed des adresses terminé !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
