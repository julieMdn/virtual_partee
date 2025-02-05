import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Récupérer le token du header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
    });

    if (!user || user.user_role !== "ADMIN") {
      return NextResponse.json(
        { error: "Utilisateur non autorisé" },
        { status: 403 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token check error:", error);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}
