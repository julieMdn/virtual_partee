import { getOffers } from "@/lib/serverMethods/offers/getOffers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const result = await getOffers();

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
