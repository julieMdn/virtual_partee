import { createMiddleware } from "@adminjs/express";
import { NextResponse } from "next/server";
import { adminJs } from "./config";

const adminRouter = createMiddleware(adminJs);

export async function GET(request) {
  try {
    return await adminRouter(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur administrateur" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    return await adminRouter(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur administrateur" },
      { status: 500 }
    );
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
