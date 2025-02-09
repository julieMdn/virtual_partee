// dataprovider <-> prisma

import { defaultHandler } from "ra-data-simple-prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

const handler = async (req) => {
  const body = await req.json();

  if (body.resource === "User") {
    try {
      if (body.method === "getOne") {
        console.log("Requête getOne pour l'utilisateur id:", body.params.id);

        const user = await prismaClient.user.findUnique({
          where: { id: parseInt(body.params.id) },
          include: {
            addresses: true,
          },
        });

        console.log("Utilisateur trouvé:", user);

        if (!user) {
          console.log("Utilisateur non trouvé");
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const response = {
          data: user,
        };

        console.log("Réponse formatée:", response);
        return NextResponse.json(response);
      }

      // Ajout de la gestion de la mise à jour
      if (body.method === "update") {
        console.log("Données reçues pour la mise à jour:", body.params.data);

        try {
          // Mise à jour de l'utilisateur
          const updatedUser = await prismaClient.user.update({
            where: {
              id: parseInt(body.params.id),
            },
            data: {
              email: body.params.data.email,
              firstName: body.params.data.firstName,
              lastName: body.params.data.lastName,
              birthday: body.params.data.birthday
                ? new Date(body.params.data.birthday)
                : undefined,
            },
            include: {
              addresses: true,
            },
          });

          // Mise à jour des adresses
          if (body.params.data.addresses) {
            // Adresse de facturation
            const billingAddress = updatedUser.addresses.find(
              (addr) => addr.type === "billing"
            );
            if (billingAddress) {
              await prismaClient.address.update({
                where: { id: billingAddress.id },
                data: {
                  street: body.params.data.addresses[0]?.street,
                  city: body.params.data.addresses[0]?.city,
                  postCode: body.params.data.addresses[0]?.postCode,
                  country: body.params.data.addresses[0]?.country,
                  phoneNumber: body.params.data.addresses[0]?.phoneNumber,
                },
              });
            } else {
              const newBillingAddress = await prismaClient.address.create({
                data: {
                  street: body.params.data.addresses[0]?.street || "",
                  city: body.params.data.addresses[0]?.city || "",
                  postCode: body.params.data.addresses[0]?.postCode || "",
                  country: body.params.data.addresses[0]?.country || "",
                  phoneNumber: body.params.data.addresses[0]?.phoneNumber || "",
                  type: "billing",
                  users: {
                    connect: {
                      id: updatedUser.id,
                    },
                  },
                },
              });
            }

            // Adresse de livraison
            const shippingAddress = updatedUser.addresses.find(
              (addr) => addr.type === "shipping"
            );
            if (shippingAddress) {
              await prismaClient.address.update({
                where: { id: shippingAddress.id },
                data: {
                  street: body.params.data.addresses[1]?.street,
                  city: body.params.data.addresses[1]?.city,
                  postCode: body.params.data.addresses[1]?.postCode,
                  country: body.params.data.addresses[1]?.country,
                },
              });
            } else {
              const newShippingAddress = await prismaClient.address.create({
                data: {
                  street: body.params.data.addresses[1]?.street || "",
                  city: body.params.data.addresses[1]?.city || "",
                  postCode: body.params.data.addresses[1]?.postCode || "",
                  country: body.params.data.addresses[1]?.country || "",
                  phoneNumber:
                    body.params.data.addresses[1]?.phoneNumber ||
                    body.params.data.addresses[0]?.phoneNumber ||
                    "",
                  type: "shipping",
                  users: {
                    connect: {
                      id: updatedUser.id,
                    },
                  },
                },
              });
            }
          }

          // Récupérer l'utilisateur final avec ses adresses mises à jour
          const finalUser = await prismaClient.user.findUnique({
            where: { id: updatedUser.id },
            include: { addresses: true },
          });

          console.log("Utilisateur mis à jour avec succès:", finalUser);
          return NextResponse.json({ data: finalUser });
        } catch (error) {
          console.error("Erreur lors de la mise à jour:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }

      // Pour la liste des utilisateurs
      const users = await prismaClient.user.findMany({
        skip: body.pagination?.offset || 0,
        take: body.pagination?.limit || 10,
        include: {
          addresses: true,
        },
      });

      const total = await prismaClient.user.count();

      const response = {
        data: users,
        total: total,
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Erreur Prisma:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const result = await defaultHandler(body, prismaClient);

  return NextResponse.json(result);
};

export { handler as GET, handler as POST };
