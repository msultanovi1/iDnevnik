"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleGoBack = () => {
    if (session?.user?.role) {
      switch (session.user.role) {
        case "NASTAVNIK":
          router.push("/nastavnik/dashboard")
          break
        case "RODITELJ":
          router.push("/roditelj/dashboard")
          break
        case "UCENIK":
          router.push("/ucenik/dashboard")
          break
        default:
          router.push("/")
      }
    } else {
      router.push("/auth/signin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Nemate dozvolu
          </h2>
          <p className="text-gray-600 mb-8">
            Nemate dozvolu za pristup ovoj stranici. Molimo kontaktirajte administratora ako smatrate da je ovo greška.
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Povratak na glavnu stranicu
          </button>
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Prijavite se kao drugi korisnik
          </button>
        </div>
      </div>
    </div>
  )
}