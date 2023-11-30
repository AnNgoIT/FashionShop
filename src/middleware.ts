import { NextRequest, NextResponse } from "next/server";

const getRole = async (accessToken: string | undefined) => {
  try {
    if (!accessToken) return null;

    const res = await fetch(`http://localhost:8080/api/v1/users/role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.json();
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

const authPaths = ["/cart", "/checkout", "/wishlist"];
const userPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/profile", "/product", "/cart", "/wishlist", "/checkout"];

export async function middleware(request: NextRequest) {
  const accessToken =
    request.cookies.get("accessToken") || request.cookies.get("refreshToken");

  if (!accessToken) {
    if (request.nextUrl.pathname.startsWith("/admin"))
      return NextResponse.redirect(new URL("/", request.url));
    else if (
      request.nextUrl.pathname.startsWith("/profile") ||
      authPaths.includes(request.nextUrl.pathname)
    )
      return NextResponse.redirect(new URL("/login", request.url));
  }

  const authenticatedUser = await getRole(accessToken?.value);
  if (authenticatedUser && authenticatedUser.success) {
    const userRole = authenticatedUser.result;
    if (userRole === "ADMIN") {
      if (!request.nextUrl.pathname.startsWith("/admin"))
        return NextResponse.redirect(new URL("/admin", request.url));
    } else if (
      userRole === "CUSTOMER" &&
      (userPaths.includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith("/admin"))
    ) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
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
    "/checkout",
  ],
};
