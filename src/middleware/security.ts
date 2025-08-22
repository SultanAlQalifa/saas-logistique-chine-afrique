// Middleware de sécurité pour NextMove Cargo
import { NextRequest, NextResponse } from 'next/server'
import { SECURITY_CONFIG, GDPR_CONFIG } from '@/config/security-config'
import { isPlatformOwner } from '@/config/platform-owner'

// Rate limiting store (en production, utiliser Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Ajouter les headers de sécurité
  Object.entries(SECURITY_CONFIG.securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Rate limiting
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const path = request.nextUrl.pathname
  
  // Déterminer le type de limite selon le chemin
  let rateLimitConfig: { windowMs: number; maxRequests: number } = SECURITY_CONFIG.rateLimiting.api
  if (path.startsWith('/api/auth')) {
    rateLimitConfig = SECURITY_CONFIG.rateLimiting.auth
  } else if (path.includes('/upload')) {
    rateLimitConfig = SECURITY_CONFIG.rateLimiting.upload
  }
  
  const key = `${clientIP}:${path}`
  const now = Date.now()
  const windowStart = now - rateLimitConfig.windowMs
  
  // Nettoyer les anciennes entrées
  for (const [k, v] of Array.from(rateLimitStore.entries())) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k)
    }
  }
  
  // Vérifier la limite
  const current = rateLimitStore.get(key)
  if (current && current.resetTime > now) {
    if (current.count >= rateLimitConfig.maxRequests) {
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString()
        }
      })
    }
    current.count++
  } else {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs
    })
  }
  
  return response
}

// Middleware de protection du compte propriétaire
export function protectPlatformOwner(userEmail: string, targetEmail: string, action: 'read' | 'update' | 'delete'): boolean {
  // Le propriétaire peut tout faire
  if (isPlatformOwner(userEmail)) {
    return true
  }
  
  // Le compte propriétaire ne peut être modifié/supprimé que par lui-même
  if (isPlatformOwner(targetEmail)) {
    if (action === 'read') return true // Lecture autorisée
    return userEmail === targetEmail // Modification/suppression seulement par lui-même
  }
  
  // Pour les autres comptes, autoriser selon les règles métier
  return true
}

// Fonction de logging sécurisé
export function secureLog(event: string, userId: string, data: any = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    ip: data.ip || 'unknown',
    userAgent: data.userAgent || 'unknown',
    data: maskSensitiveFields(data)
  }
  
  // En production, envoyer vers un service de logging sécurisé
  console.log('[SECURITY]', JSON.stringify(logEntry))
}

// Masquer les champs sensibles dans les logs
function maskSensitiveFields(data: any): any {
  if (!data || typeof data !== 'object') return data
  
  const masked = { ...data }
  SECURITY_CONFIG.audit.sensitiveFields.forEach(field => {
    if (masked[field]) {
      masked[field] = '[MASKED]'
    }
  })
  
  return masked
}

// Validation des fichiers uploadés
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const config = SECURITY_CONFIG.fileUpload
  
  // Vérifier la taille
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximum: ${config.maxSize / 1024 / 1024}MB`
    }
  }
  
  // Vérifier le type MIME
  if (!SECURITY_CONFIG.fileUpload.allowedTypes.includes(file.type as any)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés: ${config.allowedTypes.join(', ')}`
    }
  }
  
  // Vérifier l'extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx']
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Extension de fichier non autorisée'
    }
  }
  
  return { valid: true }
}

// Génération de token sécurisé
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validation email avec domaines autorisés
export function isValidBusinessEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  
  // Bloquer les domaines temporaires/jetables
  const blockedDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return !blockedDomains.includes(domain)
}

// Chiffrement des données sensibles
export function encryptSensitiveData(data: string, key: string): string {
  // En production, utiliser une vraie bibliothèque de chiffrement
  // Ici, simulation pour la démo
  return Buffer.from(data).toString('base64')
}

export function decryptSensitiveData(encryptedData: string, key: string): string {
  // En production, utiliser une vraie bibliothèque de chiffrement
  // Ici, simulation pour la démo
  return Buffer.from(encryptedData, 'base64').toString('utf-8')
}
