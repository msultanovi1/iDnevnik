// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Ako je korisnik prijavljen i pokušava pristupiti root putanji, preusmjeri ga na dashboard
  if (pathname === "/" && token) {
    switch (token.role) {
      case "NASTAVNIK":
        return NextResponse.redirect(new URL("/nastavnik/dashboard", request.url))
      case "RODITELJ":
        return NextResponse.redirect(new URL("/roditelj/dashboard", request.url))
      case "UCENIK":
        return NextResponse.redirect(new URL("/ucenik/dashboard", request.url))
      default:
        // Možete preusmjeriti na zadanu nadzornu ploču ili signin ako uloga nije prepoznata
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Putanje koje zahtijevaju autentifikaciju
  const protectedPaths = ["/nastavnik", "/roditelj", "/ucenik", "/dashboard"]
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // Ako je zaštićena putanja a korisnik nije prijavljen, preusmjeri na prijavu
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Provjera uloge za specifične putanje (vaš postojeći kod)
  if (token) {
    if (pathname.startsWith("/nastavnik") && token.role !== "NASTAVNIK") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    
    if (pathname.startsWith("/roditelj") && token.role !== "RODITELJ") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (pathname.startsWith("/ucenik") && token.role !== "UCENIK") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }
  
  // Nastavi normalno ako je sve u redu
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Dodajte sve rute koje želite zaštititi
    "/nastavnik/:path*", 
    "/roditelj/:path*", 
    "/ucenik/:path*", 
    "/dashboard/:path*",
    // Ne zaboravite root rutu
    "/",
  ]
}