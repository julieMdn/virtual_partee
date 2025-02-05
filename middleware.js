import { NextResponse } from "next/server";

export function middleware(request) {
  // Log de débogage
  console.log("🔍 Middleware exécuté pour:", request.nextUrl.pathname);

  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("⛔ Tentative d'accès à une route admin");

    // Redirection vers la page d'accueil
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configuration du matcher
export const config = {
  matcher: [
    /*
     * Match toutes les routes request paths except pour celles qui commencent par:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
