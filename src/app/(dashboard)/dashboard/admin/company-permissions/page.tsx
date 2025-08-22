'use client'

import React, { useState } from 'react'
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Globe,
  Settings,
  Save,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { COMPANY_MODULES, CompanyPermissionService, mockCompanyPermissions } from '@/lib/company-permissions'

const iconMap = {
  Users,
  TrendingUp,
  CreditCard,
  MessageSquare,
  BarChart3,
  Globe
}

export default function CompanyPermissionsPage() {
  const [selectedCompany, setSelectedCompany] = useState('logitrans-senegal')
  const [permissions, setPermissions] = useState(() => {
    return CompanyPermissionService.getCompanyPermissions(selectedCompany) || 
           CompanyPermissionService.createDefaultPermissions(selectedCompany)
  })
  const [hasChanges, setHasChanges] = useState(false)

  const companies = [
    { id: 'logitrans-senegal', name: 'LogiTrans Sénégal', plan: 'ENTERPRISE' },
    { id: 'sahara-express', name: 'Sahara Express', plan: 'PREMIUM' },
    { id: 'africa-cargo', name: 'Africa Cargo', plan: 'BASIC' }
  ]

  const handleCompanyChange = (companyId: string) => {
    if (hasChanges) {
      if (!confirm('Vous avez des modifications non sauvegardées. Continuer ?')) {
        return
      }
    }
    
    setSelectedCompany(companyId)
    const companyPermissions = CompanyPermissionService.getCompanyPermissions(companyId) || 
                              CompanyPermissionService.createDefaultPermissions(companyId)
    setPermissions(companyPermissions)
    setHasChanges(false)
  }

  const handleModuleToggle = (moduleKey: string, enabled: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleKey]: enabled,
      updatedAt: new Date()
    }))
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    Object.entries(permissions).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'companyId' && key !== 'createdAt' && key !== 'updatedAt') {
        CompanyPermissionService.updateModulePermission(
          selectedCompany, 
          key as any, 
          value as boolean
        )
      }
    })
    setHasChanges(false)
    alert('✅ Permissions sauvegardées avec succès !')
  }

  const getModuleStatus = (moduleKey: string) => {
    return permissions[moduleKey as keyof typeof permissions] as boolean
  }

  const selectedCompanyData = companies.find(c => c.id === selectedCompany)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">🔐 Autorisations Entreprises</h1>
              <p className="text-blue-100 mt-1">
                Gérez les modules accessibles pour chaque entreprise
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Sélection Entreprise */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Sélectionner une Entreprise</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleCompanyChange(company.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCompany === company.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-sm text-gray-600">Plan: {company.plan}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedCompany === company.id
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedCompany === company.id ? 'Sélectionnée' : 'Cliquer pour sélectionner'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration des Modules */}
        {selectedCompanyData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Modules pour {selectedCompanyData.name}
                </h2>
                <p className="text-gray-600">
                  Plan {selectedCompanyData.plan} • Configurez les accès aux modules
                </p>
              </div>
              
              {hasChanges && (
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder
                </button>
              )}
            </div>

            {hasChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    Modifications non sauvegardées
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMPANY_MODULES.map((module) => {
                const IconComponent = iconMap[module.icon as keyof typeof iconMap]
                const isEnabled = getModuleStatus(module.module)
                const canAccess = !module.requiresPlan || 
                                module.requiresPlan.includes(selectedCompanyData.plan)

                return (
                  <div
                    key={module.module}
                    className={`border-2 rounded-lg p-6 transition-all ${
                      isEnabled && canAccess
                        ? 'border-green-200 bg-green-50'
                        : canAccess
                        ? 'border-gray-200 bg-white'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          isEnabled && canAccess
                            ? 'bg-green-100'
                            : canAccess
                            ? 'bg-gray-100'
                            : 'bg-red-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            isEnabled && canAccess
                              ? 'text-green-600'
                              : canAccess
                              ? 'text-gray-600'
                              : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          {module.requiresPlan && (
                            <p className="text-xs text-purple-600 mt-2">
                              Requis: {module.requiresPlan.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {canAccess ? (
                          <button
                            onClick={() => handleModuleToggle(module.module, !isEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEnabled ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Plan insuffisant</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          {isEnabled && canAccess ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Activé</span>
                            </>
                          ) : canAccess ? (
                            <>
                              <XCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-400 font-medium">Désactivé</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-xs text-red-600 font-medium">Non disponible</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Résumé des Permissions */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Résumé des Permissions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {COMPANY_MODULES.filter(m => getModuleStatus(m.module)).length}
                  </div>
                  <div className="text-sm text-gray-600">Modules Activés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {COMPANY_MODULES.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedCompanyData.plan}
                  </div>
                  <div className="text-sm text-gray-600">Plan Actuel</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {permissions.updatedAt.toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-600">Dernière MAJ</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
