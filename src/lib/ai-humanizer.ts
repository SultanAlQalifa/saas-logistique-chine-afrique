import { AI_ASSISTANT_CONFIG } from './ai-assistant-config';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

type Context = {
  conversationHistory: Message[];
  userPreferences?: {
    formality?: 'informal' | 'semi-formal' | 'formal';
    preferredName?: string;
  };
  interactionCount: number;
  lastInteractionTime: number;
};

export class AIHumanizer {
  private config = AI_ASSISTANT_CONFIG;
  private context: Context;

  constructor(initialContext: Partial<Context> = {}) {
    this.context = {
      conversationHistory: [],
      interactionCount: 0,
      lastInteractionTime: Date.now(),
      ...initialContext
    };
  }

  // Génère une réponse plus naturelle
  public async generateResponse(userInput: string): Promise<string> {
    // Mise à jour du contexte
    this.updateContext(userInput);
    
    // Simulation d'un temps de réflexion humain
    await this.simulateThinkingTime();

    // Génération de la réponse de base (à remplacer par l'appel à votre modèle IA)
    let response = await this.generateAIResponse(userInput);
    
    // Humanisation de la réponse
    response = this.humanizeResponse(response);
    
    // Mise à jour de l'historique
    this.addToHistory('assistant', response);
    
    return response;
  }

  // Met à jour le contexte de la conversation
  private updateContext(userInput: string): void {
    this.addToHistory('user', userInput);
    this.context.interactionCount++;
    this.context.lastInteractionTime = Date.now();
  }

  // Ajoute un message à l'historique
  private addToHistory(role: 'user' | 'assistant' | 'system', content: string): void {
    this.context.conversationHistory.push({
      role,
      content,
      timestamp: Date.now()
    });
    
    // Limiter la taille de l'historique pour des raisons de performance
    if (this.context.conversationHistory.length > 20) {
      this.context.conversationHistory.shift();
    }
  }

  // Génère une réponse de base (à remplacer par votre logique IA existante)
  private async generateAIResponse(userInput: string): Promise<string> {
    // Ici, vous intégrerez votre logique d'IA existante
    // Pour l'instant, une réponse simple
    return `J'ai bien reçu votre message : "${userInput}". Je suis en train de traiter votre demande.`;
  }

  // Rend la réponse plus naturelle
  private humanizeResponse(response: string): string {
    // Ajout occasionnel de ponctuation expressive
    if (Math.random() > 0.7) {
      const endings = [' !', '...', ' :)', ''];
      response += endings[Math.floor(Math.random() * endings.length)];
    }

    // Ajout occasionnel d'expressions naturelles
    if (Math.random() > 0.6) {
      const expressions = this.config.tone.natural_expressions.acknowledgments;
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      
      if (Math.random() > 0.5) {
        response = `${randomExpression}, ${response.toLowerCase()}`;
      } else {
        response = `${response} ${randomExpression.toLowerCase()}.`;
      }
    }

    // Variation du style selon le contexte
    const style = this.getCurrentStyle();
    if (style === 'friendly' && Math.random() > 0.7) {
      const fillers = this.config.tone.style_variations.friendly.fillers;
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      response = `${filler}, ${response.toLowerCase()}`;
    }

    return response;
  }

  // Simule un temps de réflexion humain
  private async simulateThinkingTime(): Promise<void> {
    const { min, max } = this.config.persona.human_like_behaviors.thinking_time;
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Détermine le style à utiliser en fonction du contexte
  private getCurrentStyle(): 'friendly' | 'professional' {
    const lastUserMessage = this.context.conversationHistory
      .slice()
      .reverse()
      .find(m => m.role === 'user');

    const isFormalContext = lastUserMessage?.content.match(/\b(urgence|problème|plainte|réclamation)\b/i);
    
    return isFormalContext ? 'professional' : 'friendly';
  }

  // Gestion des erreurs de manière naturelle
  public handleError(error: Error): string {
    const fallbacks = this.config.persona.human_like_behaviors.fallback_responses;
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    // Journalisation de l'erreur (à implémenter selon votre système de logs)
    console.error('Erreur de l\'assistant IA:', error);
    
    return randomFallback;
  }
}

// Utilisation de base
export async function createHumanizedAI(context: Partial<Context> = {}) {
  const humanizer = new AIHumanizer(context);
  return {
    respondTo: async (input: string) => await humanizer.generateResponse(input),
    getContext: () => humanizer['context']
  };
}
