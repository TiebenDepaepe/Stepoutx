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
  isLoadingMedia?: boolean;
  imagePath?: string | null;
  videoPath?: string | null;
  imageLoadFailed?: boolean;
  videoLoadFailed?: boolean;
}

export function InschrijvingDetail({ 
  inschrijving, 
  onBack, 
  onUpdate, 
  isLoadingMedia,
  imagePath,
  videoPath,
  imageLoadFailed,
  videoLoadFailed
}: InschrijvingDetailProps) {
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

        {/* Media Section - show if we have any URL or path (for error display) */}
        {(inschrijving.foto_url || inschrijving.video_url || imagePath || videoPath || isLoadingMedia) && (
          <section>
            <SectionTitle>Media</SectionTitle>
            {isLoadingMedia ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                <div className="h-12 w-12 mx-auto mb-3 animate-pulse bg-gray-200 rounded-lg" />
                <p className="text-gray-soft text-sm">Media laden...</p>
              </div>
            ) : (
              <MediaViewer 
                imageUrl={inschrijving.foto_url} 
                videoUrl={inschrijving.video_url}
                imagePath={imagePath}
                videoPath={videoPath}
                imageLoadFailed={imageLoadFailed}
                videoLoadFailed={videoLoadFailed}
              />
            )}
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

        {/* Wandel- & Fysieke Profiel */}
        <section>
          <SectionTitle>Wandel- & Fysieke Profiel</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={Activity} label="Sportiviteit" value={inschrijving.sportiviteit} />
            <InfoRow icon={Activity} label="Fysieke Uitdaging" value={inschrijving.fysieke_uitdaging} />
            <InfoRow icon={Activity} label="Kilometers per dag" value={inschrijving.km_wandelen} />
            <InfoRow icon={Activity} label="Meerdere dagen wandelen" value={inschrijving.meerdere_dagen_wandelen} />
            <InfoRow icon={Activity} label="Bereid te trainen" value={inschrijving.bereid_trainen} />
            <InfoRow icon={Heart} label="Lichamelijke klachten / beperkingen" value={inschrijving.lichamelijke_klachten} fullWidth />
          </div>
        </section>

        {/* Groepsdynamiek & Sociaal */}
        <section>
          <SectionTitle>Groepsdynamiek & Sociaal</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={Smile} label="Persoonlijkheid (hoe vrienden omschrijven)" fullWidth>
              <TagList items={inschrijving.persoonlijkheid} />
            </InfoRow>
            <InfoRow icon={Users} label="Groepsrol in nieuwe groep" value={inschrijving.groepsrol} fullWidth />
            <InfoRow icon={MessageCircle} label="Sociale Interactie" value={inschrijving.sociale_interactie} fullWidth />
            <InfoRow icon={Users} label="Omgang met tragere wandelaars" value={inschrijving.omgang_trager_wandelen} fullWidth />
            <InfoRow icon={Users} label="Reactie bij eigen moeheid" value={inschrijving.eigen_moeheid} fullWidth />
            <InfoRow icon={Users} label="Omgang met ongewenste groepsbeslissingen" value={inschrijving.omgang_groepsbeslissing} fullWidth />
            <InfoRow icon={Users} label="Omgang met irritaties of conflicten" value={inschrijving.omgang_irritaties_conflicten} fullWidth />
            <InfoRow icon={UserCheck} label="Zelfstandigheid" value={inschrijving.zelfstandigheid} fullWidth />
            <InfoRow icon={Users} label="Behoefte van groep bij moeilijkheden" value={inschrijving.behoefte_groep_moeilijk} fullWidth />
          </div>
        </section>

        {/* Persoonlijke Reacties & Verwachtingen */}
        <section>
          <SectionTitle>Persoonlijke Reacties & Verwachtingen</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={Zap} label="Wat vind je het spannendst?" value={inschrijving.spannendst} fullWidth />
            <InfoRow icon={AlertTriangle} label="Reactie bij regen, moeheid & geen slaapplek" value={inschrijving.reactie_regen_moeheid} fullWidth />
            <InfoRow icon={AlertTriangle} label="Hoe ga je om met ongemakkelijke/spannende situaties?" value={inschrijving.ongemakkelijk} fullWidth />
            <InfoRow icon={Star} label="Wat spreekt je het meest aan?" value={inschrijving.wat_spreekt_aan} fullWidth />
            <InfoRow icon={CheckCircle} label="Waarom pas je goed in de groep?" value={inschrijving.waarom_passen} fullWidth />
            <InfoRow icon={AlertTriangle} label="Waar zouden anderen zich aan kunnen ergeren bij jou?" value={inschrijving.ergernissen_anderen} fullWidth />
            <InfoRow icon={AlertTriangle} label="Met welk type persoon bots je soms?" value={inschrijving.type_persoon_botsen} fullWidth />
            <InfoRow icon={AlertTriangle} label="Reden om eventueel te willen stoppen" value={inschrijving.reden_stoppen} fullWidth />
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
