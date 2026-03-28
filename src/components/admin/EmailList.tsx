import { useState } from 'react';
import { Copy, Check, Mail, Users, Mails } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmailEntry {
  email: string;
  created_at: string;
}

interface EmailListProps {
  inschrijvingEmails: EmailEntry[];
  nieuwsbriefEmails: EmailEntry[];
  isLoading: boolean;
}

type FilterType = 'alles' | 'inschrijvingen' | 'nieuwsbrief';

export function EmailList({ inschrijvingEmails, nieuwsbriefEmails, isLoading }: EmailListProps) {
  const [filter, setFilter] = useState<FilterType>('alles');
  const [copied, setCopied] = useState(false);

  const getDisplayEmails = (): { email: string; source: string }[] => {
    if (filter === 'inschrijvingen') {
      return inschrijvingEmails.map(e => ({ email: e.email, source: 'Inschrijving' }));
    }
    if (filter === 'nieuwsbrief') {
      return nieuwsbriefEmails.map(e => ({ email: e.email, source: 'Nieuwsbrief' }));
    }

    // Combined & deduplicated
    const emailMap = new Map<string, string>();

    inschrijvingEmails.forEach(e => {
      emailMap.set(e.email.toLowerCase(), 'Inschrijving');
    });

    nieuwsbriefEmails.forEach(e => {
      const key = e.email.toLowerCase();
      if (emailMap.has(key)) {
        emailMap.set(key, 'Beide');
      } else {
        emailMap.set(key, 'Nieuwsbrief');
      }
    });

    return Array.from(emailMap.entries()).map(([email, source]) => ({ email, source }));
  };

  const displayEmails = getDisplayEmails();

  const handleCopy = async () => {
    const emailString = displayEmails.map(e => e.email).join(', ');
    await navigator.clipboard.writeText(emailString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'alles', label: 'Alles', icon: <Mails className="w-4 h-4" /> },
    { key: 'inschrijvingen', label: 'Inschrijvingen', icon: <Users className="w-4 h-4" /> },
    { key: 'nieuwsbrief', label: 'Nieuwsbrief', icon: <Mail className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-3 w-full max-w-2xl px-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f.key
                    ? 'bg-purple-accent text-white shadow-lg shadow-purple-accent/25'
                    : 'bg-gray-50 text-charcoal hover:bg-gray-100'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Copy button + count */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-purple-accent/10 text-purple-accent">
              {displayEmails.length} emails
            </Badge>
            <Button
              onClick={handleCopy}
              disabled={displayEmails.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Gekopieerd!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieer alles
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {displayEmails.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-accent/10 to-lavender/30 rounded-3xl flex items-center justify-center mb-6">
              <Mail className="h-12 w-12 text-purple-accent" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Geen emails gevonden</h3>
            <p className="text-gray-soft">Er zijn nog geen emails in deze categorie.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-2">
            {displayEmails.map((entry, index) => (
              <div
                key={`${entry.email}-${index}`}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-charcoal font-medium">{entry.email}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    entry.source === 'Beide'
                      ? 'bg-purple-accent/10 text-purple-accent'
                      : entry.source === 'Nieuwsbrief'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {entry.source}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
