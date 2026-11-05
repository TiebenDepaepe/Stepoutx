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
  ArrowLeft,
  Compass
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
            <InfoRow 
              icon={Calendar} 
              label="Geboortedatum / Leeftijd" 
              value={inschrijving.geboortedatum ? `${inschrijving.geboortedatum} (${inschrijving.leeftijd ?? '?'} jaar)` : (inschrijving.leeftijd ? `${inschrijving.leeftijd} jaar` : null)} 
            />
            {inschrijving.huidige_bezigheid && (
              <InfoRow icon={UserCheck} label="Wat doe je momenteel?" fullWidth>
                <p className="text-charcoal font-medium">
                  {inschrijving.huidige_bezigheid}
                  {inschrijving.studie_uitleg ? ` — Studie: ${inschrijving.studie_uitleg}` : ''}
                  {inschrijving.werk_uitleg ? ` — Werk: ${inschrijving.werk_uitleg}` : ''}
                  {inschrijving.bezigheid_anders_uitleg ? ` — Toelichting: ${inschrijving.bezigheid_anders_uitleg}` : ''}
                </p>
              </InfoRow>
            )}
          </div>
        </section>

        {/* Availability & Destination Preference */}
        <section>
          <SectionTitle>Beschikbaarheid & Bestemming</SectionTitle>
          <div className="space-y-4">
            <InfoRow 
              icon={Compass} 
              label="Voorkeur Expeditie" 
              value={inschrijving.expeditie_voorkeur || 'Geen voorkeur opgegeven'} 
              fullWidth 
            />
            <InfoRow icon={Calendar} label="Beschikbare data" fullWidth>
              <TagList items={inschrijving.beschikbaarheid} color="blue" />
            </InfoRow>
          </div>
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
            <InfoRow icon={Activity} label="Kilometers per dag" value={inschrijving.km_wandelen} />
            <InfoRow icon={Activity} label="Meerdere dagen wandelen" value={inschrijving.meerdere_dagen_wandelen} />
            <InfoRow icon={Activity} label="Sportiviteit (oud)" value={inschrijving.sportiviteit} />
            <InfoRow icon={Activity} label="Fysieke Uitdaging (oud)" value={inschrijving.fysieke_uitdaging} />
          </div>
        </section>

        {/* Groepsdynamiek & Sociaal */}
        <section>
          <SectionTitle>Groepsdynamiek & Sociaal</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={Smile} label="Persoonlijkheid (hoe vrienden omschrijven)" fullWidth>
              <TagList items={inschrijving.persoonlijkheid} />
            </InfoRow>
            {inschrijving.nieuwe_groep && (
              <InfoRow icon={Users} label="In een nieuwe groep" fullWidth>
                <p className="text-charcoal font-medium">
                  {inschrijving.nieuwe_groep}
                  {inschrijving.nieuwe_groep_extra ? ` (Extra: ${inschrijving.nieuwe_groep_extra})` : ''}
                </p>
              </InfoRow>
            )}
            {inschrijving.rol_vriendengroep && (
              <InfoRow icon={Users} label="Rol in vriendengroep" fullWidth>
                <p className="text-charcoal font-medium">
                  {inschrijving.rol_vriendengroep}
                  {inschrijving.rol_vriendengroep_extra ? ` (Extra: ${inschrijving.rol_vriendengroep_extra})` : ''}
                </p>
              </InfoRow>
            )}
            {inschrijving.sociaal_meerdaagse && (
              <InfoRow icon={MessageCircle} label="Sociaal tijdens meerdaagse trip" fullWidth>
                <p className="text-charcoal font-medium">
                  {inschrijving.sociaal_meerdaagse}
                  {inschrijving.sociaal_meerdaagse_extra ? ` (Extra: ${inschrijving.sociaal_meerdaagse_extra})` : ''}
                </p>
              </InfoRow>
            )}
            {inschrijving.vrije_tijd_interesses && inschrijving.vrije_tijd_interesses.length > 0 && (
              <InfoRow icon={Star} label="Vrije tijd & Interesses" fullWidth>
                <TagList items={inschrijving.vrije_tijd_interesses} color="purple" />
                {inschrijving.vrije_tijd_anders && (
                  <p className="text-sm text-charcoal/80 mt-1 italic">Andere interesses: {inschrijving.vrije_tijd_anders}</p>
                )}
              </InfoRow>
            )}
            <InfoRow icon={Users} label="Groepsrol (oud)" value={inschrijving.groepsrol} fullWidth />
            <InfoRow icon={MessageCircle} label="Sociale Interactie (oud)" value={inschrijving.sociale_interactie} fullWidth />
            <InfoRow icon={Users} label="Omgang met tragere wandelaars" value={inschrijving.omgang_trager_wandelen} fullWidth />
            <InfoRow icon={Users} label="Reactie bij eigen moeheid" value={inschrijving.eigen_moeheid} fullWidth />
            <InfoRow icon={Users} label="Omgang met ongewenste groepsbeslissingen" value={inschrijving.omgang_groepsbeslissing} fullWidth />
            <InfoRow icon={Users} label="Omgang met irritaties of conflicten" value={inschrijving.omgang_irritaties_conflicten} fullWidth />
            <InfoRow icon={UserCheck} label="Zelfstandigheid (oud)" value={inschrijving.zelfstandigheid} fullWidth />
            <InfoRow icon={Users} label="Behoefte van groep bij moeilijkheden" value={inschrijving.behoefte_groep_moeilijk} fullWidth />
          </div>
        </section>

        {/* Persoonlijke Reacties & Verwachtingen */}
        <section>
          <SectionTitle>Persoonlijke Reacties & Verwachtingen</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow icon={AlertTriangle} label="Waar zouden anderen zich aan kunnen ergeren bij jou?" value={inschrijving.ergernissen_anderen} fullWidth />
            <InfoRow icon={AlertTriangle} label="Met welk type persoon bots je soms?" value={inschrijving.type_persoon_botsen} fullWidth />
            {inschrijving.extra_info_groep && (
              <InfoRow icon={FileText} label="Extra info voor groepsindeling" value={inschrijving.extra_info_groep} fullWidth />
            )}
            <InfoRow icon={Zap} label="Wat vind je het spannendst? (oud)" value={inschrijving.spannendst} fullWidth />
            <InfoRow icon={AlertTriangle} label="Reactie bij regen, moeheid (oud)" value={inschrijving.reactie_regen_moeheid} fullWidth />
            <InfoRow icon={AlertTriangle} label="Hoe ga je om met ongemakkelijke situaties? (oud)" value={inschrijving.ongemakkelijk} fullWidth />
            <InfoRow icon={Star} label="Wat spreekt je het meest aan? (oud)" value={inschrijving.wat_spreekt_aan} fullWidth />
            <InfoRow icon={CheckCircle} label="Waarom pas je goed in de groep? (oud)" value={inschrijving.waarom_passen} fullWidth />
            <InfoRow icon={AlertTriangle} label="Reden om eventueel te willen stoppen (oud)" value={inschrijving.reden_stoppen} fullWidth />
          </div>
        </section>

        {/* Vriend(in) ingeschreven */}
        {inschrijving.vrienden_ingeschreven !== undefined && inschrijving.vrienden_ingeschreven !== null && (
          <section>
            <SectionTitle>Vrienden Inschrijving</SectionTitle>
            <div className="grid grid-cols-1 gap-5">
              <InfoRow 
                icon={Users} 
                label="Heeft een vriend of vriendin zich ook ingeschreven?" 
                value={inschrijving.vrienden_ingeschreven ? `Ja (${inschrijving.vrienden_namen || 'Geen naam opgegeven'})` : 'Nee'} 
                fullWidth 
              />
            </div>
          </section>
        )}

        {/* Medical */}
        <section>
          <SectionTitle>Praktisch & Veiligheid (Medisch)</SectionTitle>
          <div className="grid grid-cols-1 gap-5">
            <InfoRow 
              icon={Heart} 
              label="Lichamelijke klachten / medisch / allergieën" 
              value={inschrijving.medisch ? (inschrijving.medisch_uitleg || 'Ja, toelichting opgegeven') : 'Nee (geen bijzonderheden)'} 
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
