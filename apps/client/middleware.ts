import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/app"];
export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    // @ts-ignore
    secret: process.env.AUTH_SECRET,
  });
  const currentPath = request.nextUrl.pathname;
  if (!session && currentPath.startsWith("/app/")) {
    return NextResponse.redirect(new URL(`/app`, request.url));
  }
  if (authRoutes.includes(currentPath) && session) {
    return NextResponse.redirect(new URL(`/app/dashboard`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
