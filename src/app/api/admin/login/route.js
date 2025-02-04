import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Vérifier si l'utilisateur existe et a le rôle admin
    const admin = await prisma.user.findFirst({
      where: {
        user_email: email,
        user_role: "admin",
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, admin.user_password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Créer un token JWT
    const token = jwt.sign(
      {
        userId: admin.user_id,
        role: admin.user_role,
      },
      process.env.NEXTAUTH_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    // Retourner le token dans un cookie httpOnly
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 heure
    });

    return response;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
