import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/users
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Si un ID est fourni, retourner un utilisateur spécifique avec ses relations
    if (id) {
      const user = await prisma.user.findUnique({
        where: {
          user_id: parseInt(id),
        },
        include: {
          addresses: true,
          scores: true,
          bookings: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // React Admin envoie les paramètres dans ce format
    const sort = JSON.parse(searchParams.get("sort") || '["id","ASC"]');
    const range = JSON.parse(searchParams.get("range") || "[0,9]");
    const filter = JSON.parse(searchParams.get("filter") || "{}");

    // Convertit 'id' en 'user_id' pour le tri
    const sortField = sort[0] === "id" ? "user_id" : sort[0];

    // Construit la requête Prisma avec les relations
    const users = await prisma.user.findMany({
      skip: range[0],
      take: range[1] - range[0] + 1,
      orderBy: {
        [sortField]: sort[1].toLowerCase(),
      },
      where: filter,
      include: {
        addresses: true,
        scores: true,
        bookings: true,
      },
    });

    // Compte total pour la pagination
    const total = await prisma.user.count({ where: filter });

    // Transformer les utilisateurs pour React Admin
    const transformedUsers = users.map((user) => ({
      id: user.user_id,
      ...user,
    }));

    return NextResponse.json(
      {
        data: transformedUsers,
        total: total,
      },
      {
        headers: {
          "Content-Range": `users ${range[0]}-${range[1]}/${total}`,
        },
      }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/admin/users
export async function POST(request) {
  try {
    const data = await request.json();

    // Création de l'utilisateur avec ses relations
    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: data.user_password,
        user_firstname: data.user_firstname,
        user_lastname: data.user_lastname,
        user_role: data.user_role || "USER",
        user_birthday: data.user_birthday ? new Date(data.user_birthday) : null,
        // Création des adresses associées
        addresses: {
          create: data.addresses || [],
        },
        // Création des scores associés
        scores: {
          create: data.scores || [],
        },
        // Création des réservations associées
        bookings: {
          create: data.bookings || [],
        },
      },
      // Inclure les relations dans la réponse
      include: {
        addresses: true,
        scores: true,
        bookings: true,
      },
    });

    return NextResponse.json({
      data: { id: user.user_id, ...user },
    });
  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id]
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID manquant" }, { status: 400 });
    }

    // Mise à jour de l'utilisateur et de ses relations
    const updatedUser = await prisma.user.update({
      where: {
        user_id: parseInt(id),
      },
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_firstname: data.user_firstname,
        user_lastname: data.user_lastname,
        user_role: data.user_role,
        user_birthday: data.user_birthday
          ? new Date(data.user_birthday)
          : undefined,
        // Mise à jour des adresses
        addresses: {
          upsert:
            data.addresses?.map((address) => ({
              where: { address_id: address.address_id || 0 },
              update: address,
              create: address,
            })) || [],
        },
        // Mise à jour des scores
        scores: {
          upsert:
            data.scores?.map((score) => ({
              where: { score_id: score.score_id || 0 },
              update: score,
              create: score,
            })) || [],
        },
        // Mise à jour des réservations
        bookings: {
          upsert:
            data.bookings?.map((booking) => ({
              where: { booking_id: booking.booking_id || 0 },
              update: booking,
              create: booking,
            })) || [],
        },
      },
      include: {
        addresses: true,
        scores: true,
        bookings: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Suppression de l'utilisateur (les relations seront supprimées automatiquement si onDelete: CASCADE est configuré)
    const user = await prisma.user.delete({
      where: { user_id: parseInt(id) },
      include: {
        addresses: true,
        scores: true,
        bookings: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
