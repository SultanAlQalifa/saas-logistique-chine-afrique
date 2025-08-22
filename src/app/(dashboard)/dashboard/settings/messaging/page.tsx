'use client'

import { useState } from 'react'
import { Mail, MessageSquare, MessageCircle, Save, Loader2, Check } from 'lucide-react'

export default function MessagingSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // États pour la configuration email
  const [emailConfig, setEmailConfig] = useState({
    host: '',
    port: 587,
    username: '',
    password: '',
    from: '',
    encryption: 'tls',
    enabled: true
  })

  // États pour la configuration SMS
  const [smsConfig, setSmsConfig] = useState({
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    fromNumber: '',
    enabled: true
  })

  // États pour la configuration WhatsApp
  const [whatsappConfig, setWhatsappConfig] = useState({
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    fromNumber: '',
    webhookUrl: '',
    enabled: true
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Ici, vous ajouterez la logique pour sauvegarder les configurations
      // Par exemple, un appel API pour sauvegarder chaque configuration
      
      // Simulation d'un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des configurations', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Services de messagerie</h1>
        <p className="text-gray-600">Configurez vos services de communication (Email, SMS, WhatsApp)</p>
      </div>

      <form onSubmit={handleSave}>
        {/* Section Email */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Configuration Email</h2>
              <p className="text-sm text-gray-500">Paramètres du serveur SMTP pour l'envoi d'emails</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">
                {emailConfig.enabled ? 'Activé' : 'Désactivé'}
              </span>
              <button
                type="button"
                onClick={() => setEmailConfig({...emailConfig, enabled: !emailConfig.enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${emailConfig.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serveur SMTP</label>
              <input
                type="text"
                value={emailConfig.host}
                onChange={(e) => setEmailConfig({...emailConfig, host: e.target.value})}
                placeholder="smtp.example.com"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="number"
                value={emailConfig.port}
                onChange={(e) => setEmailConfig({...emailConfig, port: parseInt(e.target.value)})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input
                type="text"
                value={emailConfig.username}
                onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email d'expédition</label>
              <input
                type="email"
                value={emailConfig.from}
                onChange={(e) => setEmailConfig({...emailConfig, from: e.target.value})}
                placeholder="no-reply@votredomaine.com"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chiffrement</label>
              <select
                value={emailConfig.encryption}
                onChange={(e) => setEmailConfig({...emailConfig, encryption: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!emailConfig.enabled}
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Aucun</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section SMS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Configuration SMS</h2>
              <p className="text-sm text-gray-500">Paramètres pour l'envoi de SMS</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">
                {smsConfig.enabled ? 'Activé' : 'Désactivé'}
              </span>
              <button
                type="button"
                onClick={() => setSmsConfig({...smsConfig, enabled: !smsConfig.enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${smsConfig.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${smsConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={smsConfig.provider}
                onChange={(e) => setSmsConfig({...smsConfig, provider: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!smsConfig.enabled}
              >
                <option value="twilio">Twilio</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'expédition</label>
              <input
                type="text"
                value={smsConfig.fromNumber}
                onChange={(e) => setSmsConfig({...smsConfig, fromNumber: e.target.value})}
                placeholder="+1234567890"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!smsConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SID du compte</label>
              <input
                type="text"
                value={smsConfig.accountSid}
                onChange={(e) => setSmsConfig({...smsConfig, accountSid: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!smsConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jeton d'authentification</label>
              <input
                type="password"
                value={smsConfig.authToken}
                onChange={(e) => setSmsConfig({...smsConfig, authToken: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!smsConfig.enabled}
              />
            </div>
          </div>
        </div>

        {/* Section WhatsApp */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Configuration WhatsApp</h2>
              <p className="text-sm text-gray-500">Paramètres pour l'envoi de messages WhatsApp</p>
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">
                {whatsappConfig.enabled ? 'Activé' : 'Désactivé'}
              </span>
              <button
                type="button"
                onClick={() => setWhatsappConfig({...whatsappConfig, enabled: !whatsappConfig.enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${whatsappConfig.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${whatsappConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={whatsappConfig.provider}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, provider: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!whatsappConfig.enabled}
              >
                <option value="twilio">Twilio</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'expédition</label>
              <input
                type="text"
                value={whatsappConfig.fromNumber}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, fromNumber: e.target.value})}
                placeholder="+1234567890"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!whatsappConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SID du compte</label>
              <input
                type="text"
                value={whatsappConfig.accountSid}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, accountSid: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!whatsappConfig.enabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jeton d'authentification</label>
              <input
                type="password"
                value={whatsappConfig.authToken}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, authToken: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!whatsappConfig.enabled}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL du webhook</label>
              <input
                type="url"
                value={whatsappConfig.webhookUrl}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})}
                placeholder="https://votredomaine.com/api/webhook/whatsapp"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!whatsappConfig.enabled}
              />
              <p className="mt-1 text-xs text-gray-500">URL pour recevoir les messages entrants</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Enregistrement...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="-ml-1 mr-2 h-4 w-4" />
                Enregistré !
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
