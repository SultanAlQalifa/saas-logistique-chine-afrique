'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Key, User, Smartphone, Mail, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
 

type SecurityStatus = {
  passwordStrength: 'weak' | 'medium' | 'strong';
  twoFactorEnabled: boolean;
  activeSessions: number;
  lastPasswordChange: string;
  emailVerified: boolean;
  phoneVerified: boolean;
};

type Session = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export default function SecuritySettingsPage() {
  const router = useRouter();
  // Legacy route: redirect to consolidated security area
  useEffect(() => {
    router.replace('/dashboard/config');
  }, [router]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<SecurityStatus>({
    passwordStrength: 'medium',
    twoFactorEnabled: false,
    activeSessions: 3,
    lastPasswordChange: '2023-10-15',
    emailVerified: true,
    phoneVerified: false,
  });

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome',
      ip: '192.168.1.1',
      location: 'Dakar, Sénégal',
      lastActive: 'À l\'instant',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 13',
      browser: 'Safari',
      ip: '192.168.1.2',
      location: 'Dakar, Sénégal',
      lastActive: 'Il y a 2 heures',
      current: false,
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Firefox',
      ip: '192.168.1.3',
      location: 'Abidjan, Côte d\'Ivoire',
      lastActive: 'Hier',
      current: false,
    },
  ]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      console.log('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Mot de passe mis à jour avec succès');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setStatus(prev => ({
      ...prev,
      lastPasswordChange: new Date().toISOString().split('T')[0],
    }));
    setIsLoading(false);
  };

  const toggleTwoFactor = async () => {
    const newStatus = !status.twoFactorEnabled;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStatus(prev => ({
      ...prev,
      twoFactorEnabled: newStatus,
    }));
    
    console.log(`Authentification à deux facteurs ${newStatus ? 'activée' : 'désactivée'}`);
    setIsLoading(false);
  };

  const revokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    setStatus(prev => ({
      ...prev,
      activeSessions: prev.activeSessions - 1,
    }));
    console.log('Session révoquée avec succès');
  };

  const verifyEmail = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStatus(prev => ({
        ...prev,
        emailVerified: true,
      }));
      console.log('Email vérifié avec succès');
      setIsLoading(false);
    }, 1000);
  };

  const verifyPhone = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStatus(prev => ({
        ...prev,
        phoneVerified: true,
      }));
      console.log('Numéro de téléphone vérifié avec succès');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sécurité du compte</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de sécurité de votre compte et configurez l'authentification à deux facteurs
        </p>
      </div>

      <div className="grid gap-6">
        {/* Password Update Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Mot de passe</CardTitle>
            </div>
            <CardDescription>
              Mettez à jour votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe actuel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Créez un nouveau mot de passe"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Utilisez au moins 8 caractères avec des chiffres et des symboles
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Dernière mise à jour: {status.lastPasswordChange}</span>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Authentification à deux facteurs</CardTitle>
              </div>
              <Switch
                id="two-factor"
                checked={status.twoFactorEnabled}
                onCheckedChange={toggleTwoFactor}
                disabled={isLoading}
              />
            </div>
            <CardDescription>
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Authentification à deux facteurs
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {status.twoFactorEnabled
                      ? 'L\'authentification à deux facteurs est activée. Vous devrez confirmer votre identité lors de la connexion.'
                      : 'L\'authentification à deux facteurs n\'est pas activée. Activez-la pour une sécurité accrue.'}
                  </p>
                </div>
              </div>
              {status.twoFactorEnabled && (
                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Authentification à deux facteurs activée
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>
                          Votre compte est protégé par une authentification à deux facteurs. Vous devrez
                          confirmer votre identité à chaque connexion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Sessions actives</CardTitle>
              <Badge variant="outline" className="ml-2">
                {status.activeSessions} appareil{status.activeSessions > 1 ? 's' : ''}
              </Badge>
            </div>
            <CardDescription>
              Gérez les appareils connectés à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {session.browser === 'Chrome' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                          <path d="M12 1a11 11 0 100 22 11 11 0 000-22zm0 20a9 9 0 110-18 9 9 0 010 18z" />
                          <path d="M12 5a7 7 0 100 14 7 7 0 000-14z" />
                        </svg>
                      ) : session.browser === 'Safari' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                          <path d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
                            Cet appareil
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.browser} • {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Révoquer
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Vérification du compte</CardTitle>
            </div>
            <CardDescription>
              Vérifiez vos informations pour améliorer la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Adresse e-mail</p>
                    <p className="text-sm text-muted-foreground">utilisateur@example.com</p>
                  </div>
                </div>
                {status.emailVerified ? (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-900/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Vérifié
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={verifyEmail} disabled={isLoading}>
                    {isLoading ? 'Vérification...' : 'Vérifier'}
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Numéro de téléphone</p>
                    <p className="text-sm text-muted-foreground">+221 77 123 45 67</p>
                  </div>
                </div>
                {status.phoneVerified ? (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-900/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Vérifié
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={verifyPhone} disabled={isLoading}>
                    {isLoading ? 'Vérification...' : 'Vérifier'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Conseils de sécurité</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                <span>Utilisez un mot de passe unique et complexe</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                <span>Activez l'authentification à deux facteurs pour plus de sécurité</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                <span>Ne partagez jamais vos identifiants de connexion</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                <span>Vérifiez régulièrement les appareils connectés à votre compte</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                <span>Méfiez-vous des e-mails ou messages suspects</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
