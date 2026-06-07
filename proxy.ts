import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPanel = pathname.startsWith("/panel");
  const isFriends = pathname === "/friends";
  const isLogin = pathname === "/login";

  if ((isPanel || isFriends) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL("/panel/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/friends", "/login"],
};
