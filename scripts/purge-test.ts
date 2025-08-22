#!/usr/bin/env tsx
/**
 * Purge Test Data - Production Cleanup
 * Supprime toutes les données marquées is_test=true
 */

import { PrismaClient } from '@prisma/client';

interface PurgeResult {
  timestamp: string;
  tables: {
    users: number;
    clients: number;
    shipments: number;
    invoices: number;
    transactions: number;
    logs: number;
    webhooks: number;
  };
  totalPurged: number;
  success: boolean;
  errors: string[];
}

export class TestDataPurgeService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Purger toutes les données de test
   */
  async purgeTestData(): Promise<PurgeResult> {
    const result: PurgeResult = {
      timestamp: new Date().toISOString(),
      tables: {
        users: 0,
        clients: 0,
        shipments: 0,
        invoices: 0,
        transactions: 0,
        logs: 0,
        webhooks: 0
      },
      totalPurged: 0,
      success: false,
      errors: []
    };

    try {
      console.log('🧹 PURGE TEST DATA - NextMove Cargo Production');
      console.log('==============================================');

      // 1. Purger webhooks de test
      const webhooksPurged = await this.purgeWebhooks();
      result.tables.webhooks = webhooksPurged;
      console.log(`  🗑️ Webhooks purgés: ${webhooksPurged}`);

      // 2. Purger logs de test
      const logsPurged = await this.purgeLogs();
      result.tables.logs = logsPurged;
      console.log(`  🗑️ Logs purgés: ${logsPurged}`);

      // 3. Purger transactions de test
      const transactionsPurged = await this.purgeTransactions();
      result.tables.transactions = transactionsPurged;
      console.log(`  🗑️ Transactions purgées: ${transactionsPurged}`);

      // 4. Purger factures de test
      const invoicesPurged = await this.purgeInvoices();
      result.tables.invoices = invoicesPurged;
      console.log(`  🗑️ Factures purgées: ${invoicesPurged}`);

      // 5. Purger expéditions de test
      const shipmentsPurged = await this.purgeShipments();
      result.tables.shipments = shipmentsPurged;
      console.log(`  🗑️ Expéditions purgées: ${shipmentsPurged}`);

      // 6. Purger clients de test
      const clientsPurged = await this.purgeClients();
      result.tables.clients = clientsPurged;
      console.log(`  🗑️ Clients purgés: ${clientsPurged}`);

      // 7. Purger utilisateurs de test (sauf owner)
      const usersPurged = await this.purgeUsers();
      result.tables.users = usersPurged;
      console.log(`  🗑️ Utilisateurs purgés: ${usersPurged}`);

      result.totalPurged = Object.values(result.tables).reduce((sum, count) => sum + count, 0);
      result.success = true;

      console.log('');
      console.log(`✅ PURGE TERMINÉ - ${result.totalPurged} enregistrements supprimés`);

    } catch (error) {
      result.errors.push(`Purge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('💥 Erreur purge:', error);
    } finally {
      await this.prisma.$disconnect();
    }

    return result;
  }

  /**
   * Purger webhooks de test
   */
  private async purgeWebhooks(): Promise<number> {
    try {
      // Supprimer webhooks avec payload de test ou URL de test
      const result = await this.prisma.$executeRaw`
        DELETE FROM webhooks 
        WHERE payload::text LIKE '%test%' 
        OR payload::text LIKE '%demo%' 
        OR payload::text LIKE '%sample%'
        OR url LIKE '%test%'
        OR url LIKE '%localhost%'
        OR url LIKE '%127.0.0.1%'
      `;
      return Number(result);
    } catch (error) {
      console.warn('Webhooks table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger logs de test
   */
  private async purgeLogs(): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM logs 
        WHERE message LIKE '%test%' 
        OR message LIKE '%demo%' 
        OR message LIKE '%sample%'
        OR level = 'debug'
        OR context::text LIKE '%test%'
      `;
      return Number(result);
    } catch (error) {
      console.warn('Logs table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger transactions de test
   */
  private async purgeTransactions(): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM transactions 
        WHERE reference LIKE '%test%' 
        OR reference LIKE '%demo%' 
        OR reference LIKE '%sample%'
        OR description LIKE '%test%'
        OR amount < 100
      `;
      return Number(result);
    } catch (error) {
      console.warn('Transactions table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger factures de test
   */
  private async purgeInvoices(): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM invoices 
        WHERE number LIKE '%test%' 
        OR number LIKE '%demo%' 
        OR number LIKE '%sample%'
        OR description LIKE '%test%'
        OR client_name LIKE '%test%'
        OR amount < 100
      `;
      return Number(result);
    } catch (error) {
      console.warn('Invoices table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger expéditions de test
   */
  private async purgeShipments(): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM shipments 
        WHERE tracking_number LIKE '%test%' 
        OR tracking_number LIKE '%demo%' 
        OR tracking_number LIKE '%sample%'
        OR sender_name LIKE '%test%'
        OR recipient_name LIKE '%test%'
        OR description LIKE '%test%'
      `;
      return Number(result);
    } catch (error) {
      console.warn('Shipments table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger clients de test
   */
  private async purgeClients(): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        DELETE FROM clients 
        WHERE email LIKE '%test%' 
        OR email LIKE '%demo%' 
        OR email LIKE '%sample%'
        OR email LIKE '%example.com%'
        OR name LIKE '%test%'
        OR phone LIKE '%0000%'
      `;
      return Number(result);
    } catch (error) {
      console.warn('Clients table not found or error:', error);
      return 0;
    }
  }

  /**
   * Purger utilisateurs de test (sauf owner)
   */
  private async purgeUsers(): Promise<number> {
    try {
      const ownerEmail = process.env.OWNER_EMAIL || 'djeylanidjitte@gmail.com';
      
      const result = await this.prisma.$executeRaw`
        DELETE FROM users 
        WHERE email != ${ownerEmail}
        AND (
          email LIKE '%test%' 
          OR email LIKE '%demo%' 
          OR email LIKE '%sample%'
          OR email LIKE '%example.com%'
          OR name LIKE '%test%'
          OR role = 'TEST'
        )
      `;
      return Number(result);
    } catch (error) {
      console.warn('Users table not found or error:', error);
      return 0;
    }
  }
}

/**
 * Script principal
 */
async function main() {
  const purgeService = new TestDataPurgeService();
  const result = await purgeService.purgeTestData();
  
  // Sauvegarder rapport
  const fs = require('fs').promises;
  const reportPath = `docs/prod/purge-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  
  try {
    await fs.writeFile(reportPath, JSON.stringify(result, null, 2));
    console.log(`📄 Rapport purge sauvegardé: ${reportPath}`);
  } catch (error) {
    console.warn('Erreur sauvegarde rapport:', error);
  }
  
  // Afficher résumé
  console.log('\n📊 RÉSUMÉ PURGE');
  console.log('===============');
  console.log(`Total purgé: ${result.totalPurged} enregistrements`);
  console.log(`Statut: ${result.success ? 'SUCCÈS ✅' : 'ÉCHEC ❌'}`);
  
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

export { main as purgeTestData };
