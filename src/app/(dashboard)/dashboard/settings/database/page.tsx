'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Settings,
  Activity,
  HardDrive,
  Clock,
  Users,
  FileText
} from 'lucide-react'

interface DatabaseConfig {
  connection: {
    host: string
    port: number
    database: string
    username: string
    password: string
    ssl: boolean
    poolSize: number
    timeout: number
  }
  backup: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    retention: number
    location: string
    compression: boolean
  }
  performance: {
    queryLogging: boolean
    slowQueryThreshold: number
    indexOptimization: boolean
    cacheEnabled: boolean
    cacheSize: number
  }
  maintenance: {
    autoVacuum: boolean
    autoAnalyze: boolean
    maintenanceWindow: string
    alertsEnabled: boolean
  }
}

interface DatabaseStats {
  size: string
  tables: number
  connections: number
  uptime: string
  queries: number
  avgResponseTime: string
}

const mockDatabaseStats: DatabaseStats = {
  size: '2.4 GB',
  tables: 47,
  connections: 12,
  uptime: '15 jours 8h 32min',
  queries: 1247892,
  avgResponseTime: '23ms'
}

export default function DatabaseSettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [config, setConfig] = useState<DatabaseConfig>({
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'nextmove_cargo',
      username: 'nextmove_user',
      password: '••••••••••••',
      ssl: true,
      poolSize: 20,
      timeout: 30000
    },
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: 30,
      location: '/backups/database',
      compression: true
    },
    performance: {
      queryLogging: true,
      slowQueryThreshold: 1000,
      indexOptimization: true,
      cacheEnabled: true,
      cacheSize: 256
    },
    maintenance: {
      autoVacuum: true,
      autoAnalyze: true,
      maintenanceWindow: '02:00-04:00',
      alertsEnabled: true
    }
  })

  const updateConnectionSetting = (key: keyof DatabaseConfig['connection'], value: any) => {
    setConfig(prev => ({
      ...prev,
      connection: { ...prev.connection, [key]: value }
    }))
  }

  const updateBackupSetting = (key: keyof DatabaseConfig['backup'], value: any) => {
    setConfig(prev => ({
      ...prev,
      backup: { ...prev.backup, [key]: value }
    }))
  }

  const updatePerformanceSetting = (key: keyof DatabaseConfig['performance'], value: any) => {
    setConfig(prev => ({
      ...prev,
      performance: { ...prev.performance, [key]: value }
    }))
  }

  const updateMaintenanceSetting = (key: keyof DatabaseConfig['maintenance'], value: any) => {
    setConfig(prev => ({
      ...prev,
      maintenance: { ...prev.maintenance, [key]: value }
    }))
  }

  const handleSaveConfig = () => {
    // Simulation de sauvegarde
    alert('Configuration de la base de données sauvegardée avec succès !')
  }

  const handleTestConnection = () => {
    // Simulation de test de connexion
    alert('Test de connexion réussi ! Base de données accessible.')
  }

  const handleBackupNow = () => {
    // Simulation de sauvegarde manuelle
    alert('Sauvegarde manuelle démarrée. Vous recevrez une notification à la fin.')
  }

  const handleOptimizeDatabase = () => {
    // Simulation d'optimisation
    if (confirm('Optimiser la base de données ? Cette opération peut prendre plusieurs minutes.')) {
      alert('Optimisation démarrée en arrière-plan.')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Paramètres Base de Données
          </h1>
          <p className="text-gray-600 mt-2">
            Configuration et gestion de la base de données PostgreSQL
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleTestConnection} variant="outline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tester la connexion
          </Button>
          <Button onClick={handleSaveConfig} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Statistiques de la base de données */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <HardDrive className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taille</p>
                <p className="text-lg font-semibold text-blue-700">{mockDatabaseStats.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tables</p>
                <p className="text-lg font-semibold text-green-700">{mockDatabaseStats.tables}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Connexions</p>
                <p className="text-lg font-semibold text-purple-700">{mockDatabaseStats.connections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-lg font-semibold text-orange-700">{mockDatabaseStats.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Requêtes</p>
                <p className="text-lg font-semibold text-teal-700">{mockDatabaseStats.queries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps moy.</p>
                <p className="text-lg font-semibold text-indigo-700">{mockDatabaseStats.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration de connexion */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuration de Connexion
            </CardTitle>
            <CardDescription className="text-blue-100">
              Paramètres de connexion à la base de données
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hôte
                </label>
                <input
                  type="text"
                  value={config.connection.host}
                  onChange={(e) => updateConnectionSetting('host', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={config.connection.port}
                  onChange={(e) => updateConnectionSetting('port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base de données
              </label>
              <input
                type="text"
                value={config.connection.database}
                onChange={(e) => updateConnectionSetting('database', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={config.connection.username}
                onChange={(e) => updateConnectionSetting('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={config.connection.password}
                  onChange={(e) => updateConnectionSetting('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille du pool
                </label>
                <input
                  type="number"
                  value={config.connection.poolSize}
                  onChange={(e) => updateConnectionSetting('poolSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (ms)
                </label>
                <input
                  type="number"
                  value={config.connection.timeout}
                  onChange={(e) => updateConnectionSetting('timeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Connexion SSL
              </label>
              <Switch
                checked={config.connection.ssl}
                onCheckedChange={(checked) => updateConnectionSetting('ssl', checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sauvegarde */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Sauvegarde Automatique
            </CardTitle>
            <CardDescription className="text-green-100">
              Configuration des sauvegardes automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Sauvegarde activée
              </label>
              <Switch
                checked={config.backup.enabled}
                onCheckedChange={(checked) => updateBackupSetting('enabled', checked)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence
              </label>
              <select
                value={config.backup.frequency}
                onChange={(e) => updateBackupSetting('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!config.backup.enabled}
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rétention (jours)
              </label>
              <input
                type="number"
                value={config.backup.retention}
                onChange={(e) => updateBackupSetting('retention', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!config.backup.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emplacement
              </label>
              <input
                type="text"
                value={config.backup.location}
                onChange={(e) => updateBackupSetting('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!config.backup.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Compression
              </label>
              <Switch
                checked={config.backup.compression}
                onCheckedChange={(checked) => updateBackupSetting('compression', checked)}
                className="data-[state=checked]:bg-green-600"
                disabled={!config.backup.enabled}
              />
            </div>

            <Button 
              onClick={handleBackupNow}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              disabled={!config.backup.enabled}
            >
              <Download className="h-4 w-4 mr-2" />
              Sauvegarder maintenant
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription className="text-purple-100">
              Optimisation et monitoring des performances
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Logging des requêtes
              </label>
              <Switch
                checked={config.performance.queryLogging}
                onCheckedChange={(checked) => updatePerformanceSetting('queryLogging', checked)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil requêtes lentes (ms)
              </label>
              <input
                type="number"
                value={config.performance.slowQueryThreshold}
                onChange={(e) => updatePerformanceSetting('slowQueryThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Optimisation des index
              </label>
              <Switch
                checked={config.performance.indexOptimization}
                onCheckedChange={(checked) => updatePerformanceSetting('indexOptimization', checked)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Cache activé
              </label>
              <Switch
                checked={config.performance.cacheEnabled}
                onCheckedChange={(checked) => updatePerformanceSetting('cacheEnabled', checked)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille du cache (MB)
              </label>
              <input
                type="number"
                value={config.performance.cacheSize}
                onChange={(e) => updatePerformanceSetting('cacheSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!config.performance.cacheEnabled}
              />
            </div>

            <Button 
              onClick={handleOptimizeDatabase}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Optimiser la base de données
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Maintenance
            </CardTitle>
            <CardDescription className="text-orange-100">
              Tâches de maintenance automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto VACUUM
              </label>
              <Switch
                checked={config.maintenance.autoVacuum}
                onCheckedChange={(checked) => updateMaintenanceSetting('autoVacuum', checked)}
                className="data-[state=checked]:bg-orange-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto ANALYZE
              </label>
              <Switch
                checked={config.maintenance.autoAnalyze}
                onCheckedChange={(checked) => updateMaintenanceSetting('autoAnalyze', checked)}
                className="data-[state=checked]:bg-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fenêtre de maintenance
              </label>
              <input
                type="text"
                value={config.maintenance.maintenanceWindow}
                onChange={(e) => updateMaintenanceSetting('maintenanceWindow', e.target.value)}
                placeholder="ex: 02:00-04:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Alertes activées
              </label>
              <Switch
                checked={config.maintenance.alertsEnabled}
                onCheckedChange={(checked) => updateMaintenanceSetting('alertsEnabled', checked)}
                className="data-[state=checked]:bg-orange-600"
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800">Information</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    La maintenance automatique s'exécute pendant la fenêtre définie pour minimiser l'impact sur les performances.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
