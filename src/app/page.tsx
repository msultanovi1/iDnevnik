"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Sačekaj da se NextAuth potpuno inicijalizuje
    if (status === "loading") return

    setIsInitialized(true)

    if (!session) {
      // Korisnik nije prijavljen, preusmjeri na prijavu
      router.push("/auth/signin")
      return
    }

    // Korisnik je prijavljen, preusmjeri na dashboard ili na osnovu uloge
    switch (session.user?.role) {
      case "NASTAVNIK":
        router.push("/dashboard") // ili "/nastavnik/dashboard"
        break
      case "RODITELJ":
        router.push("/dashboard") // ili "/roditelj/dashboard"
        break
      case "UCENIK":
        router.push("/dashboard") // ili "/ucenik/dashboard"
        break
      default:
        router.push("/dashboard")
    }
  }, [session, status, router])

  // Ne renderuj ništa jer ćemo biti preusmjereni
  return null
}