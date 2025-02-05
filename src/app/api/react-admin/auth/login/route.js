import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { user_email: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.user_password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le rôle
    if (user.user_role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Créer le token JWT
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Retourner les informations de l'utilisateur
    return NextResponse.json({
      user: {
        id: user.user_id,
        email: user.user_email,
        firstname: user.user_firstname,
        lastname: user.user_lastname,
        role: user.user_role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
