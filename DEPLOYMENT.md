# 🚀 Guide de Déploiement - NextMove Cargo

## Déploiement Vercel (Recommandé)

### Étapes de déploiement :

1. **Créer un compte Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub

2. **Connecter le repository**
   - Cliquer "New Project"
   - Importer depuis GitHub
   - Sélectionner `saas-logistique-chine-afrique`

3. **Configuration automatique**
   - Vercel détecte automatiquement Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Variables d'environnement**
   ```
   NEXTAUTH_URL=https://votre-domaine.vercel.app
   NEXTAUTH_SECRET=votre-secret-aleatoire-long
   ```

5. **Déployer**
   - Cliquer "Deploy"
   - Attendre 2-3 minutes
   - URL live disponible !

## Alternative : Déploiement CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## Configuration des domaines

- Domaine gratuit : `nextmove-cargo.vercel.app`
- Domaine personnalisé : Ajouter dans les paramètres Vercel

## Notes importantes

- SSL automatique activé
- CDN global pour performance en Afrique
- Déploiement automatique à chaque push GitHub
- Rollback facile en cas de problème

## Support

En cas de problème, consulter la [documentation Vercel](https://vercel.com/docs)
