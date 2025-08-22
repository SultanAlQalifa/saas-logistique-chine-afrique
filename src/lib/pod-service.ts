// Service de gestion des Preuves de Livraison (POD)
export interface PODData {
  id: string
  packageId: string
  recipientName?: string
  recipientPhone?: string
  signature: string
  location: {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
    address?: string
  }
  photos: string[] // Base64 encoded images
  deliveryTime: number
  createdAt: string
  status: 'PENDING' | 'COMPLETED' | 'VERIFIED'
  receiptUrl?: string
}

export interface DeliveryReceipt {
  id: string
  podId: string
  packageId: string
  recipientName: string
  deliveryDate: string
  deliveryTime: string
  location: string
  coordinates: string
  signature: string
  photos: string[]
  generatedAt: string
}

export class PODService {
  // Créer une nouvelle POD
  static async createPOD(podData: Omit<PODData, 'id' | 'createdAt' | 'status'>): Promise<PODData> {
    const pod: PODData = {
      id: `pod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...podData,
      createdAt: new Date().toISOString(),
      status: 'COMPLETED'
    }

    // Mock: En production, sauvegarder en base de données
    console.log('POD créée:', pod)
    
    // Générer automatiquement le reçu
    const receipt = await this.generateReceipt(pod)
    pod.receiptUrl = receipt.id

    return pod
  }

  // Générer un reçu de livraison automatique
  static async generateReceipt(pod: PODData): Promise<DeliveryReceipt> {
    const receipt: DeliveryReceipt = {
      id: `receipt_${pod.id}`,
      podId: pod.id,
      packageId: pod.packageId,
      recipientName: pod.recipientName || 'Destinataire',
      deliveryDate: new Date(pod.deliveryTime).toLocaleDateString('fr-FR'),
      deliveryTime: new Date(pod.deliveryTime).toLocaleTimeString('fr-FR'),
      location: pod.location.address || `${pod.location.latitude}, ${pod.location.longitude}`,
      coordinates: `${pod.location.latitude.toFixed(6)}, ${pod.location.longitude.toFixed(6)}`,
      signature: pod.signature,
      photos: pod.photos,
      generatedAt: new Date().toISOString()
    }

    // Mock: En production, générer un PDF et le stocker
    console.log('Reçu généré:', receipt)
    
    return receipt
  }

  // Récupérer les PODs d'un colis
  static async getPODsByPackage(packageId: string): Promise<PODData[]> {
    // Mock data pour démonstration
    return [
      {
        id: 'pod_demo_001',
        packageId,
        recipientName: 'Amadou Diallo',
        recipientPhone: '+221776543210',
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        location: {
          latitude: 14.6928,
          longitude: -17.4467,
          accuracy: 10,
          timestamp: Date.now() - 3600000,
          address: 'Dakar, Sénégal'
        },
        photos: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='],
        deliveryTime: Date.now() - 3600000,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'COMPLETED',
        receiptUrl: 'receipt_pod_demo_001'
      }
    ]
  }

  // Vérifier une POD
  static async verifyPOD(podId: string): Promise<boolean> {
    // Mock: En production, vérifier l'authenticité de la signature et des données
    console.log(`Vérification POD: ${podId}`)
    return true
  }

  // Générer un rapport POD pour un colis
  static async generatePODReport(packageId: string): Promise<{
    packageId: string
    totalPODs: number
    deliveryStatus: 'DELIVERED' | 'PARTIAL' | 'PENDING'
    lastDeliveryAttempt?: string
    receipts: string[]
  }> {
    const pods = await this.getPODsByPackage(packageId)
    
    return {
      packageId,
      totalPODs: pods.length,
      deliveryStatus: pods.length > 0 ? 'DELIVERED' : 'PENDING',
      lastDeliveryAttempt: pods.length > 0 ? pods[pods.length - 1].createdAt : undefined,
      receipts: pods.map(pod => pod.receiptUrl).filter(Boolean) as string[]
    }
  }

  // Convertir File en base64 pour stockage
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Convertir plusieurs fichiers en base64
  static async filesToBase64(files: File[]): Promise<string[]> {
    const promises = files.map(file => this.fileToBase64(file))
    return Promise.all(promises)
  }

  // Mettre à jour le statut d'un colis après POD
  static async updatePackageStatus(packageId: string, podData: PODData): Promise<void> {
    // Mock: En production, mettre à jour le statut du colis dans la base
    console.log(`Colis ${packageId} marqué comme livré avec POD ${podData.id}`)
    
    // Envoyer des notifications automatiques
    await this.sendDeliveryNotifications(packageId, podData)
  }

  // Envoyer des notifications de livraison
  private static async sendDeliveryNotifications(packageId: string, podData: PODData): Promise<void> {
    // Mock: En production, envoyer SMS/Email/WhatsApp au client
    console.log(`Notifications envoyées pour livraison du colis ${packageId}`)
    
    // Exemple de notifications:
    // - SMS au destinataire avec lien vers le reçu
    // - Email avec reçu PDF en pièce jointe
    // - Notification WhatsApp avec photo de livraison
    // - Mise à jour du tracking en temps réel
  }

  // Obtenir les statistiques POD
  static async getPODStats(companyId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<{
    totalDeliveries: number
    successfulPODs: number
    averageDeliveryTime: number
    customerSatisfaction: number
    disputeReduction: number
  }> {
    // Mock data pour démonstration
    return {
      totalDeliveries: 156,
      successfulPODs: 152,
      averageDeliveryTime: 2.3, // jours
      customerSatisfaction: 4.8, // sur 5
      disputeReduction: 87 // pourcentage de réduction des litiges
    }
  }
}
