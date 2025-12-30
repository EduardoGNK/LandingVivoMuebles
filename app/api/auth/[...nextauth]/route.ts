import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extender los tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      role: string
    }
  }
  
  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}

// Validar variables de entorno requeridas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("❌ ERROR: GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET deben estar configurados en las variables de entorno")
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ ERROR: NEXTAUTH_SECRET debe estar configurado en las variables de entorno")
}

if (!process.env.NEXTAUTH_URL) {
  console.warn("⚠️  ADVERTENCIA: NEXTAUTH_URL no está configurado. Usando valor por defecto.")
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { user: user.email, account: account?.provider })
      
      // Validar que las credenciales de Google estén configuradas
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error("❌ GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET no están configurados")
        return false
      }
      
      // Permitir acceso a todos los usuarios de Google por ahora
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        console.log("JWT callback - user:", user.email)
        token.role = "admin"
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token)
      
      if (token) {
        session.user = {
          id: token.sub as string,
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
          role: token.role as string,
        }
      }
      
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 