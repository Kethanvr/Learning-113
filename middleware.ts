import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/api/video",
    "/api/upload-auth",
    "/api/auth/:path*",
  ],
};

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Allow unauthenticated access to auth and public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // Allow access to homepage or video APIs
        if (
          pathname === "/" ||
          pathname.startsWith("/api/videos")
        ) {
          return true;
        }

        // Otherwise require valid token
        return !!token;
      },
    },
  }
);
