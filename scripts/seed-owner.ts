#!/usr/bin/env tsx
/**
 * Seed Owner Account - Production Setup
 * Créer compte propriétaire unique et désactiver autres comptes
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

interface SeedResult {
  timestamp: string;
  owner: {
    email: string;
    tenantId: string;
    created: boolean;
    passwordSet: boolean;
  };
  otherAccounts: {
    disabled: number;
    total: number;
  };
  success: boolean;
  errors: string[];
}

export class OwnerSeedService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Seed compte propriétaire unique
   */
  async seedOwnerAccount(): Promise<SeedResult> {
    const result: SeedResult = {
      timestamp: new Date().toISOString(),
      owner: {
        email: 'djeylanidjitte@gmail.com',
        tenantId: process.env.TENANT_ID || uuidv4(),
        created: false,
        passwordSet: false
      },
      otherAccounts: {
        disabled: 0,
        total: 0
      },
      success: false,
      errors: []
    };

    try {
      console.log('👑 SEED OWNER ACCOUNT - NextMove Cargo Production');
      console.log('===============================================');

      const ownerEmail = result.owner.email;
      const tenantId = result.owner.tenantId;
      const tempPassword = process.env.INIT_OWNER_PASSWORD || 'TempPass2025!';

      // 1. Créer table users si nécessaire
      await this.ensureUsersTable();

      // 2. Hash du mot de passe temporaire
      const hashedPassword = await hash(tempPassword, 12);
      result.owner.passwordSet = true;

      // 3. Upsert compte propriétaire
      await this.upsertOwnerAccount(ownerEmail, tenantId, hashedPassword);
      result.owner.created = true;
      console.log(`  👑 Propriétaire créé/mis à jour: ${ownerEmail}`);
      console.log(`  🏢 Tenant ID: ${tenantId}`);
      console.log(`  🔑 Mot de passe temporaire défini`);

      // 4. Désactiver tous les autres comptes
      const disabledCount = await this.disableOtherAccounts(ownerEmail);
      result.otherAccounts.disabled = disabledCount;
      console.log(`  🚫 Autres comptes désactivés: ${disabledCount}`);

      // 5. Compter total des comptes
      const totalAccounts = await this.countTotalAccounts();
      result.otherAccounts.total = totalAccounts;
      console.log(`  📊 Total comptes: ${totalAccounts}`);

      result.success = true;
      console.log('');
      console.log('✅ SEED OWNER TERMINÉ');
      console.log(`📧 Email: ${ownerEmail}`);
      console.log(`🔑 Mot de passe: ${tempPassword}`);
      console.log('⚠️  CHANGEZ LE MOT DE PASSE APRÈS PREMIÈRE CONNEXION');

    } catch (error) {
      result.errors.push(`Owner seed failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('💥 Erreur seed owner:', error);
    } finally {
      await this.prisma.$disconnect();
    }

    return result;
  }

  /**
   * Créer table users si nécessaire
   */
  private async ensureUsersTable(): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          password VARCHAR(255),
          role VARCHAR(50) DEFAULT 'CLIENT',
          tenant_id VARCHAR(255),
          disabled BOOLEAN DEFAULT FALSE,
          must_change_password BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('  👥 Table users vérifiée/créée');
    } catch (error) {
      console.warn('Erreur création table users:', error);
    }
  }

  /**
   * Upsert compte propriétaire
   */
  private async upsertOwnerAccount(email: string, tenantId: string, hashedPassword: string): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO users (email, name, password, role, tenant_id, disabled, must_change_password, updated_at)
        VALUES (
          ${email}, 
          'Cheikh Abdoul Khadre Djeylani DJITTE', 
          ${hashedPassword}, 
          'OWNER', 
          ${tenantId}, 
          FALSE, 
          TRUE, 
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          password = EXCLUDED.password,
          role = 'OWNER',
          tenant_id = EXCLUDED.tenant_id,
          disabled = FALSE,
          must_change_password = TRUE,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (error) {
      // Fallback pour bases sans UPSERT
      try {
        await this.prisma.$executeRaw`
          DELETE FROM users WHERE email = ${email}
        `;
        await this.prisma.$executeRaw`
          INSERT INTO users (email, name, password, role, tenant_id, disabled, must_change_password)
          VALUES (
            ${email}, 
            'Cheikh Abdoul Khadre Djeylani DJITTE', 
            ${hashedPassword}, 
            'OWNER', 
            ${tenantId}, 
            FALSE, 
            TRUE
          )
        `;
      } catch (fallbackError) {
        throw new Error(`Failed to upsert owner account: ${fallbackError}`);
      }
    }
  }

  /**
   * Désactiver tous les autres comptes
   */
  private async disableOtherAccounts(ownerEmail: string): Promise<number> {
    try {
      const result = await this.prisma.$executeRaw`
        UPDATE users 
        SET disabled = TRUE, updated_at = CURRENT_TIMESTAMP 
        WHERE email != ${ownerEmail}
      `;
      return Number(result);
    } catch (error) {
      console.warn('Erreur désactivation autres comptes:', error);
      return 0;
    }
  }

  /**
   * Compter total des comptes
   */
  private async countTotalAccounts(): Promise<number> {
    try {
      const result = await this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM users
      `;
      return Number(result[0].count);
    } catch (error) {
      console.warn('Erreur comptage comptes:', error);
      return 0;
    }
  }

  /**
   * Vérifier état des comptes
   */
  async getAccountsStatus(): Promise<any[]> {
    try {
      const accounts = await this.prisma.$queryRaw<any[]>`
        SELECT email, name, role, disabled, must_change_password, created_at
        FROM users 
        ORDER BY role DESC, email
      `;
      return accounts;
    } catch (error) {
      console.warn('Erreur lecture comptes:', error);
      return [];
    }
  }
}

/**
 * Script principal
 */
async function main() {
  // Vérifier variables d'environnement
  const requiredEnvs = ['TENANT_ID', 'INIT_OWNER_PASSWORD'];
  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.error('🚨 Variables d\'environnement manquantes:');
    missingEnvs.forEach(env => console.error(`  - ${env}`));
    console.error('\nExemple:');
    console.error('TENANT_ID="550e8400-e29b-41d4-a716-446655440000" INIT_OWNER_PASSWORD="TempPass2025!" npx tsx scripts/seed-owner.ts');
    process.exit(1);
  }

  const seedService = new OwnerSeedService();
  const result = await seedService.seedOwnerAccount();
  
  // Vérifier état final
  console.log('\n👥 ÉTAT FINAL DES COMPTES');
  console.log('========================');
  const accounts = await seedService.getAccountsStatus();
  accounts.forEach(account => {
    const status = account.disabled ? '🚫 DÉSACTIVÉ' : '✅ ACTIF';
    const mustChange = account.must_change_password ? '🔄 Doit changer MDP' : '';
    console.log(`  ${account.email} (${account.role}) - ${status} ${mustChange}`);
  });
  
  // Sauvegarder rapport
  const fs = require('fs').promises;
  const reportPath = `docs/prod/owner-seed-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  
  try {
    // Ne pas sauvegarder le mot de passe dans le rapport
    const safeResult = { ...result };
    delete (safeResult as any).tempPassword;
    
    await fs.writeFile(reportPath, JSON.stringify({ ...safeResult, finalAccounts: accounts }, null, 2));
    console.log(`\n📄 Rapport seed sauvegardé: ${reportPath}`);
  } catch (error) {
    console.warn('Erreur sauvegarde rapport:', error);
  }
  
  // Afficher résumé
  console.log('\n📊 RÉSUMÉ SEED OWNER');
  console.log('===================');
  console.log(`Propriétaire: ${result.owner.email} ${result.owner.created ? '✅' : '❌'}`);
  console.log(`Tenant ID: ${result.owner.tenantId}`);
  console.log(`Autres comptes désactivés: ${result.otherAccounts.disabled}`);
  console.log(`Total comptes: ${result.otherAccounts.total}`);
  console.log(`Statut: ${result.success ? 'SUCCÈS ✅' : 'ÉCHEC ❌'}`);
  
  if (result.success) {
    console.log('\n🔐 CONNEXION PRODUCTION:');
    console.log(`Email: ${result.owner.email}`);
    console.log(`Mot de passe: ${process.env.INIT_OWNER_PASSWORD}`);
    console.log('⚠️  CHANGEZ LE MOT DE PASSE IMMÉDIATEMENT APRÈS CONNEXION');
  }
  
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

export { main as seedOwnerAccount };
