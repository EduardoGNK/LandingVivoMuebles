import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
    async signIn({ user, account }) {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error("❌ GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET no están configurados")
        return false
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // Lista blanca de emails con acceso de administrador
        const adminEmails = [
          process.env.EMAIL_1,
          process.env.EMAIL_2,
          'eduardo.escalona1@mail.udp.cl',
          'aeservicios@gmail.com'
        ].filter(Boolean);

        const isAdmin = user.email && adminEmails.includes(user.email.toLowerCase());
        token.role = isAdmin ? "admin" : "user";
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token
    },
    async session({ session, token }) {
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
