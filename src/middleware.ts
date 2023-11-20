import { getCookie, hasCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import { UUID } from "crypto";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: UUID;
  };
}
const authPaths = ["/register", "/register", "/forgot-password", "/login"];
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const verified = request.cookies.get("accessToken");
  if (verified?.value) {
    if (authPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  } else {
    if (request.nextUrl.pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/register",
    "/forgot-password",
    "/login",
    "/profile/:path*",
  ],
};
