import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Si vous voyez ceci, le middleware n'a pas bloqué la requête",
  });
}
