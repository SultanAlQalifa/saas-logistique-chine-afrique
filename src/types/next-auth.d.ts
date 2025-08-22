import { UserRole } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      companyId: string
      company: {
        id: string
        name: string
        email: string
        settings?: {
          aerialPricePerKg: number
          maritimePricePerCbm: number
          aerialEtaDays: number
          aerialExpressEtaDays: number
          maritimeEtaDays: number
          maritimeExpressEtaDays: number
          primaryColor: string
        }
      }
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: UserRole
    companyId: string
    company: {
      id: string
      name: string
      email: string
      settings?: {
        aerialPricePerKg: number
        maritimePricePerCbm: number
        aerialEtaDays: number
        aerialExpressEtaDays: number
        maritimeEtaDays: number
        maritimeExpressEtaDays: number
        primaryColor: string
      }
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    companyId: string
    company: {
      id: string
      name: string
      email: string
      settings?: {
        aerialPricePerKg: number
        maritimePricePerCbm: number
        aerialEtaDays: number
        aerialExpressEtaDays: number
        maritimeEtaDays: number
        maritimeExpressEtaDays: number
        primaryColor: string
      }
    }
  }
}
