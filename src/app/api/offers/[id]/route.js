import { getOfferById } from "@/lib/serverMethods/offers/getOfferById";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  const result = await getOfferById(id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
