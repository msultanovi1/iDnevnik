"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./signin.module.css" // Novi CSS modul

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/",
        })
    } catch (error) {
        setError("Došlo je do greške")
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Prijavite se u iDnevnik</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email adresa
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Lozinka
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Učitavanje..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  )
}