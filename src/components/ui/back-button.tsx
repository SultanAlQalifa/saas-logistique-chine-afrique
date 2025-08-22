'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
}

export default function BackButton({ 
  href, 
  label = 'Retour', 
  className = '',
  variant = 'ghost'
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const baseClasses = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
  
  const variantClasses = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    ghost: "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100",
    outline: "text-secondary-600 border border-secondary-300 hover:bg-secondary-50"
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </button>
  )
}
