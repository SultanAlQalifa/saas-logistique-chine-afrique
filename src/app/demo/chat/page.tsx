"use client";

import { HumanizedChat } from '@/components/chat/HumanizedChat';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Démonstration de l'assistant IA
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre nouvel assistant conversationnel avec des réponses naturelles et humaines.
              Posez-lui des questions sur vos expéditions, tarifs ou suivi de colis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
          >
            <HumanizedChat />
          </motion.div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Cet assistant utilise une intelligence artificielle avancée pour fournir des réponses naturelles et humaines.
              Les temps de réponse peuvent varier pour simuler un comportement humain réaliste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
