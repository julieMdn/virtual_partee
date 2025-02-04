import { NextResponse } from "next/server";
import AdminJS from "adminjs";
import { Database, Resource } from "@adminjs/prisma";
import { prisma } from "@/lib/prisma";

AdminJS.registerAdapter({ Database, Resource });

const resources = [
  { resource: { model: prisma.user, client: prisma }, options: {} },
  { resource: { model: prisma.address, client: prisma }, options: {} },
  { resource: { model: prisma.offer, client: prisma }, options: {} },
  { resource: { model: prisma.timeSlot, client: prisma }, options: {} },
  { resource: { model: prisma.booking, client: prisma }, options: {} },
  { resource: { model: prisma.payment, client: prisma }, options: {} },
  { resource: { model: prisma.score, client: prisma }, options: {} },
  { resource: { model: prisma.course, client: prisma }, options: {} },
];

const adminJs = new AdminJS({
  databases: [prisma],
  resources: resources,
  rootPath: "/admin",
  branding: {
    companyName: "Virtual Partee",
    logo: false,
    softwareBrothers: false,
  },
});

export async function GET(request) {
  try {
    const response = await adminJs.initialize();
    return NextResponse.json({ message: "AdminJS is running", status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    return NextResponse.json({
      message: "AdminJS received POST request",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    return await adminRouter(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur administrateur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    return await adminRouter(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur administrateur" },
      { status: 500 }
    );
  }
}
