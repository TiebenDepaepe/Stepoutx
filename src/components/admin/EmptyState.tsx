import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onBack?: () => void;
}

export function EmptyState({ onBack }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-accent/10 to-lavender/30 rounded-3xl flex items-center justify-center mb-6">
        <FileText className="h-12 w-12 text-purple-accent" />
      </div>
      
      <h3 className="text-xl font-semibold text-charcoal mb-2">
        Selecteer een inschrijving
      </h3>
      <p className="text-gray-soft max-w-sm mb-6">
        Klik op een naam in de lijst aan de linkerkant om de details te bekijken.
      </p>
      
      {onBack && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="lg:hidden"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar lijst
        </Button>
      )}
    </div>
  );
}
