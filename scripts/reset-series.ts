#!/usr/bin/env tsx
/**
 * Reset Series 2025 - Production Counters
 * Upsert table counters pour séries 2025 avec seq=0
 */

import { PrismaClient } from '@prisma/client';

interface SeriesConfig {
  type: string;
  series: string;
  sequence: number;
  format: string;
}

interface ResetResult {
  timestamp: string;
  series: SeriesConfig[];
  success: boolean;
  errors: string[];
}

export class SeriesResetService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Reset toutes les séries 2025
   */
  async resetSeries2025(): Promise<ResetResult> {
    const result: ResetResult = {
      timestamp: new Date().toISOString(),
      series: [],
      success: false,
      errors: []
    };

    try {
      console.log('🔄 RESET SERIES 2025 - NextMove Cargo Production');
      console.log('===============================================');

      // Configuration des séries 2025
      const seriesConfig: SeriesConfig[] = [
        {
          type: 'invoice',
          series: 'INV-2025',
          sequence: 0,
          format: 'INV-2025-{seq:6}'
        },
        {
          type: 'shipment',
          series: 'EXP-2025',
          sequence: 0,
          format: 'EXP-2025-{seq:6}'
        },
        {
          type: 'customer',
          series: 'CUS-2025',
          sequence: 0,
          format: 'CUS-2025-{seq:6}'
        },
        {
          type: 'revenue',
          series: 'REV-2025',
          sequence: 0,
          format: 'REV-2025-{seq:6}'
        },
        {
          type: 'quote',
          series: 'QUO-2025',
          sequence: 0,
          format: 'QUO-2025-{seq:6}'
        },
        {
          type: 'receipt',
          series: 'REC-2025',
          sequence: 0,
          format: 'REC-2025-{seq:6}'
        },
        {
          type: 'contract',
          series: 'CON-2025',
          sequence: 0,
          format: 'CON-2025-{seq:6}'
        }
      ];

      // Créer table counters si elle n'existe pas
      await this.ensureCountersTable();

      // Reset chaque série
      for (const config of seriesConfig) {
        await this.upsertCounter(config);
        result.series.push(config);
        console.log(`  ✅ ${config.type}: ${config.series} → prochain: ${this.formatNumber(config.series, 1)}`);
      }

      result.success = true;
      console.log('');
      console.log(`✅ RESET TERMINÉ - ${result.series.length} séries initialisées`);

    } catch (error) {
      result.errors.push(`Series reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('💥 Erreur reset séries:', error);
    } finally {
      await this.prisma.$disconnect();
    }

    return result;
  }

  /**
   * Créer table counters si nécessaire
   */
  private async ensureCountersTable(): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS counters (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) UNIQUE NOT NULL,
          series VARCHAR(20) NOT NULL,
          sequence INTEGER DEFAULT 0,
          format VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('  📊 Table counters vérifiée/créée');
    } catch (error) {
      console.warn('Erreur création table counters:', error);
    }
  }

  /**
   * Upsert counter pour une série
   */
  private async upsertCounter(config: SeriesConfig): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO counters (type, series, sequence, format, updated_at)
        VALUES (${config.type}, ${config.series}, ${config.sequence}, ${config.format}, CURRENT_TIMESTAMP)
        ON CONFLICT (type) 
        DO UPDATE SET 
          series = EXCLUDED.series,
          sequence = EXCLUDED.sequence,
          format = EXCLUDED.format,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (error) {
      // Fallback pour bases sans UPSERT
      try {
        await this.prisma.$executeRaw`
          DELETE FROM counters WHERE type = ${config.type}
        `;
        await this.prisma.$executeRaw`
          INSERT INTO counters (type, series, sequence, format)
          VALUES (${config.type}, ${config.series}, ${config.sequence}, ${config.format})
        `;
      } catch (fallbackError) {
        throw new Error(`Failed to upsert counter for ${config.type}: ${fallbackError}`);
      }
    }
  }

  /**
   * Formater numéro selon série
   */
  private formatNumber(series: string, sequence: number): string {
    return `${series}-${String(sequence).padStart(6, '0')}`;
  }

  /**
   * Générer prochain numéro pour une série
   */
  async getNextNumber(type: string): Promise<string> {
    try {
      const counter = await this.prisma.$queryRaw<any[]>`
        SELECT series, sequence FROM counters WHERE type = ${type}
      `;

      if (counter.length === 0) {
        throw new Error(`Counter not found for type: ${type}`);
      }

      const { series, sequence } = counter[0];
      const nextSequence = sequence + 1;

      // Incrémenter le compteur
      await this.prisma.$executeRaw`
        UPDATE counters 
        SET sequence = ${nextSequence}, updated_at = CURRENT_TIMESTAMP 
        WHERE type = ${type}
      `;

      return this.formatNumber(series, nextSequence);
    } catch (error) {
      throw new Error(`Failed to get next number for ${type}: ${error}`);
    }
  }

  /**
   * Vérifier état des compteurs
   */
  async getCountersStatus(): Promise<any[]> {
    try {
      const counters = await this.prisma.$queryRaw<any[]>`
        SELECT type, series, sequence, 
               CONCAT(series, '-', LPAD(CAST(sequence + 1 AS TEXT), 6, '0')) as next_number,
               updated_at
        FROM counters 
        ORDER BY type
      `;
      return counters;
    } catch (error) {
      console.warn('Erreur lecture compteurs:', error);
      return [];
    }
  }
}

/**
 * Script principal
 */
async function main() {
  const resetService = new SeriesResetService();
  const result = await resetService.resetSeries2025();
  
  // Vérifier état final
  console.log('\n📊 ÉTAT FINAL DES COMPTEURS');
  console.log('===========================');
  const counters = await resetService.getCountersStatus();
  counters.forEach(counter => {
    console.log(`  ${counter.type}: ${counter.next_number} (seq: ${counter.sequence})`);
  });
  
  // Sauvegarder rapport
  const fs = require('fs').promises;
  const reportPath = `docs/prod/series-reset-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  
  try {
    await fs.writeFile(reportPath, JSON.stringify({ ...result, finalCounters: counters }, null, 2));
    console.log(`\n📄 Rapport reset sauvegardé: ${reportPath}`);
  } catch (error) {
    console.warn('Erreur sauvegarde rapport:', error);
  }
  
  // Afficher résumé
  console.log('\n📊 RÉSUMÉ RESET SERIES');
  console.log('=====================');
  console.log(`Séries initialisées: ${result.series.length}`);
  console.log(`Statut: ${result.success ? 'SUCCÈS ✅' : 'ÉCHEC ❌'}`);
  console.log('Prochains numéros:');
  result.series.forEach(series => {
    console.log(`  - ${series.type}: ${series.series}-000001`);
  });
  
  if (result.errors.length > 0) {
    console.log('\n🚨 ERREURS:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  process.exit(result.success ? 0 : 1);
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

export { main as resetSeries2025 };
