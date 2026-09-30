import { NextResponse, type NextRequest } from "next/server";
export function proxy(req: NextRequest){
  const session = req.cookies.get("session")?.value;
  const path = req.nextUrl.pathname;
  const isAuth = path.startsWith("/login") || path.startsWith("/register");
  const isPublicCatalog = path === "/catalog" || path.startsWith("/catalog/");
  const isPublicOrderSuccess = path.startsWith("/order/success");
  const isPublicTrack = path.startsWith("/track");
  const isPublic = isPublicCatalog || isPublicOrderSuccess || isPublicTrack || path === "/";
  const isApp = (path.startsWith("/dashboard") || path.startsWith("/products") || path.startsWith("/customers") || path.startsWith("/orders") || path.startsWith("/reports") || path.startsWith("/users")) && !isPublic;
  // catalog & order success now public for guest checkout
  const isAppCatalog = path.startsWith("/catalog") && !isPublic;
  if((isApp || isAppCatalog) && !session) return NextResponse.redirect(new URL("/login", req.url));
  if(isAuth && session) return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/products/:path*", "/customers/:path*", "/orders/:path*", "/reports/:path*", "/users/:path*", "/catalog/:path*", "/order/success/:path*", "/login", "/register"] };
