import { NextResponse } from "next/server";

export default function middleware(req) {
  // console.log("inside middleware------ee-----");
  const authCookie = req.cookies.get("access")?.value;

  const protectedRoutes = [
    "/activeoi",
    "/niftyfutures",
    "/cashflow",
    "/fii-dii-data",
    "/optiondata",
    "/securitywise",
    "/stockdata",
    "/multistrike",
  ];

  const { pathname } = req.nextUrl.clone();

  if (pathname === "/" && authCookie) {
    return NextResponse.redirect(new URL("/activeoi", req.url)); 
  }

  if (protectedRoutes.includes(pathname) && !authCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
}