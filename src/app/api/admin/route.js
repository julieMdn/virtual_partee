import { NextResponse } from "next/server";
import express from "express";
import { buildAuthenticatedRouter } from "@adminjs/express";
import { adminJs } from "../../admin/config";

const app = express();
const router = buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };
    }
    return null;
  },
  cookiePassword: process.env.NEXTAUTH_SECRET || "fallback_secret",
});

app.use(adminJs.options.rootPath, router);

export async function GET(request) {
  try {
    return new Response("AdminJS is running", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    return new Response("AdminJS is running", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
