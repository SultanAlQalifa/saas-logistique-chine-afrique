'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image,
  Link as LinkIcon,
  Target,
  Calendar,
  BarChart3,
  Save,
  X,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/ui/back-button';

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  isActive: boolean;
  priority: number;
  targetAudience: 'all' | 'clients' | 'enterprises' | 'admins';
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

export default function BannerConfigPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'sidebar' as Banner['position'],
    targetAudience: 'all' as Banner['targetAudience'],
    startDate: '',
    endDate: '',
    priority: 1
  });

  // Mock data
  useEffect(() => {
    const mockBanners: Banner[] = [
      {
        id: '1',
        title: 'Formation Logistique Gratuite',
        description: 'Apprenez les bases de la logistique internationale',
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        linkUrl: '/formation',
        position: 'sidebar',
        isActive: true,
        priority: 1,
        targetAudience: 'all',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        impressions: 15420,
        clicks: 892,
        ctr: 5.8
      },
      {
        id: '2',
        title: 'Promotion Maritime -20%',
        description: 'Réduction sur tous les envois maritimes',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        linkUrl: '/promo-maritime',
        position: 'top',
        isActive: true,
        priority: 2,
        targetAudience: 'clients',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        impressions: 8750,
        clicks: 445,
        ctr: 5.1
      },
      {
        id: '3',
        title: 'Nouveau Service Express',
        description: 'Livraison express en 5 jours',
        imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400',
        linkUrl: '/express',
        position: 'middle',
        isActive: false,
        priority: 3,
        targetAudience: 'enterprises',
        startDate: '2024-02-01',
        endDate: '2024-03-01',
        impressions: 3200,
        clicks: 128,
        ctr: 4.0
      }
    ];
    setBanners(mockBanners);
  }, []);

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'sidebar',
      targetAudience: 'all',
      startDate: '',
      endDate: '',
      priority: 1
    });
    setShowModal(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      targetAudience: banner.targetAudience,
      startDate: banner.startDate,
      endDate: banner.endDate,
      priority: banner.priority
    });
    setShowModal(true);
  };

  const handleSaveBanner = () => {
    if (editingBanner) {
      // Update existing banner
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...formData }
          : banner
      ));
      alert('✅ Bannière mise à jour avec succès !');
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        impressions: 0,
        clicks: 0,
        ctr: 0
      };
      setBanners(prev => [...prev, newBanner]);
      alert('✅ Nouvelle bannière créée avec succès !');
    }
    setShowModal(false);
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      setBanners(prev => prev.filter(banner => banner.id !== bannerId));
      alert('🗑️ Bannière supprimée avec succès !');
    }
  };

  const toggleBannerStatus = (bannerId: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ));
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'top': return 'Haut de page';
      case 'middle': return 'Milieu de page';
      case 'bottom': return 'Bas de page';
      case 'sidebar': return 'Barre latérale';
      default: return position;
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all': return 'Tous';
      case 'clients': return 'Clients';
      case 'enterprises': return 'Entreprises';
      case 'admins': return 'Administrateurs';
      default: return audience;
    }
  };

  return (
    <div className="space-y-8">
      {/* Bouton retour */}
      <BackButton href="/dashboard" label="Retour au dashboard" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Configuration des Bannières 🎯</h1>
            <p className="text-orange-100 mt-2">
              Gérez les bannières publicitaires de votre plateforme
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                <Image className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-blue-600 font-medium">Total Bannières</p>
                <p className="text-2xl font-bold text-blue-800">{banners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-green-600 font-medium">Actives</p>
                <p className="text-2xl font-bold text-green-800">{banners.filter(b => b.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-purple-600 font-medium">Impressions</p>
                <p className="text-2xl font-bold text-purple-800">
                  {banners.reduce((sum, b) => sum + b.impressions, 0).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-orange-600 font-medium">CTR Moyen</p>
                <p className="text-2xl font-bold text-orange-800">
                  {(banners.reduce((sum, b) => sum + b.ctr, 0) / banners.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Bannières</h2>
        <Button 
          onClick={handleCreateBanner}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Bannière
        </Button>
      </div>

      {/* Banners List */}
      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Banner Image */}
                <div className="lg:w-48 flex-shrink-0">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-full h-32 lg:h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Banner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{banner.title}</h3>
                        <Badge className={`${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} border-0`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{banner.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {getPositionLabel(banner.position)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {getAudienceLabel(banner.targetAudience)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(banner.startDate).toLocaleDateString('fr-FR')} - {new Date(banner.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Impressions</p>
                        <p className="text-lg font-bold text-blue-600">{banner.impressions.toLocaleString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Clics</p>
                        <p className="text-lg font-bold text-green-600">{banner.clicks.toLocaleString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CTR</p>
                        <p className="text-lg font-bold text-purple-600">{banner.ctr}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleBannerStatus(banner.id)}
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    >
                      {banner.isActive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {banner.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditBanner(banner)}
                      className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingBanner ? 'Modifier la Bannière' : 'Nouvelle Bannière'}
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la bannière"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as Banner['position'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="top">Haut de page</option>
                    <option value="middle">Milieu de page</option>
                    <option value="bottom">Bas de page</option>
                    <option value="sidebar">Barre latérale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la bannière"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image *
                  </label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de destination
                  </label>
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="/page-destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience cible
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as Banner['targetAudience'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="clients">Clients</option>
                    <option value="enterprises">Entreprises</option>
                    <option value="admins">Administrateurs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité (1-10)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button 
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveBanner}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingBanner ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
