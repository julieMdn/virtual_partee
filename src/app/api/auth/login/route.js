import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Recherche de l'utilisateur avec le rôle admin
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        role: "admin",
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides ou droits insuffisants" },
        { status: 401 }
      );
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Création de l'objet utilisateur à renvoyer
    const userResponse = {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      email: user.email,
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
