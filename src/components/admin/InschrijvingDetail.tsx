import { useState, useEffect } from 'react';
import type { Inschrijving } from '@/types/inschrijving';
import { MediaViewer } from './MediaViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getStatusLabel, 
  getStatusColor, 
  updateInschrijvingStatus,
  updateInschrijvingNotities 
} from '@/services/inschrijvingenService';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Instagram,
  Calendar,
  Target,
  Smile,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Star,
  Activity,
  MessageCircle,
  UserCheck,
  FileText,
  StickyNote,
  Save,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface InschrijvingDetailProps {
  inschrijving: Inschrijving;
  onBack?: () => void;
  onUpdate?: () => void;
}

export function InschrijvingDetail({ inschrijving, onBack, onUpdate }: InschrijvingDetailProps) {
  const [status, setStatus] = useState<Inschrijving['status']>(inschrijving.status || 'nieuw');
  const [notities, setNotities] = useState(inschrijving.notities || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Reset state when inschrijving changes
  useEffect(() => {
    setStatus(inschrijving.status || 'nieuw');
    setNotities(inschrijving.notities || '');
    setShowSaveSuccess(false);
  }, [inschrijving.id]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Update status if changed
    if (status !== inschrijving.status) {
      const result = await updateInschrijvingStatus(inschrijving.id, status!);
      if (!result.success) {
        console.error('Failed to update status');
      }
    }

    // Update notities if changed
    if (notities !== (inschrijving.notities || '')) {
      const result = await updateInschrijvingNotities(inschrijving.id, notities);
      if (!result.success) {
        console.error('Failed to update notities');
      }
    }

    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
    onUpdate?.();
  };

  const hasChanges = status !== inschrijving.status || notities !== (inschrijving.notities || '');

  const InfoRow = ({ 
    icon: Icon, 
    label, 
    value, 
    fullWidth = false,
    children
  }: { 
    icon: React.ElementType; 
    label: string; 
    value?: string | null;
    fullWidth?: boolean;
    children?: React.ReactNode;
  }) => {
    if (!value && !children) return null;
    return (
      <div className={`flex gap-3 ${fullWidth ? 'sm:col-span-2' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-purple-accent/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-purple-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-soft uppercase tracking-wide">{label}</p>
          {children ? children : <p className="text-charcoal font-medium break-words">{value}</p>}
        </div>
      </div>
    );
  };

  const TagList = ({ items, color = 'purple' }: { items: string[], color?: 'purple' | 'blue' | 'green' }) => {
    if (!items || items.length === 0) return null;
    const colorClasses = {
      purple: 'bg-purple-accent/10 text-purple-accent',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
    };
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {items.map((item, i) => (
          <span key={i} className={`px-2 py-1 rounded-md text-sm font-medium ${colorClasses[color]}`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-charcoal border-b border-gray-100 pb-2 mb-4">
      {children}
    </h3>
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="shrink-0 lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-charcoal">
                {inschrijving.naam}
              </h2>
              <p className="text-gray-soft text-sm">
                Ingeschreven op {format(new Date(inschrijving.created_at), 'd MMMM yyyy', { locale: nl })}
                <span className="mx-2">•</span>
                {inschrijving.leeftijd} jaar
                <span className="mx-2">•</span>
                {inschrijving.woonplaats}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showSaveSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Opgeslagen!</span>
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-purple-accent hover:bg-purple-accent/90 text-white"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Opslaan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-8">
        {/* Status and Notities */}
        <div className="bg-gradient-to-br from-purple-accent/5 to-lavender/20 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as Inschrijving['status'])}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nieuw">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Nieuw
                    </span>
                  </SelectItem>
                  <SelectItem value="beoordeeld">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Beoordeeld
                    </span>
                  </SelectItem>
                  <SelectItem value="goedgekeurd">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Goedgekeurd
                    </span>
                  </SelectItem>
                  <SelectItem value="afgewezen">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Afgewezen
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {inschrijving.status && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-charcoal">Huidige Status</label>
                <div className="h-10 flex items-center">
                  <Badge className={getStatusColor(inschrijving.status)}>
                    {getStatusLabel(inschrijving.status)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Interne Notities
            </label>
            <Textarea
              value={notities}
              onChange={(e) => setNotities(e.target.value)}
              placeholder="Voeg hier interne notities toe..."
              className="min-h-[100px] bg-white resize-none"
            />
          </div>
        </div>

        {/* Media Section */}
        {(inschrijving.foto_url || inschrijving.video_url) && (
          <section>
            <SectionTitle>Media</SectionTitle>
            <MediaViewer imageUrl={inschrijving.foto_url} videoUrl={inschrijving.video_url} />
          </section>
        )}

        {/* Personal Info */}
        <section>
          <SectionTitle>Persoonlijke Informatie</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={User} label="Naam" value={inschrijving.naam} />
            <InfoRow icon={Mail} label="E-mail" value={inschrijving.email} />
            <InfoRow icon={Phone} label="GSM" value={inschrijving.gsm} />
            <InfoRow icon={MapPin} label="Woonplaats" value={inschrijving.woonplaats} />
            <InfoRow icon={Instagram} label="Instagram" value={inschrijving.instagram} />
            <InfoRow icon={Calendar} label="Leeftijd" value={`${inschrijving.leeftijd} jaar`} />
          </div>
        </section>

        {/* Availability */}
        <section>
          <SectionTitle>Beschikbaarheid</SectionTitle>
          <InfoRow icon={Calendar} label="Beschikbare data" fullWidth>
            <TagList items={inschrijving.beschikbaarheid} color="blue" />
          </InfoRow>
        </section>

        {/* Motivation & Goals */}
        <section>
          <SectionTitle>Motivatie & Doelen</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={FileText} label="Motivatie" value={inschrijving.motivatie} fullWidth />
            <InfoRow icon={Target} label="Doelen" fullWidth>
              <TagList items={inschrijving.doelen} color="green" />
            </InfoRow>
          </div>
        </section>

        {/* Personality */}
        <section>
          <SectionTitle>Persoonlijkheid</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={Smile} label="Persoonlijkheid" fullWidth>
              <TagList items={inschrijving.persoonlijkheid} />
            </InfoRow>
            <InfoRow icon={Users} label="Groepsrol" value={inschrijving.groepsrol} fullWidth />
          </div>
        </section>

        {/* Questions */}
        <section>
          <SectionTitle>Vragen</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={Zap} label="Wat vind je het spannendst?" value={inschrijving.spannendst} fullWidth />
            <InfoRow icon={AlertTriangle} label="Wat maakt je ongemakkelijk?" value={inschrijving.ongemakkelijk} fullWidth />
            <InfoRow icon={CheckCircle} label="Waarom past StepOut bij jou?" value={inschrijving.waarom_passen} fullWidth />
            <InfoRow icon={Star} label="Wat spreekt je het meest aan?" value={inschrijving.wat_spreekt_aan} fullWidth />
          </div>
        </section>

        {/* Self Ratings */}
        <section>
          <SectionTitle>Zelfbeoordeling</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <InfoRow icon={Activity} label="Sportiviteit" value={inschrijving.sportiviteit} />
            <InfoRow icon={MessageCircle} label="Sociale Interactie" value={inschrijving.sociale_interactie} />
            <InfoRow icon={UserCheck} label="Zelfstandigheid" value={inschrijving.zelfstandigheid} />
          </div>
        </section>

        {/* Medical */}
        <section>
          <SectionTitle>Medisch</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow 
              icon={Heart} 
              label="Medische info" 
              value={inschrijving.medisch ? (inschrijving.medisch_uitleg || 'Ja, details beschikbaar') : 'Geen medische info'} 
              fullWidth 
            />
          </div>
        </section>

        {/* Emergency Contact */}
        <section>
          <SectionTitle>Noodcontact</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={User} label="Naam" value={inschrijving.noodcontact_naam} />
            <InfoRow icon={Phone} label="Telefoon" value={inschrijving.noodcontact_gsm} />
          </div>
        </section>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
