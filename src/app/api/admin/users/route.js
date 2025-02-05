import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

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
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
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
    const data = await request.json();
    const { id, ...updateData } = data;

    const user = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: {
        user_name: updateData.user_name,
        user_email: updateData.user_email,
        user_firstname: updateData.user_firstname,
        user_lastname: updateData.user_lastname,
        user_role: updateData.user_role,
        user_birthday: updateData.user_birthday
          ? new Date(updateData.user_birthday)
          : null,
      },
    });

    // React Admin attend l'objet mis à jour en réponse
    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
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
