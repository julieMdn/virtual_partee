import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/users
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Si un ID est fourni, retourner un utilisateur spécifique
    if (id) {
      const user = await prisma.user.findUnique({
        where: {
          user_id: parseInt(id),
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

    // Construit la requête Prisma
    const users = await prisma.user.findMany({
      skip: range[0],
      take: range[1] - range[0] + 1,
      orderBy: {
        [sortField]: sort[1].toLowerCase(),
      },
      where: filter,
    });

    // Compte total pour la pagination
    const total = await prisma.user.count({ where: filter });

    // Transformer les utilisateurs pour React Admin
    const transformedUsers = users.map((user) => ({
      id: user.user_id,
      ...user,
    }));

    // Format de réponse exact de React Admin
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

    const user = await prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: data.user_password,
        user_firstname: data.user_firstname,
        user_lastname: data.user_lastname,
        user_role: data.user_role || "USER",
        user_birthday: data.user_birthday ? new Date(data.user_birthday) : null,
      },
    });

    // Transforme la réponse pour React Admin
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

    const user = await prisma.user.delete({
      where: { user_id: parseInt(id) },
    });

    // React Admin attend l'objet supprimé en réponse
    return NextResponse.json(user);
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
