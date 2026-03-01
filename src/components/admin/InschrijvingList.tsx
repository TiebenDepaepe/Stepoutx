import { useState } from 'react';
import type { Inschrijving } from '@/types/inschrijving';
import { getStatusColor, getStatusLabel } from '@/services/inschrijvingenService';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface InschrijvingListProps {
  inschrijvingen: Inschrijving[];
  selectedId: string | null;
  onSelect: (inschrijving: Inschrijving) => void;
  isLoading: boolean;
}

export function InschrijvingList({ 
  inschrijvingen, 
  selectedId, 
  onSelect,
  isLoading 
}: InschrijvingListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter inschrijvingen based on search query
  const filteredInschrijvingen = inschrijvingen.filter((inschrijving) => {
    const naam = inschrijving.naam.toLowerCase();
    const email = inschrijving.email.toLowerCase();
    const woonplaats = inschrijving.woonplaats.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return naam.includes(query) || email.includes(query) || woonplaats.includes(query);
  });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with search */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">Inschrijvingen</h2>
          <Badge variant="secondary" className="bg-purple-accent/10 text-purple-accent">
            {inschrijvingen.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Zoek op naam, email of woonplaats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredInschrijvingen.length === 0 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-soft text-sm">
              {searchQuery ? 'Geen resultaten gevonden' : 'Nog geen inschrijvingen'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredInschrijvingen.map((inschrijving) => (
              <button
                key={inschrijving.id}
                onClick={() => onSelect(inschrijving)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                  selectedId === inschrijving.id
                    ? 'bg-purple-accent text-white shadow-lg shadow-purple-accent/25'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${
                      selectedId === inschrijving.id ? 'text-white' : 'text-charcoal'
                    }`}>
                      {inschrijving.naam}
                    </p>
                    <p className={`text-sm truncate ${
                      selectedId === inschrijving.id ? 'text-white/80' : 'text-gray-soft'
                    }`}>
                      {inschrijving.email}
                    </p>
                  </div>
                  {inschrijving.status && (
                    <Badge 
                      variant="secondary" 
                      className={`shrink-0 text-xs ${
                        selectedId === inschrijving.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : getStatusColor(inschrijving.status)
                      }`}
                    >
                      {getStatusLabel(inschrijving.status)}
                    </Badge>
                  )}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-xs ${
                  selectedId === inschrijving.id ? 'text-white/70' : 'text-gray-400'
                }`}>
                  <Calendar className="h-3 w-3" />
                  {format(new Date(inschrijving.created_at), 'd MMM yyyy', { locale: nl })}
                  <span className="mx-1">•</span>
                  {inschrijving.woonplaats}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
