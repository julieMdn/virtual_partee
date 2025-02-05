import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Body reçu:", body);

    const { username, password } = body;

    if (!username || !password) {
      console.log("Username ou password manquant");
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    console.log("Recherche utilisateur avec username:", username);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ user_name: username }, { user_email: username }],
      },
    });

    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    console.log("Vérification du mot de passe");
    const valid = await bcrypt.compare(password, user.user_password);
    console.log("Mot de passe valide:", valid ? "Oui" : "Non");

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    console.log("Vérification du rôle:", user.user_role);
    if (user.user_role.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const userData = {
      id: user.user_id,
      fullName: `${user.user_firstname} ${user.user_lastname}`,
      role: user.user_role,
    };

    console.log("Connexion réussie:", userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
