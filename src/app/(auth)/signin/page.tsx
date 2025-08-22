'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Truck, ArrowLeft, Home } from 'lucide-react'

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SigninFormData = z.infer<typeof signinSchema>

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [accountType, setAccountType] = useState<'admin' | 'company' | 'client'>('admin')
  const router = useRouter()

  // Données de connexion par défaut selon le type de compte
  const getDefaultCredentials = (type: 'admin' | 'company' | 'client') => {
    switch (type) {
      case 'admin':
        return { email: 'admin@platform.com', password: 'admin123' }
      case 'company':
        return { email: 'contact@logitrans.com', password: 'company123' }
      case 'client':
        return { email: 'client@example.com', password: 'client123' }
      default:
        return { email: '', password: '' }
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: 'admin@platform.com',
      password: 'admin123'
    }
  })

  // Fonction pour remplir automatiquement les champs
  const handleAccountTypeChange = (type: 'admin' | 'company' | 'client') => {
    setAccountType(type)
    const credentials = getDefaultCredentials(type)
    setValue('email', credentials.email)
    setValue('password', credentials.password)
    // Effacer les erreurs précédentes
    setError('')
  }

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        accountType: accountType,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe invalide')
      } else {
        // Refresh session and redirect based on account type
        await getSession()
        
        // Redirection selon le type de compte
        if (accountType === 'admin') {
          router.push('/dashboard')
        } else if (accountType === 'company') {
          router.push('/dashboard/companies')
        } else if (accountType === 'client') {
          router.push('/dashboard/client-portal')
        }
        
        router.refresh()
      }
    } catch (error) {
      setError('Une erreur s\'est produite. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Retour à l'accueil</span>
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-medium hidden sm:block">NextMove</span>
          </Link>
        </div>
      </div>

      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
            <Truck className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Connexion à votre compte
        </h2>
        <p className="mt-3 text-center text-lg text-gray-600 font-medium">
          NextMove Chine-Afrique
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-3xl border border-white/20 sm:px-12">
          {/* Sélecteur de type de compte */}
          <div className="mb-8">
            <div className="flex rounded-2xl border border-gray-200 p-1.5 bg-gradient-to-r from-gray-50 to-gray-100 shadow-inner">
              <button
                type="button"
                onClick={() => handleAccountTypeChange('admin')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  accountType === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                👨‍💼 Admin
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange('company')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  accountType === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                🏢 Entreprise
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange('client')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  accountType === 'client'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                👤 Client
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600 text-center font-medium">
              {accountType === 'admin' && 'Accès administrateur à la plateforme'}
              {accountType === 'company' && 'Compte entreprise de logistique'}
              {accountType === 'client' && 'Compte client pour suivi de colis'}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur text-base"
                  placeholder="Entrez votre email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  id="password"
                  type={passwordInputType}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur text-base"
                  placeholder="Entrez votre mot de passe"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200"
                    onClick={() => {
                      const newShowPassword = !showPassword
                      const newInputType = newShowPassword ? 'text' : 'password'
                      console.log('Toggle password visibility:', newShowPassword, 'Input type:', newInputType)
                      setShowPassword(newShowPassword)
                      setPasswordInputType(newInputType)
                      
                      // Force re-render
                      setTimeout(() => {
                        const input = document.getElementById('password') as HTMLInputElement
                        if (input) {
                          input.type = newInputType
                          console.log('Input type set to:', input.type)
                        }
                      }, 10)
                    }}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Comptes de Démonstration</span>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur rounded-2xl border border-gray-200/50">
              <p className="text-sm text-gray-700 mb-3 font-medium">Pour les tests :</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><strong>👨‍💼 Admin:</strong> <code className="bg-white/70 px-2 py-1 rounded text-xs">admin@platform.com / admin123</code></p>
                <p className="flex items-center gap-2"><strong>🏢 Entreprise:</strong> <code className="bg-white/70 px-2 py-1 rounded text-xs">contact@logitrans.com / company123</code></p>
                <p className="flex items-center gap-2"><strong>👤 Client:</strong> <code className="bg-white/70 px-2 py-1 rounded text-xs">client@example.com / client123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
