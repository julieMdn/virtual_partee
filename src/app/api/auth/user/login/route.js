import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log("Tentative de connexion pour:", email);

    // Vérification des champs requis
    if (!email || !password) {
      console.log("Email ou mot de passe manquant");
      return NextResponse.json(
        {
          success: false,
          message: "Email et mot de passe requis",
        },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur (excluant les admins)
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        role: "user", // On s'assure que c'est bien un utilisateur normal
      },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        birthday: true,
        addresses: {
          select: {
            street: true,
            city: true,
            postCode: true,
            country: true,
            phoneNumber: true,
          },
        },
      },
    });

    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");
    if (user) {
      console.log("Role de l'utilisateur:", user.role);
    }

    // Vérification si l'utilisateur existe
    if (!user) {
      console.log("Utilisateur non trouvé ou rôle incorrect");
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect",
        },
        { status: 401 }
      );
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Mot de passe valide:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Mot de passe invalide");
      return NextResponse.json(
        {
          success: false,
          message: "Email ou mot de passe incorrect",
        },
        { status: 401 }
      );
    }

    // Création du token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Token généré avec succès");

    // Retourne la réponse avec le token et les informations de l'utilisateur
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          addresses: user.addresses,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la connexion",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
