import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, context) {
  const params = context.params;
  const resource = params.slug[0];
  const id = params.slug[1];

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const sortField = searchParams.get("sortField");
  const sortOrder = searchParams.get("sortOrder");
  const filter = searchParams.get("filter")
    ? JSON.parse(searchParams.get("filter"))
    : {};

  try {
    if (id) {
      // getOne
      const data = await prisma[resource].findUnique({
        where: { id: parseInt(id) },
        include: getIncludes(resource),
      });
      return NextResponse.json(data);
    } else {
      // getList
      const skip = (page - 1) * perPage;
      const take = perPage;

      const [data, total] = await Promise.all([
        prisma[resource].findMany({
          skip,
          take,
          where: buildWhereClause(filter),
          orderBy: sortField
            ? {
                [sortField]: sortOrder.toLowerCase(),
              }
            : undefined,
          include: getIncludes(resource),
        }),
        prisma[resource].count({
          where: buildWhereClause(filter),
        }),
      ]);

      return NextResponse.json({
        data,
        total,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request, context) {
  const params = context.params;
  const resource = params.slug[0];

  try {
    const data = await request.json();
    const result = await prisma[resource].create({
      data,
      include: getIncludes(resource),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const params = context.params;
  const resource = params.slug[0];
  const id = params.slug[1];

  try {
    const data = await request.json();
    const result = await prisma[resource].update({
      where: { id: parseInt(id) },
      data,
      include: getIncludes(resource),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const params = context.params;
  const resource = params.slug[0];
  const id = params.slug[1];

  try {
    await prisma[resource].delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour construire les clauses where
function buildWhereClause(filter) {
  const where = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (typeof value === "string") {
      where[key] = { contains: value };
    } else {
      where[key] = value;
    }
  });
  return where;
}

// Fonction utilitaire pour définir les relations à inclure
function getIncludes(resource) {
  switch (resource) {
    case "users":
      return {
        addresses: true,
        scores: true,
        bookings: true,
      };
    case "addresses":
      return {
        users: true,
      };
    case "offers":
      return {
        bookings: true,
      };
    // ... ajoutez d'autres cas selon vos besoins
    default:
      return {};
  }
}
