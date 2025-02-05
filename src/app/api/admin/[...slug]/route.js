import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour transformer les données utilisateur
const transformUserData = (user) => ({
  id: user.user_id, // React Admin s'attend à un champ 'id'
  name: user.user_name,
  email: user.user_email,
  firstname: user.user_firstname,
  lastname: user.user_lastname,
  created_at: user.user_created_at,
  role: user.user_role,
  birthday: user.user_birthday,
  // Inclure les relations si nécessaire
  addresses: user.addresses,
  scores: user.scores,
  bookings: user.bookings,
});

export async function GET(request, context) {
  const params = await context.params;
  const resource = params.slug[0];

  try {
    const searchParams = request.nextUrl.searchParams;
    const rangeHeader = searchParams.get("range");
    const sort = searchParams.get("sort");
    const filter = searchParams.get("filter");

    // Parse range pour la pagination
    const [start, end] = rangeHeader ? JSON.parse(rangeHeader) : [0, 9];

    let data = [];
    let total = 0;

    switch (resource) {
      case "users":
        data = await prisma.user.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            addresses: true,
            scores: true,
            bookings: true,
          },
        });
        data = data.map(transformUserData); // Transformer les données
        total = await prisma.user.count();
        break;

      case "addresses":
        data = await prisma.address.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            users: true,
          },
        });
        // Transformer les données d'adresse pour avoir un champ id
        data = data.map((address) => ({
          id: address.address_id,
          ...address,
        }));
        total = await prisma.address.count();
        break;

      case "offers":
        data = await prisma.offer.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            bookings: true,
          },
        });
        data = data.map((offer) => ({
          id: offer.offer_id,
          ...offer,
        }));
        total = await prisma.offer.count();
        break;

      case "timeslots":
        data = await prisma.timeSlot.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            booking: true,
          },
        });
        total = await prisma.timeSlot.count();
        break;

      case "bookings":
        data = await prisma.booking.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            user: true,
            offer: true,
            time_slot: true,
            payment: true,
          },
        });
        total = await prisma.booking.count();
        break;

      case "payments":
        data = await prisma.payment.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            bookings: true,
          },
        });
        total = await prisma.payment.count();
        break;

      case "scores":
        data = await prisma.score.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            user: true,
            course: true,
          },
        });
        total = await prisma.score.count();
        break;

      case "courses":
        data = await prisma.course.findMany({
          skip: start,
          take: end - start + 1,
          include: {
            scores: true,
          },
        });
        total = await prisma.course.count();
        break;

      default:
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
    }

    // S'assurer que data est toujours un tableau
    const responseData = Array.isArray(data) ? data : [data];

    return NextResponse.json(
      {
        data: responseData,
        total: total,
      },
      {
        headers: {
          "Content-Range": `${resource} ${start}-${end}/${total}`,
          "Access-Control-Expose-Headers": "Content-Range",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request, context) {
  const params = await context.params;
  const resource = params.slug[0];
  const body = await request.json();

  try {
    let data;
    switch (resource) {
      case "users":
        data = await prisma.user.create({
          data: body,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const params = await context.params;
  const resource = params.slug[0];
  const id = params.slug[1];
  const body = await request.json();

  try {
    let data;
    switch (resource) {
      case "users":
        data = await prisma.user.update({
          where: { id: parseInt(id) },
          data: body,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  const resource = params.slug[0];
  const id = params.slug[1];

  try {
    let data;
    switch (resource) {
      case "users":
        data = await prisma.user.delete({
          where: { id: parseInt(id) },
        });
        break;
      default:
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
