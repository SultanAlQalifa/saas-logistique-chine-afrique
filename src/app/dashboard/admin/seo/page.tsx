'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Globe, 
  BarChart3, 
  Settings, 
  Eye, 
  Edit, 
  Save, 
  RefreshCw,
  TrendingUp,
  Users,
  MousePointer,
  Clock
} from 'lucide-react'

interface SEOPage {
  id: string
  path: string
  title: string
  description: string
  keywords: string[]
  metaTitle: string
  metaDescription: string
  ogImage: string
  canonical: string
  indexed: boolean
  lastModified: string
  priority: number
  changeFreq: string
}

interface SEOMetrics {
  totalPages: number
  indexedPages: number
  avgLoadTime: number
  mobileScore: number
  desktopScore: number
  organicTraffic: number
  avgPosition: number
  clickThroughRate: number
}

export default function SEOManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingPage, setEditingPage] = useState<string | null>(null)

  // Mock data
  const seoMetrics: SEOMetrics = {
    totalPages: 45,
    indexedPages: 42,
    avgLoadTime: 1.2,
    mobileScore: 95,
    desktopScore: 98,
    organicTraffic: 15420,
    avgPosition: 12.5,
    clickThroughRate: 3.8
  }

  const seoPages: SEOPage[] = [
    {
      id: '1',
      path: '/',
      title: 'Accueil',
      description: 'Page d\'accueil NextMove Cargo',
      keywords: ['logistique', 'chine afrique', 'cargo'],
      metaTitle: 'NextMove Cargo - Logistique Chine-Afrique',
      metaDescription: 'Solution logistique complète pour vos expéditions entre la Chine et l\'Afrique. Maritime, aérien, suivi temps réel.',
      ogImage: '/images/og-home.jpg',
      canonical: 'https://nextmove-cargo.com/',
      indexed: true,
      lastModified: '2024-01-20',
      priority: 1.0,
      changeFreq: 'daily'
    },
    {
      id: '2',
      path: '/pricing',
      title: 'Tarification',
      description: 'Calculateur de prix pour expéditions',
      keywords: ['tarif', 'prix', 'calculateur'],
      metaTitle: 'Tarification - NextMove Cargo',
      metaDescription: 'Calculez vos coûts d\'expédition entre la Chine et l\'Afrique. Tarifs transparents maritime et aérien.',
      ogImage: '/images/og-pricing.jpg',
      canonical: 'https://nextmove-cargo.com/pricing',
      indexed: true,
      lastModified: '2024-01-18',
      priority: 0.9,
      changeFreq: 'weekly'
    },
    {
      id: '3',
      path: '/services',
      title: 'Services',
      description: 'Nos services logistiques',
      keywords: ['services', 'logistique', 'transport'],
      metaTitle: 'Services Logistiques - NextMove Cargo',
      metaDescription: 'Services complets : expédition maritime, aérienne, dédouanement, assurance et POD électronique.',
      ogImage: '/images/og-services.jpg',
      canonical: 'https://nextmove-cargo.com/services',
      indexed: true,
      lastModified: '2024-01-15',
      priority: 0.8,
      changeFreq: 'weekly'
    }
  ]

  const handleSavePage = (pageId: string) => {
    // Logique de sauvegarde
    setEditingPage(null)
    // Ici on ferait un appel API pour sauvegarder
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Search className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">🔍 Gestion SEO</h1>
              <p className="text-blue-100 text-lg">
                Optimisez le référencement de NextMove Cargo
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">Pages Indexées</span>
              </div>
              <div className="text-2xl font-bold">{seoMetrics.indexedPages}/{seoMetrics.totalPages}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Trafic Organique</span>
              </div>
              <div className="text-2xl font-bold">{seoMetrics.organicTraffic.toLocaleString()}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium">Position Moyenne</span>
              </div>
              <div className="text-2xl font-bold">{seoMetrics.avgPosition}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-5 w-5" />
                <span className="text-sm font-medium">CTR Moyen</span>
              </div>
              <div className="text-2xl font-bold">{seoMetrics.clickThroughRate}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="pages">Gestion Pages</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Score de Performance */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <BarChart3 className="h-5 w-5" />
                    Performance Globale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mobile</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        {seoMetrics.mobileScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Desktop</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        {seoMetrics.desktopScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temps de Chargement</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        {seoMetrics.avgLoadTime}s
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Indexation */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Globe className="h-5 w-5" />
                    Indexation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700 mb-2">
                        {Math.round((seoMetrics.indexedPages / seoMetrics.totalPages) * 100)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {seoMetrics.indexedPages} pages sur {seoMetrics.totalPages} indexées
                      </p>
                    </div>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réindexer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trafic */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Users className="h-5 w-5" />
                    Trafic Organique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700 mb-2">
                        {seoMetrics.organicTraffic.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">visiteurs ce mois</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">+15.3% vs mois dernier</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Pages</CardTitle>
                <CardDescription>
                  Gérez les métadonnées SEO de chaque page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoPages.map((page) => (
                    <div key={page.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant={page.indexed ? "default" : "secondary"}>
                            {page.indexed ? "Indexée" : "Non indexée"}
                          </Badge>
                          <span className="font-medium">{page.path}</span>
                          <span className="text-sm text-gray-500">
                            Priorité: {page.priority}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPage(page.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingPage === page.id ? (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="metaTitle">Titre Meta</Label>
                              <Input
                                id="metaTitle"
                                defaultValue={page.metaTitle}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="canonical">URL Canonique</Label>
                              <Input
                                id="canonical"
                                defaultValue={page.canonical}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="metaDescription">Description Meta</Label>
                            <Textarea
                              id="metaDescription"
                              defaultValue={page.metaDescription}
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
                            <Input
                              id="keywords"
                              defaultValue={page.keywords.join(', ')}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button onClick={() => handleSavePage(page.id)}>
                              <Save className="h-4 w-4 mr-2" />
                              Sauvegarder
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingPage(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Titre:</span> {page.metaTitle}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span> {page.metaDescription}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="font-medium">Mots-clés:</span>
                            {page.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des Performances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Pages avec erreurs 404</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Pages sans meta description</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Images sans alt text</span>
                      <Badge variant="secondary">5</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Liens internes cassés</span>
                      <Badge variant="destructive">1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">
                        Optimiser les images
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Compresser les images pour améliorer la vitesse
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Ajouter des données structurées
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Améliorer l'affichage dans les résultats de recherche
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Excellent score mobile
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Votre site est bien optimisé pour mobile
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres SEO Globaux</CardTitle>
                <CardDescription>
                  Configuration générale du référencement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gaId">Google Analytics ID</Label>
                    <Input
                      id="gaId"
                      placeholder="G-XXXXXXXXXX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gscId">Google Search Console</Label>
                    <Input
                      id="gscId"
                      placeholder="Code de vérification"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bingId">Bing Webmaster Tools</Label>
                    <Input
                      id="bingId"
                      placeholder="Code de vérification"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">URL du Site</Label>
                    <Input
                      id="siteUrl"
                      defaultValue="https://nextmove-cargo.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="defaultDescription">Description par Défaut</Label>
                  <Textarea
                    id="defaultDescription"
                    defaultValue="Solution SaaS complète pour la logistique entre la Chine et l'Afrique. Expédition maritime, aérienne, suivi en temps réel, POD électronique."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <Button className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les Paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
