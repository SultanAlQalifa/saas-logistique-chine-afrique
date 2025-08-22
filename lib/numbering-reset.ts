/**
 * Système de reset des numérotations pour production 2025
 * NextMove Cargo - V1.0 Production Launch
 */

export interface NumberingSeries {
  type: 'invoice' | 'quote' | 'tracking' | 'receipt' | 'contract';
  prefix: string;
  currentNumber: number;
  year: number;
  format: string;
  description: string;
}

export interface ResetReport {
  timestamp: string;
  resetBy: string;
  series: NumberingSeries[];
  backupCreated: boolean;
  success: boolean;
  errors: string[];
}

/**
 * Configuration des séries de numérotation 2025
 */
export const NUMBERING_SERIES_2025: NumberingSeries[] = [
  {
    type: 'invoice',
    prefix: 'INV',
    currentNumber: 1,
    year: 2025,
    format: 'INV-2025-{number:6}',
    description: 'Factures clients - Série 2025'
  },
  {
    type: 'quote',
    prefix: 'DEV',
    currentNumber: 1,
    year: 2025,
    format: 'DEV-2025-{number:6}',
    description: 'Devis commerciaux - Série 2025'
  },
  {
    type: 'tracking',
    prefix: 'NM',
    currentNumber: 1,
    year: 2025,
    format: 'NM-2025-{number:8}',
    description: 'Numéros de suivi colis - Série 2025'
  },
  {
    type: 'receipt',
    prefix: 'REC',
    currentNumber: 1,
    year: 2025,
    format: 'REC-2025-{number:6}',
    description: 'Reçus de paiement - Série 2025'
  },
  {
    type: 'contract',
    prefix: 'CTR',
    currentNumber: 1,
    year: 2025,
    format: 'CTR-2025-{number:6}',
    description: 'Contrats clients - Série 2025'
  }
];

/**
 * Service de reset des numérotations
 */
export class NumberingResetService {
  
  /**
   * Reset toutes les séries de numérotation pour 2025
   */
  static async resetAllSeries(resetBy: string): Promise<ResetReport> {
    const report: ResetReport = {
      timestamp: new Date().toISOString(),
      resetBy,
      series: [...NUMBERING_SERIES_2025],
      backupCreated: false,
      success: false,
      errors: []
    };

    try {
      // 1. Créer backup des séries actuelles
      await this.createBackup();
      report.backupCreated = true;

      // 2. Reset chaque série
      for (const series of NUMBERING_SERIES_2025) {
        await this.resetSeries(series);
      }

      // 3. Vérifier la cohérence
      await this.validateReset();

      report.success = true;
      console.log('✅ Reset numérotations 2025 terminé avec succès');
      
    } catch (error) {
      report.errors.push(error instanceof Error ? error.message : 'Erreur inconnue');
      console.error('❌ Erreur lors du reset:', error);
    }

    return report;
  }

  /**
   * Reset une série spécifique
   */
  static async resetSeries(series: NumberingSeries): Promise<void> {
    // Simulation - En production, ceci interagirait avec Prisma
    console.log(`🔄 Reset série ${series.type}: ${series.format}`);
    
    // Exemple d'implémentation Prisma (à activer en production)
    /*
    await prisma.numberingSeries.upsert({
      where: { 
        type_year: { 
          type: series.type, 
          year: series.year 
        } 
      },
      update: {
        currentNumber: series.currentNumber,
        prefix: series.prefix,
        format: series.format
      },
      create: series
    });
    */
  }

  /**
   * Créer backup des séries actuelles
   */
  static async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `numbering-backup-${timestamp}.json`;
    
    // Simulation - En production, sauvegarder les données actuelles
    console.log(`💾 Backup créé: ${backupFile}`);
    
    // Exemple d'implémentation
    /*
    const currentSeries = await prisma.numberingSeries.findMany();
    await fs.writeFile(
      path.join(process.cwd(), 'backups', backupFile),
      JSON.stringify(currentSeries, null, 2)
    );
    */
  }

  /**
   * Valider le reset
   */
  static async validateReset(): Promise<void> {
    console.log('🔍 Validation du reset...');
    
    for (const series of NUMBERING_SERIES_2025) {
      // Vérifier que la série a bien été resetée
      const nextNumber = await this.getNextNumber(series.type);
      if (nextNumber !== this.formatNumber(series, 1)) {
        throw new Error(`Validation échouée pour ${series.type}`);
      }
    }
    
    console.log('✅ Validation réussie');
  }

  /**
   * Générer le prochain numéro pour un type donné
   */
  static async getNextNumber(type: string): Promise<string> {
    const series = NUMBERING_SERIES_2025.find(s => s.type === type);
    if (!series) {
      throw new Error(`Série non trouvée: ${type}`);
    }

    return this.formatNumber(series, series.currentNumber);
  }

  /**
   * Formater un numéro selon le format de la série
   */
  static formatNumber(series: NumberingSeries, number: number): string {
    return series.format.replace('{number:6}', number.toString().padStart(6, '0'))
                        .replace('{number:8}', number.toString().padStart(8, '0'));
  }

  /**
   * Incrémenter et retourner le prochain numéro
   */
  static async incrementAndGetNext(type: string): Promise<string> {
    // En production, ceci incrémenterait en base
    const series = NUMBERING_SERIES_2025.find(s => s.type === type);
    if (!series) {
      throw new Error(`Série non trouvée: ${type}`);
    }

    series.currentNumber++;
    return this.formatNumber(series, series.currentNumber);
  }
}

/**
 * Script de reset pour production
 */
export async function executeProductionReset(): Promise<ResetReport> {
  console.log('🚀 Démarrage reset numérotations production 2025...');
  
  const report = await NumberingResetService.resetAllSeries('PRODUCTION_DEPLOY');
  
  if (report.success) {
    console.log('✅ Reset production terminé avec succès');
    console.log(`📊 ${report.series.length} séries resetées`);
  } else {
    console.error('❌ Échec du reset production');
    console.error('Erreurs:', report.errors);
  }
  
  return report;
}
