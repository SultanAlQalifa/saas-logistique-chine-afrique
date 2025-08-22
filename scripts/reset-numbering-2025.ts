#!/usr/bin/env tsx
/**
 * Script de reset des numérotations pour production 2025
 * Usage: npm run reset:numbering
 */

import { executeProductionReset, NumberingResetService } from '../lib/numbering-reset';

async function main() {
  console.log('🔢 RESET NUMÉROTATIONS PRODUCTION 2025');
  console.log('=====================================');
  
  try {
    // Confirmation de sécurité
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  ATTENTION: Exécution en mode PRODUCTION');
      console.log('📋 Séries qui seront resetées:');
      console.log('   - Factures (INV-2025-XXXXXX)');
      console.log('   - Devis (DEV-2025-XXXXXX)');
      console.log('   - Tracking (NM-2025-XXXXXXXX)');
      console.log('   - Reçus (REC-2025-XXXXXX)');
      console.log('   - Contrats (CTR-2025-XXXXXX)');
      console.log('');
    }

    // Exécuter le reset
    const report = await executeProductionReset();
    
    // Afficher le rapport
    console.log('');
    console.log('📊 RAPPORT DE RESET');
    console.log('==================');
    console.log(`⏰ Timestamp: ${report.timestamp}`);
    console.log(`👤 Exécuté par: ${report.resetBy}`);
    console.log(`💾 Backup créé: ${report.backupCreated ? '✅' : '❌'}`);
    console.log(`✅ Succès: ${report.success ? '✅' : '❌'}`);
    console.log(`🔢 Séries resetées: ${report.series.length}`);
    
    if (report.errors.length > 0) {
      console.log('');
      console.log('❌ ERREURS:');
      report.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Test des numéros générés
    if (report.success) {
      console.log('');
      console.log('🧪 TEST GÉNÉRATION NUMÉROS');
      console.log('==========================');
      
      const testTypes = ['invoice', 'quote', 'tracking', 'receipt', 'contract'];
      for (const type of testTypes) {
        try {
          const nextNumber = await NumberingResetService.getNextNumber(type);
          console.log(`${type.padEnd(10)}: ${nextNumber}`);
        } catch (error) {
          console.error(`❌ Erreur ${type}:`, error);
        }
      }
    }
    
    console.log('');
    console.log(report.success ? '✅ RESET TERMINÉ AVEC SUCCÈS' : '❌ RESET ÉCHOUÉ');
    
    process.exit(report.success ? 0 : 1);
    
  } catch (error) {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

export { main as resetNumbering2025 };
