'use client'

import { prisma } from './db'

export class DatabaseService {
  // Clients
  static async getClients() {
    try {
      return await prisma.client.findMany({
        include: {
          packages: true,
          company: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error fetching clients:', error)
      return []
    }
  }

  static async createClient(data: any) {
    try {
      return await prisma.client.create({
        data,
        include: {
          packages: true,
          company: true
        }
      })
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  // Packages
  static async getPackages() {
    try {
      return await prisma.package.findMany({
        include: {
          client: true,
          cargo: true,
          company: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error fetching packages:', error)
      return []
    }
  }

  static async createPackage(data: any) {
    try {
      return await prisma.package.create({
        data,
        include: {
          client: true,
          cargo: true,
          company: true
        }
      })
    } catch (error) {
      console.error('Error creating package:', error)
      throw error
    }
  }

  // Cargos
  static async getCargos() {
    try {
      return await prisma.cargo.findMany({
        include: {
          packages: true,
          company: true
        },
        orderBy: {
          departureDate: 'desc'
        }
      })
    } catch (error) {
      console.error('Error fetching cargos:', error)
      return []
    }
  }

  static async createCargo(data: any) {
    try {
      return await prisma.cargo.create({
        data,
        include: {
          packages: true,
          company: true
        }
      })
    } catch (error) {
      console.error('Error creating cargo:', error)
      throw error
    }
  }

  // Users
  static async getUsers() {
    try {
      return await prisma.user.findMany({
        include: {
          company: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  // Orders - Mock implementation for production build
  static async getOrders() {
    try {
      // Mock data for production build - replace with actual Prisma when DB is configured
      return [
        {
          id: '1',
          number: 'ORD-2025-000001',
          status: 'PENDING',
          total: 150000,
          createdAt: new Date(),
          client: { name: 'Client Test', email: 'client@test.com' },
          company: { name: 'NextMove Cargo' }
        }
      ]
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }
}

export default DatabaseService
