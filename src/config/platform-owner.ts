// Configuration du compte propriétaire principal de la plateforme
// Ce compte ne peut être modifié que par le propriétaire lui-même

export const PLATFORM_OWNER = {
  email: 'djeylanidjitte@gmail.com',
  firstName: 'Cheikh Abdoul Khadre Djeylani',
  lastName: 'DJITTE',
  phone: '+221776581741',
  country: 'Sénégal',
  city: 'Dakar',
  role: 'PLATFORM_OWNER',
  isProtected: true,
  cannotBeDeleted: true,
  cannotBeModifiedByOthers: true
} as const

// Fonction pour vérifier si un utilisateur est le propriétaire de la plateforme
export function isPlatformOwner(email: string): boolean {
  return email === PLATFORM_OWNER.email
}

// Fonction pour vérifier si un utilisateur peut modifier un compte
export function canModifyAccount(currentUserEmail: string, targetUserEmail: string): boolean {
  // Le propriétaire de la plateforme peut modifier tous les comptes
  if (isPlatformOwner(currentUserEmail)) {
    return true
  }
  
  // Le compte propriétaire ne peut être modifié que par lui-même
  if (isPlatformOwner(targetUserEmail)) {
    return currentUserEmail === targetUserEmail
  }
  
  // Les autres utilisateurs peuvent modifier leur propre compte
  return currentUserEmail === targetUserEmail
}

// Fonction pour vérifier si un compte peut être supprimé
export function canDeleteAccount(currentUserEmail: string, targetUserEmail: string): boolean {
  // Le compte propriétaire ne peut jamais être supprimé
  if (isPlatformOwner(targetUserEmail)) {
    return false
  }
  
  // Seul le propriétaire peut supprimer d'autres comptes
  return isPlatformOwner(currentUserEmail)
}
