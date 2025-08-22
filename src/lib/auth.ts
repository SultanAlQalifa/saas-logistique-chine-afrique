import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Utilisateurs de démonstration en dur (temporaire)
const demoUsers = [
  {
    id: '1',
    email: 'contact@logitrans.com',
    name: 'Admin Entreprise',
    password: 'company123',
    role: 'ADMIN',
    companyId: 'company-1',
    company: {
      id: 'company-1',
      name: 'LogiTrans SARL',
      email: 'contact@logitrans.com',
      settings: {
        aerialPricePerKg: 5.0,
        maritimePricePerCbm: 150.0,
        primaryColor: '#3b82f6'
      }
    }
  },
  {
    id: '2',
    email: 'admin@platform.com',
    name: 'Admin Plateforme',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    companyId: 'platform',
    company: {
      id: 'platform',
      name: 'SaaS Logistique Platform',
      email: 'admin@platform.com',
      settings: {
        aerialPricePerKg: 5.0,
        maritimePricePerCbm: 150.0,
        primaryColor: '#3b82f6'
      }
    }
  },
  {
    id: '3',
    email: 'client@example.com',
    name: 'Client Test',
    password: 'client123',
    role: 'CLIENT',
    companyId: 'company-1',
    company: {
      id: 'company-1',
      name: 'LogiTrans SARL',
      email: 'contact@logitrans.com',
      settings: {
        aerialPricePerKg: 5.0,
        maritimePricePerCbm: 150.0,
        primaryColor: '#3b82f6'
      }
    }
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Recherche dans les utilisateurs de démonstration
        const user = demoUsers.find(u => u.email === credentials.email)

        if (!user) {
          return null
        }

        // Vérification simple du mot de passe (en dur pour la démo)
        if (credentials.password !== user.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          company: user.company
        } as any
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as any
        token.companyId = user.companyId as any
        token.company = user.company as any
      }
      return token
    },
    async session({ session, token }) {
      if (token && session?.user) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.companyId = token.companyId as any
        session.user.company = token.company as any
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}
