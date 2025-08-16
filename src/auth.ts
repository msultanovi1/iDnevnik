import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Definiraj tip uloge
type UserRole = "NASTAVNIK" | "RODITELJ" | "UCENIK"

const prisma = new PrismaClient()

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Type guards za sigurnost
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email // Sada TypeScript zna da je string
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password, // I ovo je sada sigurno string
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role as UserRole
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as UserRole
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)