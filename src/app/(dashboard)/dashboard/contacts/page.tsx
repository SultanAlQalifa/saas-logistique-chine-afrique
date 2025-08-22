'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Plus, Filter, Mail, Phone, MapPin, Building, Building2, User, UserCheck, Edit, Trash2, Eye, Users, CheckCircle, AlertCircle, Clock, Download, Check, Calendar, X, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BackButton from '@/components/ui/back-button'

// Types pour les contacts
interface Contact {
  id: string
  type: 'client' | 'company' | 'agent' | 'user'
  name: string
  email: string
  phone?: string
  location?: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastActivity?: string
  avatar?: string
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    type: 'company',
    name: 'AfriTrade Solutions',
    email: 'contact@afritrade.com',
    phone: '+225 07 123 456',
    location: 'Abidjan, Côte d\'Ivoire',
    status: 'active',
    createdAt: '2024-01-15',
    lastActivity: '2024-01-20'
  },
  {
    id: '2',
    type: 'client',
    name: 'Kouassi Jean-Baptiste',
    email: 'jb.kouassi@email.com',
    phone: '+225 05 987 654',
    location: 'Bouaké, Côte d\'Ivoire',
    status: 'active',
    createdAt: '2024-01-10',
    lastActivity: '2024-01-19'
  },
  {
    id: '3',
    type: 'agent',
    name: 'Marie Diallo',
    email: 'marie.diallo@logistics.com',
    phone: '+221 77 456 789',
    location: 'Dakar, Sénégal',
    status: 'active',
    createdAt: '2024-01-08',
    lastActivity: '2024-01-20'
  },
  {
    id: '4',
    type: 'user',
    name: 'Admin System',
    email: 'admin@logistics.com',
    location: 'Système',
    status: 'active',
    createdAt: '2024-01-01',
    lastActivity: '2024-01-20'
  }
]

const contactTypeConfig = {
  client: {
    label: 'Clients',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    createLink: '/dashboard/contacts/clients/create'
  },
  company: {
    label: 'Entreprises',
    icon: Building2,
    color: 'bg-green-100 text-green-800',
    createLink: '/dashboard/contacts/companies/create'
  },
  agent: {
    label: 'Agents',
    icon: UserCheck,
    color: 'bg-purple-100 text-purple-800',
    createLink: '/dashboard/contacts/agents/create'
  },
  user: {
    label: 'Utilisateurs',
    icon: User,
    color: 'bg-orange-100 text-orange-800',
    createLink: '/dashboard/contacts/users/create'
  }
}

export default function ContactsPage() {
  const router = useRouter()
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all'])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv')
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  })

  // Gestion des segments sélectionnés
  const handleSegmentToggle = (type: string) => {
    if (type === 'all') {
      setSelectedTypes(['all'])
    } else {
      const newSelection = selectedTypes.includes('all') 
        ? [type]
        : selectedTypes.includes(type)
          ? selectedTypes.filter(t => t !== type)
          : [...selectedTypes, type]
      
      setSelectedTypes(newSelection.length === 0 ? ['all'] : newSelection)
    }
  }

  // Filtrage des contacts
  const filteredContacts = mockContacts.filter(contact => {
    const matchesType = selectedTypes.includes('all') || selectedTypes.includes(contact.type)
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    
    return matchesType && matchesSearch && matchesStatus
  })

  // Fonction d'export
  const exportContacts = (contacts: Contact[], format: 'csv' | 'excel') => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Localisation', 'Type', 'Statut', 'Date de création', 'Dernière activité']
    
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.email}"`,
        `"${contact.phone || ''}"`,
        `"${contact.location || ''}"`,
        `"${contactTypeConfig[contact.type as keyof typeof contactTypeConfig].label}"`,
        `"${contact.status === 'active' ? 'Actif' : contact.status === 'inactive' ? 'Inactif' : 'En attente'}"`,
        `"${new Date(contact.createdAt).toLocaleDateString('fr-FR')}"`,
        `"${contact.lastActivity ? new Date(contact.lastActivity).toLocaleDateString('fr-FR') : 'Jamais'}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `contacts-${new Date().toISOString().split('T')[0]}.${format}`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = () => {
    const contactsToExport = selectedTypes.includes('all') 
      ? filteredContacts 
      : filteredContacts.filter(contact => selectedTypes.includes(contact.type))
    
    exportContacts(contactsToExport, exportFormat)
    setShowExportModal(false)
  }

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setShowViewModal(true)
  }

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact)
    setEditFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      location: contact.location || '',
      status: contact.status
    })
    setShowEditModal(true)
  }

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!selectedContact) return
    
    // Simulation de la suppression avec feedback utilisateur
    alert(`✅ Contact "${selectedContact.name}" supprimé avec succès !`)
    
    // Ici on supprimerait réellement le contact de la base de données
    // await deleteContact(selectedContact.id)
    
    setShowDeleteModal(false)
    setSelectedContact(null)
  }

  const handleSaveContact = () => {
    if (!selectedContact) return
    
    // Validation simple
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert('Le nom et l\'email sont obligatoires')
      return
    }
    
    // Ici on sauvegarderait les modifications dans la base de données
    // await updateContact(selectedContact.id, editFormData)
    
    // Simulation de la mise à jour
    alert(`Contact ${editFormData.name} modifié avec succès !`)
    setShowEditModal(false)
    setSelectedContact(null)
  }

  // Statistiques par type
  const stats = Object.keys(contactTypeConfig).map(type => {
    const count = mockContacts.filter(c => c.type === type).length
    const activeCount = mockContacts.filter(c => c.type === type && c.status === 'active').length
    return {
      type,
      count,
      activeCount,
      ...contactTypeConfig[type as keyof typeof contactTypeConfig]
    }
  })

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <BackButton href="/dashboard" label="Retour au dashboard" />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestion des Contacts</h1>
          <p className="text-secondary-600 mt-1">
            Gérez tous vos contacts : clients, entreprises, agents et utilisateurs
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques par type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isSelected = selectedTypes.includes(stat.type) || selectedTypes.includes('all')
          return (
            <div key={stat.type} className="bg-white rounded-lg border border-secondary-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.count}</p>
                  <p className="text-xs text-secondary-500">
                    {stat.activeCount} actifs
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={stat.createLink}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter {stat.label.toLowerCase()}
                </Link>
                <button
                  onClick={() => handleSegmentToggle(stat.type)}
                  className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                    isSelected
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-secondary-100 text-secondary-600 border border-secondary-200'
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Filter className="h-3 w-3 mr-1" />
                  )}
                  {isSelected ? 'Sélectionné' : 'Sélectionner'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-32">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
          
          {/* Sélection de segments */}
          <div className="border-t border-secondary-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-secondary-900">Segments sélectionnés pour l'affichage et l'export</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTypes(['all'])}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    selectedTypes.includes('all')
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-secondary-100 text-secondary-600 border border-secondary-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setSelectedTypes([])}
                  className="px-3 py-1 text-xs font-medium rounded bg-secondary-100 text-secondary-600 border border-secondary-200 hover:bg-secondary-200"
                >
                  Aucun
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(contactTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                const isSelected = selectedTypes.includes(type) || selectedTypes.includes('all')
                return (
                  <button
                    key={type}
                    onClick={() => handleSegmentToggle(type)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary-100 text-primary-800 border border-primary-200'
                        : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.label}
                    {isSelected && <Check className="h-4 w-4 ml-2" />}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-secondary-500 mt-2">
              {selectedTypes.includes('all') 
                ? 'Tous les segments sont sélectionnés'
                : `${selectedTypes.length} segment(s) sélectionné(s) : ${selectedTypes.map(type => contactTypeConfig[type as keyof typeof contactTypeConfig]?.label).join(', ')}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">
            Contacts ({filteredContacts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Informations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredContacts.map((contact) => {
                const config = contactTypeConfig[contact.type]
                const Icon = config.icon
                
                return (
                  <tr key={contact.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-secondary-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-secondary-700">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-secondary-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2 text-secondary-600" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="space-y-1">
                        {contact.phone && (
                          <div className="flex items-center text-secondary-600">
                            <Phone className="h-4 w-4 mr-1" />
                            {contact.phone}
                          </div>
                        )}
                        {contact.location && (
                          <div className="flex items-center text-secondary-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {contact.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.status === 'active' ? 'bg-green-100 text-green-800' :
                        contact.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.status === 'active' ? 'Actif' :
                         contact.status === 'inactive' ? 'Inactif' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {contact.lastActivity ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(contact.lastActivity).toLocaleDateString('fr-FR')}
                        </div>
                      ) : (
                        'Jamais'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewContact(contact)}
                          className="text-secondary-400 hover:text-secondary-600 p-1 rounded hover:bg-secondary-100"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditContact(contact)}
                          className="text-secondary-400 hover:text-secondary-600 p-1 rounded hover:bg-secondary-100"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContact(contact)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucun contact trouvé</h3>
            <p className="mt-1 text-sm text-secondary-500">
              Aucun contact ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Modal d'export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-secondary-900">Exporter les contacts</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Segments à exporter
                </label>
                <div className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md">
                  {selectedTypes.includes('all') 
                    ? `Tous les contacts (${filteredContacts.length})`
                    : `Segments sélectionnés : ${selectedTypes.map(type => contactTypeConfig[type as keyof typeof contactTypeConfig]?.label).join(', ')} (${filteredContacts.filter(c => selectedTypes.includes(c.type)).length} contacts)`
                  }
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Format d'export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
                      className="mr-2"
                    />
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV (Compatible Excel)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
                      className="mr-2"
                    />
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel (.xlsx)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
                👁️ Détails du Contact
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-secondary-400 hover:text-secondary-600 p-1 rounded hover:bg-secondary-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-secondary-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary-700">
                    {selectedContact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900">{selectedContact.name}</h4>
                  <p className="text-sm text-secondary-600 flex items-center">
                    {contactTypeConfig[selectedContact.type].icon && (
                      <span className="h-4 w-4 mr-1 flex items-center justify-center">
                        {React.createElement(contactTypeConfig[selectedContact.type].icon, { className: "h-4 w-4" })}
                      </span>
                    )}
                    {contactTypeConfig[selectedContact.type].label}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-secondary-600 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="font-medium text-secondary-900">{selectedContact.email}</p>
                </div>
                
                {selectedContact.phone && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-secondary-600 mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Téléphone
                    </div>
                    <p className="font-medium text-secondary-900">{selectedContact.phone}</p>
                  </div>
                )}
                
                {selectedContact.location && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-secondary-600 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Localisation
                    </div>
                    <p className="font-medium text-secondary-900">{selectedContact.location}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-secondary-600 mb-1">Statut</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedContact.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedContact.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedContact.status === 'active' ? 'Actif' :
                       selectedContact.status === 'inactive' ? 'Inactif' : 'En attente'}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-secondary-600 mb-1">Créé le</div>
                    <p className="font-medium text-secondary-900">
                      {new Date(selectedContact.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                {selectedContact.lastActivity && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-secondary-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dernière activité
                    </div>
                    <p className="font-medium text-secondary-900">
                      {new Date(selectedContact.lastActivity).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEditContact(selectedContact)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
                ✏️ Modifier le Contact
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-secondary-400 hover:text-secondary-600 p-1 rounded hover:bg-secondary-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveContact(); }} className="space-y-6">
              {/* Informations de base */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <h4 className="font-medium text-secondary-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations personnelles
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nom et prénom"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Informations de contact */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
                <h4 className="font-medium text-secondary-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact & Localisation
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+225 XX XX XX XX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ville, Pays"
                    />
                  </div>
                </div>
              </div>
              
              {/* Statut */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <h4 className="font-medium text-secondary-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Statut du contact
                </h4>
                
                <div className="space-y-2">
                  {[
                    { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
                    { value: 'inactive', label: 'Inactif', color: 'bg-red-100 text-red-800' },
                    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' }
                  ].map((status) => (
                    <label key={status.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={editFormData.status === status.value}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' | 'pending' })}
                        className="mr-3"
                      />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Informations sur le type */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${contactTypeConfig[selectedContact.type].color}`}>
                    {React.createElement(contactTypeConfig[selectedContact.type].icon, { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">
                      Type : {contactTypeConfig[selectedContact.type].label}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      Le type de contact ne peut pas être modifié
                    </p>
                  </div>
                </div>
              </div>
            </form>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-secondary-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  handleViewContact(selectedContact)
                }}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 border border-secondary-300 rounded-md hover:bg-secondary-200 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </button>
              <button
                onClick={handleSaveContact}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-red-900 flex items-center">
                🗑️ Supprimer le Contact
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-secondary-400 hover:text-secondary-600 p-1 rounded hover:bg-secondary-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Trash2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-red-900 mb-2">⚠️ Confirmation de suppression</h4>
                  <p className="text-sm text-red-800 mb-3">
                    Êtes-vous sûr de vouloir supprimer le contact <strong>{selectedContact.name}</strong> ?
                  </p>
                  <div className="text-xs text-red-700 space-y-1">
                    <p>• Cette action est irréversible</p>
                    <p>• Toutes les données associées seront perdues</p>
                    <p>• L'historique des interactions sera supprimé</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de contact */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-secondary-900">Nouveau contact</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-secondary-600 mb-4">
                Choisissez le type de contact à créer :
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(contactTypeConfig).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <Link
                      key={type}
                      href={config.createLink}
                      onClick={() => setShowCreateModal(false)}
                      className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-lg ${config.color} mb-2 group-hover:scale-105 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-secondary-900">{config.label}</p>
                        <p className="text-xs text-secondary-500 mt-1">Créer {config.label.toLowerCase()}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
