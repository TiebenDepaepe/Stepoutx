import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Inschrijving } from '@/types/inschrijving';
import { getAllInschrijvingen } from '@/services/inschrijvingenService';
import { InschrijvingList } from '@/components/admin/InschrijvingList';
import { InschrijvingDetail } from '@/components/admin/InschrijvingDetail';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  Menu,
  X,
  Shield,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[]>([]);
  const [selectedInschrijving, setSelectedInschrijving] = useState<Inschrijving | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch inschrijvingen on mount
  useEffect(() => {
    fetchInschrijvingen();
  }, []);

  const fetchInschrijvingen = async () => {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await getAllInschrijvingen();
    
    if (error) {
      setError('Er is een fout opgetreden bij het ophalen van de inschrijvingen.');
      console.error('Error fetching inschrijvingen:', error);
    } else {
      setInschrijvingen(data || []);
    }
    
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleSelect = (inschrijving: Inschrijving) => {
    setSelectedInschrijving(inschrijving);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting
  };

  const handleBackToList = () => {
    setSelectedInschrijving(null);
    setIsMobileMenuOpen(true);
  };

  const handleUpdate = async () => {
    // Refresh the list to get updated data
    await fetchInschrijvingen();
    // If we have a selected item, refresh it too
    if (selectedInschrijving) {
      const updated = inschrijvingen.find(i => i.id === selectedInschrijving.id);
      if (updated) {
        setSelectedInschrijving(updated);
      }
    }
  };

  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/20 via-lavender/20 to-blush/20">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-accent to-purple-accent/70 rounded-xl flex items-center justify-center shadow-lg shadow-purple-accent/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-charcoal text-lg hidden sm:block">StepOut Admin</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInschrijvingen}
                disabled={isLoading}
                className="hidden sm:flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Vernieuwen
              </Button>
              
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-charcoal">{user?.email}</p>
                  <p className="text-xs text-gray-soft">Administrator</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-purple-accent/20">
                  <AvatarFallback className="bg-gradient-to-br from-purple-accent to-purple-accent/70 text-white text-sm font-semibold">
                    {user?.email ? getInitials(user.email) : 'AD'}
                  </AvatarFallback>
                </Avatar>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-gray-soft hover:text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar - Inschrijving List */}
          <aside 
            className={`
              fixed inset-y-0 left-0 z-40 w-full lg:w-80 lg:static lg:inset-auto
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen || !selectedInschrijving ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              bg-white lg:bg-transparent lg:border-r border-gray-100
              pt-16 lg:pt-0
            `}
          >
            <div className="h-full lg:bg-white/80 lg:backdrop-blur-sm">
              <InschrijvingList
                inschrijvingen={inschrijvingen}
                selectedId={selectedInschrijving?.id || null}
                onSelect={handleSelect}
                isLoading={isLoading}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <section 
            className={`
              flex-1 overflow-hidden
              fixed inset-0 lg:static lg:inset-auto
              z-30 bg-white lg:bg-transparent
              transform transition-transform duration-300 ease-in-out
              ${selectedInschrijving ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              lg:block
            `}
          >
            {error ? (
              <div className="h-full flex items-center justify-center p-8">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchInschrijvingen}
                    className="mt-4"
                  >
                    Opnieuw proberen
                  </Button>
                </Alert>
              </div>
            ) : selectedInschrijving ? (
              <InschrijvingDetail
                inschrijving={selectedInschrijving}
                onBack={handleBackToList}
                onUpdate={handleUpdate}
              />
            ) : (
              <div className="hidden lg:block h-full">
                <EmptyState />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
