'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Save, Camera, Lock, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff, Settings, Building2, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { countries, searchCountries, getCountriesByContinent } from '@/lib/countries'
import { currencies, searchCurrencies } from '@/lib/currencies'

export default function ProfileSettingsPage() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'CLIENT'
  const [profile, setProfile] = useState({
    // Informations personnelles
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@gmail.com',
    phone: '+221 77 456 78 90',
    address: '25 Rue Carnot, Dakar',
    birthDate: '1992-03-22',
    position: 'Importatrice',
    department: 'Commerce International',
    
    // Préférences
    language: 'fr',
    timezone: 'Africa/Dakar',
    dateFormat: 'DD/MM/YYYY',
    currency: 'XOF',
    
    // Notifications personnelles
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
    
    // Sécurité
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-15',
  })

  const [companyInfo, setCompanyInfo] = useState({
    // Informations entreprise
    companyName: 'Diallo Import & Export',
    companyType: 'EURL',
    registrationNumber: 'SN-2021-C-67890',
    taxNumber: 'TIN-987654321',
    website: 'www.diallo-import.com',
    industry: 'Import/Export de Produits Électroniques',
    foundedYear: '2021',
    employeeCount: '1-10',
    
    // Adresse entreprise
    companyAddress: '25 Rue Carnot, Plateau',
    companyCity: 'Dakar',
    companyCountry: 'Sénégal',
    companyPostalCode: '11000',
    
    // Contact entreprise
    companyPhone: '+221 77 456 78 90',
    companyEmail: 'contact@diallo-import.com',
    companyFax: '',
    
    // Description
    companyDescription: 'Entreprise spécialisée dans l\'importation d\'équipements électroniques et informatiques depuis la Chine. Nous offrons des solutions d\'approvisionnement pour les particuliers et petites entreprises au Sénégal.',
    
    // Réseaux sociaux
    socialMedia: {
      website: 'www.diallo-import.com',
      facebook: 'https://facebook.com/diallo-import',
      twitter: '',
      instagram: 'https://instagram.com/diallo_import',
      linkedin: '',
      youtube: ''
    },
    
    // Pays d'exercice
    operatingCountries: ['SN', 'CN']
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [activeTab, setActiveTab] = useState('profile')

  const handleSave = () => {
    // Validation des champs obligatoires
    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.email.trim()) {
      alert('⚠️ Le prénom, nom et email sont obligatoires')
      return
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profile.email)) {
      alert('⚠️ Veuillez saisir un email valide')
      return
    }
    
    // Simulation de la sauvegarde
    alert('✅ Profil mis à jour avec succès!')
    // await updateProfile(profile)
  }

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Les mots de passe ne correspondent pas!')
      return
    }
    if (passwords.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères!')
      return
    }
    // Simulation de la mise à jour du mot de passe
    alert('✅ Mot de passe mis à jour avec succès!')
    // await updatePassword(passwords.currentPassword, passwords.newPassword)
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompanyInputChange = (field: string, value: any) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  const handleSaveCompany = () => {
    // Validation des champs obligatoires
    if (!companyInfo.companyName.trim() || !companyInfo.companyEmail.trim()) {
      alert('⚠️ Le nom de l\'entreprise et l\'email sont obligatoires')
      return
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(companyInfo.companyEmail)) {
      alert('⚠️ Veuillez saisir un email valide')
      return
    }
    
    // Simulation de la sauvegarde
    alert('✅ Informations entreprise mises à jour avec succès!')
    // await updateCompanyInfo(companyInfo)
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const handleCountryToggle = (countryCode: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      operatingCountries: prev.operatingCountries.includes(countryCode)
        ? prev.operatingCountries.filter(code => code !== countryCode)
        : [...prev.operatingCountries, countryCode]
    }))
  }

  const filteredCountries = countrySearch 
    ? searchCountries(countrySearch)
    : countries

  const getSelectedCountries = () => {
    return countries.filter(country => companyInfo.operatingCountries.includes(country.code))
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    ...(userRole !== 'CLIENT' ? [{ id: 'company', label: 'Entreprise', icon: Building2 }] : []),
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo de profil */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Photo de profil</h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Cliquez sur l'icône pour changer votre photo
              </p>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poste
                </label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Changement de mot de passe */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handlePasswordChange}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
              >
                Changer le mot de passe
              </button>
            </div>
          </div>

          {/* Paramètres de sécurité */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sécurité du compte</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Authentification à deux facteurs</span>
                  <p className="text-xs text-gray-500">Sécurisez votre compte avec un code supplémentaire</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.twoFactorEnabled}
                  onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              
              <div className="border-t pt-4">
                <span className="text-sm font-medium text-gray-700">Dernière modification du mot de passe</span>
                <p className="text-sm text-gray-500">{new Date(profile.lastPasswordChange).toLocaleDateString('fr-FR')}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sessions actives</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Session actuelle</p>
                      <p className="text-xs text-gray-500">Chrome sur Windows • Dakar, Sénégal</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Actif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="space-y-6">
          {/* Informations générales de l'entreprise */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🏢 Informations Entreprise</h2>
                <p className="text-gray-600">Gérez les informations de votre entreprise</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleSaveCompany}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Informations de base</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    value={companyInfo.companyName}
                    onChange={(e) => handleCompanyInputChange('companyName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'entreprise
                  </label>
                  <select
                    value={companyInfo.companyType}
                    onChange={(e) => handleCompanyInputChange('companyType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SARL">SARL</option>
                    <option value="SA">SA</option>
                    <option value="SAS">SAS</option>
                    <option value="EURL">EURL</option>
                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro d'enregistrement
                  </label>
                  <input
                    type="text"
                    value={companyInfo.registrationNumber}
                    onChange={(e) => handleCompanyInputChange('registrationNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro fiscal
                  </label>
                  <input
                    type="text"
                    value={companyInfo.taxNumber}
                    onChange={(e) => handleCompanyInputChange('taxNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={companyInfo.website}
                    onChange={(e) => handleCompanyInputChange('website', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secteur d'activité
                  </label>
                  <input
                    type="text"
                    value={companyInfo.industry}
                    onChange={(e) => handleCompanyInputChange('industry', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Détails supplémentaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🏭 Détails entreprise</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année de création
                  </label>
                  <input
                    type="text"
                    value={companyInfo.foundedYear}
                    onChange={(e) => handleCompanyInputChange('foundedYear', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'employés
                  </label>
                  <select
                    value={companyInfo.employeeCount}
                    onChange={(e) => handleCompanyInputChange('employeeCount', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1-10">1-10 employés</option>
                    <option value="11-25">11-25 employés</option>
                    <option value="25-50">25-50 employés</option>
                    <option value="51-100">51-100 employés</option>
                    <option value="100+">100+ employés</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de l'entreprise
                  </label>
                  <textarea
                    rows={4}
                    value={companyInfo.companyDescription}
                    onChange={(e) => handleCompanyInputChange('companyDescription', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre entreprise, ses activités principales..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Adresse et Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adresse */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">📍 Adresse entreprise</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    value={companyInfo.companyAddress}
                    onChange={(e) => handleCompanyInputChange('companyAddress', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={companyInfo.companyCity}
                    onChange={(e) => handleCompanyInputChange('companyCity', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={companyInfo.companyCountry}
                    onChange={(e) => handleCompanyInputChange('companyCountry', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={companyInfo.companyPostalCode}
                    onChange={(e) => handleCompanyInputChange('companyPostalCode', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">📞 Contact entreprise</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone principal *
                  </label>
                  <input
                    type="tel"
                    value={companyInfo.companyPhone}
                    onChange={(e) => handleCompanyInputChange('companyPhone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email entreprise *
                  </label>
                  <input
                    type="email"
                    value={companyInfo.companyEmail}
                    onChange={(e) => handleCompanyInputChange('companyEmail', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fax (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={companyInfo.companyFax}
                    onChange={(e) => handleCompanyInputChange('companyFax', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">🌐 Réseaux sociaux</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Globe className="h-4 w-4" />
                  Site web
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.website}
                  onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://www.votre-site.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.facebook}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://facebook.com/votre-page"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://twitter.com/votre-compte"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://instagram.com/votre-compte"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.linkedin}
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://linkedin.com/company/votre-entreprise"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube
                </label>
                <input
                  type="url"
                  value={companyInfo.socialMedia.youtube}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://youtube.com/c/votre-chaine"
                />
              </div>
            </div>
          </div>

          {/* Pays d'exercice */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">🌍 Pays d'exercice</h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sélectionnez les pays dans lesquels votre entreprise opère
              </p>

              {/* Pays sélectionnés */}
              {getSelectedCountries().length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Pays sélectionnés ({getSelectedCountries().length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedCountries().map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                        <button
                          onClick={() => handleCountryToggle(country.code)}
                          className="ml-1 text-teal-600 hover:text-teal-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recherche et sélection */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un pays..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          handleCountryToggle(country.code)
                          setCountrySearch('')
                          setShowCountryDropdown(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 ${
                          companyInfo.operatingCountries.includes(country.code)
                            ? 'bg-teal-50 text-teal-800'
                            : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{country.name}</div>
                          <div className="text-xs text-gray-500">
                            {country.dialCode} • {country.currency} • {country.continent}
                          </div>
                        </div>
                        {companyInfo.operatingCountries.includes(country.code) && (
                          <span className="text-teal-600 font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fermer le dropdown en cliquant ailleurs */}
              {showCountryDropdown && (
                <div
                  className="fixed inset-0 z-5"
                  onClick={() => setShowCountryDropdown(false)}
                />
              )}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Préférences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Préférences régionales */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Paramètres régionaux</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langue
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuseau horaire
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Africa/Dakar">Afrique/Dakar</option>
                    <option value="Africa/Abidjan">Afrique/Abidjan</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format de date
                  </label>
                  <select
                    value={profile.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise préférée
                  </label>
                  <select
                    value={profile.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.code}) - {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Préférences de notification */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notifications par email</span>
                    <p className="text-xs text-gray-500">Recevez des mises à jour par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notifications SMS</span>
                    <p className="text-xs text-gray-500">Recevez des alertes par SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.smsNotifications}
                    onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Emails marketing</span>
                    <p className="text-xs text-gray-500">Recevez nos offres et actualités</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
