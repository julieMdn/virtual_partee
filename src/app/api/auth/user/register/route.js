import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      birthday,
      address,
    } = await request.json();

    // Vérification des champs requis
    if (!email || !password || !firstName || !lastName || !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Tous les champs obligatoires doivent être remplis",
        },
        { status: 400 }
      );
    }

    // Normalisation des données avant la recherche
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    // Vérifier si l'email existe déjà avec les valeurs normalisées
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Cet email ou nom d'utilisateur existe déjà",
        },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur avec son adresse
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName:
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
        username: normalizedUsername,
        birthday: birthday ? new Date(birthday) : null,
        addresses: address
          ? {
              create: {
                street: address.street,
                city: address.city
                  ? address.city.charAt(0).toUpperCase() +
                    address.city.slice(1).toLowerCase()
                  : null,
                postCode: address.postCode,
                country: address.country
                  ? address.country.charAt(0).toUpperCase() +
                    address.country.slice(1).toLowerCase()
                  : null,
                phoneNumber: address.phoneNumber,
              },
            }
          : undefined,
      },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      data: {
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
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création du compte",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
