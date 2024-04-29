
import { NextResponse } from "next/server";
// import { cookies } from 'next/headers'

export default function middleware(req) {
  console.log("inside middleware-----------");
  const cookie = req.cookies.get("access")?.value;
  const protectedRoutes = ["/activeoi","/niftyfutures","/cashflow","/fii-dii-data","/optiondata","/securitywise","/stockdata","/multistrike"];
  // const publicRoutes = ["/"]

  // const checkCookieStore = cookies();
  // const checkCookie = checkCookieStore.get('access')

  if (!cookie && protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', req.nextUrl)); 
  }
  // if(checkCookie && publicRoutes.some(path => req.nextUrl.pathname.startsWith(path))){
  //   return NextResponse.redirect(new URL('/activeoi',req.url))
  // }
  return NextResponse.next(); 
}


// export const config = {
//   matcher: "/:path*",
// };
