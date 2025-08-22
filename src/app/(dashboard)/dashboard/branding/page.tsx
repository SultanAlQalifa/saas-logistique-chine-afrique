'use client'

import { useState, useMemo, useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import VisualFileUpload from '@/components/ui/visual-file-upload';
import { 
  Palette, 
  Image, 
  Globe, 
  Mail, 
  Share2, 
  Settings, 
  Save, 
  RotateCcw,
  Upload,
  Eye,
  FileText,
  Check,
  X,
  Loader2,
  Type,
  Link2
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
})

import 'react-quill/dist/quill.snow.css';

export default function BrandingPage() {
  const { branding, updateBranding, saveBranding, resetToDefault, isLoading } = useBranding();
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Identité', icon: Palette },
    { id: 'visuals', label: 'Visuels', icon: Image },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'domain', label: 'Domaine', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
    { id: 'advanced', label: 'Avancé', icon: Settings }
  ];
  
  // State for pages tab
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPage, setIsSavingPage] = useState(false);

  const handleSave = async () => {
    try {
      await saveBranding();
      alert('Branding sauvegardé avec succès !');
      alert('Branding sauvegardé avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      resetToDefault()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Branding</h1>
          <p className="text-gray-600">Personnalisez l'identité visuelle et les informations de votre plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation des onglets */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
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
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            
            {/* Onglet Identité */}
            {activeTab === 'identity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Identité de la plateforme</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la plateforme
                    </label>
                    <input
                      type="text"
                      value={branding.platformName}
                      onChange={(e) => updateBranding({ platformName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slogan
                    </label>
                    <input
                      type="text"
                      value={branding.tagline}
                      onChange={(e) => updateBranding({ tagline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={branding.description}
                    onChange={(e) => updateBranding({ description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Couleurs */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Couleurs du thème</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(branding.colors).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => updateBranding({
                              colors: { ...branding.colors, [key]: e.target.value }
                            })}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateBranding({
                              colors: { ...branding.colors, [key]: e.target.value }
                            })}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Visuels */}
            {activeTab === 'visuals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Éléments visuels</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(branding.logo).map(([key, value]) => (
                    <VisualFileUpload
                      key={key}
                      label={key === 'appleTouchIcon' ? 'Apple Touch Icon' : key}
                      value={value}
                      onChange={(newValue) => updateBranding({
                        logo: { ...branding.logo, [key]: newValue }
                      })}
                      accept={key === 'favicon' ? '.ico,.png,.svg' : '.png,.jpg,.jpeg,.svg,.webp'}
                      maxSize={key === 'favicon' ? 1 : 5} // 1MB pour favicon, 5MB pour autres
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Domaine */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Configuration des domaines</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(branding.domain).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key === 'main' ? 'Domaine principal' : 
                         key === 'api' ? 'API' :
                         key === 'cdn' ? 'CDN' : 'Support'}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateBranding({
                          domain: { ...branding.domain, [key]: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={branding.contact.email}
                      onChange={(e) => updateBranding({
                        contact: { ...branding.contact, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={branding.contact.phone}
                      onChange={(e) => updateBranding({
                        contact: { ...branding.contact, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Adresse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={branding.contact.address.street}
                        onChange={(e) => updateBranding({
                          contact: { 
                            ...branding.contact, 
                            address: { ...branding.contact.address, street: e.target.value }
                          }
                        })}
                        placeholder="Rue"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <input
                      type="text"
                      value={branding.contact.address.city}
                      onChange={(e) => updateBranding({
                        contact: { 
                          ...branding.contact, 
                          address: { ...branding.contact.address, city: e.target.value }
                        }
                      })}
                      placeholder="Ville"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <input
                      type="text"
                      value={branding.contact.address.country}
                      onChange={(e) => updateBranding({
                        contact: { 
                          ...branding.contact, 
                          address: { ...branding.contact.address, country: e.target.value }
                        }
                      })}
                      placeholder="Pays"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Réseaux Sociaux */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Réseaux sociaux</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(branding.socialMedia).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key}
                      </label>
                      <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => updateBranding({
                          socialMedia: { ...branding.socialMedia, [key]: e.target.value }
                        })}
                        placeholder={`https://${key}.com/votre-page`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Pages */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-2xl font-bold">Gestion des pages</h3>
                      <p className="text-blue-100">Personnalisez le contenu et le référencement de vos pages</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar with page list */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <span className="bg-blue-100 p-1.5 rounded-lg mr-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </span>
                        Pages du site
                      </h4>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(branding.pages).map(([key, page]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedPage(key)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                              selectedPage === key
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                            }`}
                          >
                            <span className="truncate">{page.title}</span>
                            {page.isActive ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                <X className="h-3 w-3 mr-1" />
                                Inactif
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Page editor */}
                  <div className="lg:col-span-3 space-y-6">
                    {selectedPage && branding.pages[selectedPage] && (
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <span className="bg-blue-50 p-1 rounded-md mr-2">
                                <Type className="h-4 w-4 text-blue-600" />
                              </span>
                              Titre de la page
                            </label>
                            <input
                              type="text"
                              value={branding.pages[selectedPage].title}
                              onChange={(e) => updateBranding({
                                pages: {
                                  ...branding.pages,
                                  [selectedPage]: {
                                    ...branding.pages[selectedPage],
                                    title: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:shadow-md"
                              placeholder="Entrez le titre de la page"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <span className="bg-blue-50 p-1 rounded-md mr-2">
                                <Link2 className="h-4 w-4 text-blue-600" />
                              </span>
                              URL personnalisée
                            </label>
                            <div className="flex rounded-xl shadow-sm overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                              <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 text-sm font-medium">
                                {typeof window !== 'undefined' ? window.location.origin : ''}/
                              </span>
                              <input
                                type="text"
                                value={branding.pages[selectedPage].slug}
                                onChange={(e) => updateBranding({
                                  pages: {
                                    ...branding.pages,
                                    [selectedPage]: {
                                      ...branding.pages[selectedPage],
                                      slug: e.target.value
                                    }
                                  }
                                })}
                                className="flex-1 min-w-0 block w-full px-4 py-2.5 focus:outline-none bg-white"
                                placeholder="url-personnalisee"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <span className="text-gray-400 mr-1">#</span>
                                Titre SEO
                                <span className="text-xs text-gray-400 ml-2">
                                  {branding.pages[selectedPage].seoTitle?.length || 0}/70 caractères
                                </span>
                              </label>
                              <input
                                type="text"
                                value={branding.pages[selectedPage].seoTitle || ''}
                                onChange={(e) => updateBranding({
                                  pages: {
                                    ...branding.pages,
                                    [selectedPage]: {
                                      ...branding.pages[selectedPage],
                                      seoTitle: e.target.value
                                    }
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          
                            <div className="flex items-end">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={branding.pages[selectedPage].isActive}
                                  onChange={(e) => updateBranding({
                                    pages: {
                                      ...branding.pages,
                                      [selectedPage]: {
                                        ...branding.pages[selectedPage],
                                        isActive: e.target.checked
                                      }
                                    }
                                  })}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">Page active</span>
                              </label>
                            </div>
                        </div>
                        
                        <div className="mt-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <span className="text-gray-400 mr-1">#</span>
                            Meta description
                            <span className="text-xs text-gray-400 ml-2">
                              {branding.pages[selectedPage].seoDescription?.length || 0}/160 caractères
                            </span>
                          </label>
                          <textarea
                            value={branding.pages[selectedPage].seoDescription || ''}
                            onChange={(e) => updateBranding({
                              pages: {
                                ...branding.pages,
                                [selectedPage]: {
                                  ...branding.pages[selectedPage],
                                  seoDescription: e.target.value
                                }
                              }
                            })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="mt-8">
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                              <span className="bg-blue-50 p-1 rounded-md mr-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </span>
                              Contenu de la page
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {branding.pages[selectedPage].content?.length || 0} caractères
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 mt-8 border-t border-gray-100">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                  type="checkbox" 
                                  id="page-active-toggle"
                                  checked={branding.pages[selectedPage].isActive}
                                  onChange={(e) => updateBranding({
                                    pages: {
                                      ...branding.pages,
                                      [selectedPage]: {
                                        ...branding.pages[selectedPage],
                                        isActive: e.target.checked
                                      }
                                    }
                                  })}
                                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                />
                                <label 
                                  htmlFor="page-active-toggle" 
                                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${branding.pages[selectedPage].isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'}`}
                                ></label>
                              </div>
                              <label htmlFor="page-active-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                                {branding.pages[selectedPage].isActive ? (
                                  <span className="text-green-600 font-medium">Page active</span>
                                ) : (
                                  <span className="text-gray-500">Page désactivée</span>
                                )}
                                <p className="text-xs text-gray-500 font-normal">
                                  {branding.pages[selectedPage].isActive 
                                    ? 'Cette page est visible publiquement' 
                                    : 'Cette page est actuellement masquée'}
                                </p>
                              </label>
                            </div>
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Enregistrement...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  Enregistrer les modifications
                                </>
                              )}
                            </button>
                          </div>
                          <ReactQuill
                            theme="snow"
                            value={branding.pages[selectedPage].content}
                            onChange={(content) => updateBranding({
                              pages: {
                                ...branding.pages,
                                [selectedPage]: {
                                  ...branding.pages[selectedPage],
                                  content
                                }
                              }
                            })}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                              ]
                            }}
                            className="h-96"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Onglet Avancé */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Paramètres avancés</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={branding.advanced.googleAnalyticsId || ''}
                      onChange={(e) => updateBranding({
                        advanced: { ...branding.advanced, googleAnalyticsId: e.target.value }
                      })}
                      placeholder="GA-XXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={branding.advanced.facebookPixelId || ''}
                      onChange={(e) => updateBranding({
                        advanced: { ...branding.advanced, facebookPixelId: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS personnalisé
                  </label>
                  <textarea
                    value={branding.advanced.customCss || ''}
                    onChange={(e) => updateBranding({
                      advanced: { ...branding.advanced, customCss: e.target.value }
                    })}
                    rows={6}
                    placeholder="/* Votre CSS personnalisé ici */"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
