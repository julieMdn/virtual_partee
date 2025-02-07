// dataprovider <-> prisma

import { defaultHandler } from "ra-data-simple-prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

const handler = async (req) => {
  const body = await req.json();

  if (body.resource === "User") {
    try {
      // Vérifions d'abord si nous avons des adresses dans la base de données
      const addressCount = await prismaClient.address.count();
      console.log("Nombre total d'adresses:", addressCount);

      // Vérifions les relations existantes
      const userWithAddresses = await prismaClient.user.findFirst({
        where: { id: 1 },
        include: {
          addresses: true,
        },
      });
      console.log(
        "User avec adresses:",
        JSON.stringify(userWithAddresses, null, 2)
      );

      // Requête principale
      const users = await prismaClient.user.findMany({
        skip: body.pagination?.offset || 0,
        take: body.pagination?.limit || 10,
        include: {
          addresses: true,
        },
      });

      console.log(
        "Tous les utilisateurs avec adresses:",
        JSON.stringify(users, null, 2)
      );

      return NextResponse.json({
        data: users,
        total: users.length,
      });
    } catch (error) {
      console.error("Erreur Prisma:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const result = await defaultHandler(body, prismaClient);
  return NextResponse.json(result);
};

export { handler as GET, handler as POST };
