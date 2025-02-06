// dataprovider <-> prisma

import { defaultHandler } from "ra-data-simple-prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prismaClient = new PrismaClient();

const handler = async (req) => {
  const body = await req.json();
  const result = await defaultHandler(body, prismaClient);
  return NextResponse.json(result);
};

export { handler as GET, handler as POST };
