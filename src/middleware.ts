import { NextRequest, NextResponse } from "next/server";

const getRole = async (accessToken: string | undefined) => {
  if (!accessToken) return null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/role`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.json();
};

const authPaths = ["/cart", "/cart/checkout", "/wishlist"];
const userPaths = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const authenticatedUser = request.cookies.get("accessToken");
  const url = request.nextUrl.pathname;
  if (!authenticatedUser) {
    const refreshUser = request.cookies.get("refreshToken");
    if (!refreshUser) {
      if (
        authPaths.includes(url) ||
        url.startsWith("/profile") ||
        url.startsWith("/admin") ||
        url.startsWith("/shipper")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
  const userRole = await getRole(authenticatedUser?.value);
  if (userRole && userRole.success && userRole.result == "CUSTOMER") {
    if (
      userPaths.includes(url) ||
      url.startsWith("/admin") ||
      url.startsWith("/shipper")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    userRole &&
    userRole.success &&
    userRole.result == "ADMIN" &&
    url.includes("admin") == false
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    userRole &&
    userRole.success &&
    userRole.result == "SHIPPER" &&
    url.includes("shipper") == false
  ) {
    return NextResponse.redirect(new URL("/shipper", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/register",
    "/forgot-password",
    "/login",
    "/profile/:path*",
    "/product",
    "/wishlist",
    "/cart",
    "/cart/checkout",
    "/shipper",
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
