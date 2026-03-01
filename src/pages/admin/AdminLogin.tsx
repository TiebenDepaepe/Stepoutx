import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, or default to /admin
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError('Ongeldige gebruikersnaam of wachtwoord. Probeer het opnieuw.');
        setIsSubmitting(false);
        return;
      }

      // Successful login - navigate to the intended destination
      navigate(from, { replace: true });
    } catch (err) {
      setError('Er is een onverwachte fout opgetreden. Probeer het later opnieuw.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint/30 via-lavender/30 to-blush/30 p-4">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-mint/40 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blush/40 rounded-full blur-3xl animate-float animation-delay-200" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to website link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-soft hover:text-charcoal transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Terug naar website
        </Link>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-8">
            {/* Logo icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-accent to-purple-accent/70 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-accent/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-charcoal">
                Admin Login
              </CardTitle>
              <CardDescription className="text-gray-soft">
                Log in om toegang te krijgen tot het admin dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
                <AlertDescription className="text-red-700 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-charcoal font-medium">
                  E-mailadres
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stepout.be"
                  required
                  disabled={isSubmitting}
                  className="h-12 border-gray-200 focus:border-purple-accent focus:ring-purple-accent/20 bg-white/50"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-charcoal font-medium">
                  Wachtwoord
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                    className="h-12 border-gray-200 focus:border-purple-accent focus:ring-purple-accent/20 bg-white/50 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-soft hover:text-charcoal transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-purple-accent hover:bg-purple-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-purple-accent/25 transition-all hover:shadow-xl hover:shadow-purple-accent/30 hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-soft">
                Alleen geautoriseerde beheerders hebben toegang tot dit gedeelte.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer branding */}
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold text-charcoal">StepOut!</p>
          <p className="text-xs text-gray-soft">Youth Adventure Expeditions</p>
        </div>
      </div>
    </div>
  );
}
