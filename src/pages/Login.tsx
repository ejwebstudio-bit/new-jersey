import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShoppingBag, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
        toast.success('Compte créé avec succès !');
      } else {
        await login(email, password);
        toast.success('Connecté !');
      }
      navigate('/');
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Cet email est déjà utilisé'
          : err.code === 'auth/invalid-credential'
          ? 'Email ou mot de passe incorrect'
          : err.code === 'auth/weak-password'
          ? 'Mot de passe trop faible (6 caractères minimum)'
          : err.code === 'auth/too-many-requests'
          ? 'Trop de tentatives. Réessaye plus tard.'
          : 'Une erreur est survenue';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Connecté avec Google !');
      navigate('/');
    } catch {
      toast.error('Erreur de connexion Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-court to-court-dark flex items-center justify-center shadow-lg shadow-court/20">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">New Jersey</h1>
          <p className="text-sm text-muted-foreground">
            {isRegister ? 'Créez un compte pour proposer vos prix' : 'Connectez-vous pour proposer vos prix'}
          </p>
        </div>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{isRegister ? 'Inscription' : 'Connexion'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@email.com"
                    className="pl-9 h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-court to-court-dark hover:from-court-dark hover:to-court-light shadow-sm"
                disabled={loading}
              >
                {loading ? 'Chargement...' : isRegister ? 'Créer un compte' : 'Se connecter'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-border/50 hover:bg-accent/50"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isRegister ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-court font-medium underline-offset-4 hover:underline"
              >
                {isRegister ? 'Se connecter' : "S'inscrire"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
