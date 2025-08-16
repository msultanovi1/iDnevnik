import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "NASTAVNIK" | "RODITELJ" | "UCENIK"
    } & DefaultSession["user"]
  }

  interface User {
    role: "NASTAVNIK" | "RODITELJ" | "UCENIK"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "NASTAVNIK" | "RODITELJ" | "UCENIK"
  }
}