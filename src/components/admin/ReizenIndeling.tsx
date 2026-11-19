import { useMemo, useState } from 'react';
import type { Inschrijving } from '@/types/inschrijving';
import { updateInschrijvingenToegewezenReis } from '@/services/inschrijvingenService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  MapPin,
  Search,
  Sparkles,
  Undo2,
  UserCheck,
  UserPlus,
  Users,
  AlertTriangle,
  Activity,
  Loader2,
} from 'lucide-react';

interface ReizenIndelingProps {
  inschrijvingen: Inschrijving[];
  onOpenDetail: (inschrijving: Inschrijving) => void;
  onAssignmentChange: (ids: string[], toegewezenReis: string | null) => void;
}

// Chronologische volgorde van alle PlotTwist-weken
const CHRONOLOGICAL_WEEKS = [
  '1 - 6 februari',
  '29 maart - 3 april',
  '5 - 10 april',
  '20 - 25 juni',
  '27 juni - 2 juli',
  '4 - 9 juli',
  '11 - 16 juli',
  '18 - 23 juli',
  '25 - 30 juli',
  '1 - 6 augustus',
  '8 - 13 augustus',
  '15 - 20 augustus',
  '22 - 27 augustus',
  '29 augustus - 3 september',
  '5 - 10 september',
  '12 - 17 september',
  '19 - 24 september',
];

const TEST_EMAILS = new Set(['kenisdaria1@gmail.com', 'kenisdaria@gmail.com']);

/**
 * Unieke sleutel per persoon (op basis van e-mailadres of genormaliseerde naam),
 * zodat iemand die het formulier per ongeluk 2x heeft ingevuld nooit dubbel in dezelfde week staat
 * en bij toewijzing in één keer voor beide rijen wordt gekoppeld.
 */
function getPersonKey(item: Inschrijving): string {
  const email = (item.email || '').trim().toLowerCase();
  if (email) return `email:${email}`;
  return `id:${item.id}`;
}

export interface DeduplicatedPerson {
  primary: Inschrijving;
  allIds: string[];
  allBeschikbaarheid: string[];
  toegewezenReis: string | null;
  duplicateCount: number;
}

export function ReizenIndeling({
  inschrijvingen,
  onOpenDetail,
  onAssignmentChange,
}: ReizenIndelingProps) {
  const [dateScope, setDateScope] = useState<'since_nov7' | 'all'>('since_nov7');
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'nl_de' | 'it'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({
    '1 - 6 februari': true,
    '29 maart - 3 april': true,
    '5 - 10 april': true,
  });

  // Per week bijhouden welke personKeys momenteel zijn aangevinkt om toe te wijzen
  const [selectedByWeek, setSelectedByWeek] = useState<Record<string, Set<string>>>({});
  const [savingWeek, setSavingWeek] = useState<string | null>(null);
  const [removingPersonKey, setRemovingPersonKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Filter inschrijvingen op periode (vanaf 7 november vs allemaal) en sluit test-inschrijvingen uit
  const scopedInschrijvingen = useMemo(() => {
    return inschrijvingen.filter((item) => {
      const emailLower = (item.email || '').trim().toLowerCase();
      if (TEST_EMAILS.has(emailLower)) return false;

      if (dateScope === 'since_nov7') {
        return new Date(item.created_at) >= new Date('2026-11-07T00:00:00Z');
      }
      return true;
    });
  }, [inschrijvingen, dateScope]);

  // 2. Groepeer per unieke persoon (zodat een dubbele inzending van dezelfde persoon maar 1x per week verschijnt)
  const persons = useMemo<DeduplicatedPerson[]>(() => {
    const map = new Map<string, DeduplicatedPerson>();

    // scopedInschrijvingen staat al van nieuw naar oud, dus de eerste die we tegenkomen is de meest recente
    for (const item of scopedInschrijvingen) {
      const key = getPersonKey(item);
      const existing = map.get(key);
      const cleanWeeks = Array.from(
        new Set((item.beschikbaarheid || []).map((w) => w.trim()).filter(Boolean))
      );

      if (!existing) {
        map.set(key, {
          primary: item,
          allIds: [item.id],
          allBeschikbaarheid: cleanWeeks,
          toegewezenReis: item.toegewezen_reis || null,
          duplicateCount: 1,
        });
      } else {
        existing.allIds.push(item.id);
        existing.duplicateCount += 1;
        // Voeg eventuele extra weken uit eerdere inzending samen
        for (const w of cleanWeeks) {
          if (!existing.allBeschikbaarheid.includes(w)) {
            existing.allBeschikbaarheid.push(w);
          }
        }
        // Als een van de rijen al een toegewezen_reis heeft, neem die over
        if (!existing.toegewezenReis && item.toegewezen_reis) {
          existing.toegewezenReis = item.toegewezen_reis;
        }
      }
    }

    return Array.from(map.values());
  }, [scopedInschrijvingen]);

  // 3. Filter op bestemming & zoekterm voor de beschikbare kandidaten
  const matchesFilter = (person: DeduplicatedPerson): boolean => {
    const item = person.primary;
    if (destinationFilter === 'nl_de') {
      if (!(item.expeditie_voorkeur || '').toLowerCase().includes('nederland')) return false;
    } else if (destinationFilter === 'it') {
      if (!(item.expeditie_voorkeur || '').toLowerCase().includes('itali')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchNaam = (item.naam || '').toLowerCase().includes(q);
      const matchWoonplaats = (item.woonplaats || '').toLowerCase().includes(q);
      const matchEmail = (item.email || '').toLowerCase().includes(q);
      if (!matchNaam && !matchWoonplaats && !matchEmail) return false;
    }

    return true;
  };

  // 4. Bepaal alle weken die getoond moeten worden in chronologische volgorde
  const allWeeks = useMemo(() => {
    const presentWeeks = new Set<string>();
    for (const p of persons) {
      for (const w of p.allBeschikbaarheid) {
        presentWeeks.add(w);
      }
      if (p.toegewezenReis) {
        presentWeeks.add(p.toegewezenReis);
      }
    }

    const ordered = CHRONOLOGICAL_WEEKS.filter((w) => presentWeeks.has(w));
    const extra = Array.from(presentWeeks).filter((w) => !CHRONOLOGICAL_WEEKS.includes(w));
    return [...ordered, ...extra];
  }, [persons]);

  // 5. Bouw de data per week op:
  // - assigned: personen die aan DEZE week zijn toegewezen
  // - available: personen die voor deze week beschikbaar zijn, nog NIET aan een reis zijn toegewezen, en aan het huidige filter voldoen
  // - assignedElsewhere: personen die deze week in hun beschikbaarheid hadden, maar al aan een ANDERE week zijn toegewezen
  const weekBuckets = useMemo(() => {
    return allWeeks.map((week) => {
      const assigned: DeduplicatedPerson[] = [];
      const available: DeduplicatedPerson[] = [];
      const assignedElsewhere: DeduplicatedPerson[] = [];

      for (const person of persons) {
        const isAvailableThisWeek = person.allBeschikbaarheid.includes(week);

        if (person.toegewezenReis === week) {
          assigned.push(person);
        } else if (isAvailableThisWeek) {
          if (person.toegewezenReis) {
            assignedElsewhere.push(person);
          } else if (matchesFilter(person)) {
            available.push(person);
          }
        }
      }

      return {
        week,
        assigned,
        available,
        assignedElsewhere,
      };
    });
  }, [allWeeks, persons, destinationFilter, searchQuery]);

  const totalAssignedCount = useMemo(
    () => persons.filter((p) => !!p.toegewezenReis).length,
    [persons]
  );

  const toggleWeekExpanded = (week: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [week]: prev[week] === undefined ? false : !prev[week],
    }));
  };

  const isWeekExpanded = (week: string, index: number) => {
    if (expandedWeeks[week] !== undefined) return expandedWeeks[week];
    return index < 3;
  };

  const toggleSelectPersonInWeek = (week: string, personKey: string) => {
    setSelectedByWeek((prev) => {
      const currentSet = new Set(prev[week] || []);
      if (currentSet.has(personKey)) {
        currentSet.delete(personKey);
      } else {
        currentSet.add(personKey);
      }
      return { ...prev, [week]: currentSet };
    });
  };

  const clearSelectionInWeek = (week: string) => {
    setSelectedByWeek((prev) => ({ ...prev, [week]: new Set() }));
  };

  const handleConfirmAssignment = async (week: string) => {
    const selectedKeys = selectedByWeek[week];
    if (!selectedKeys || selectedKeys.size === 0) return;

    const idsToAssign: string[] = [];
    for (const person of persons) {
      const key = getPersonKey(person.primary);
      if (selectedKeys.has(key)) {
        idsToAssign.push(...person.allIds);
      }
    }

    if (idsToAssign.length === 0) return;

    setSavingWeek(week);
    setErrorMsg(null);

    const { success, error } = await updateInschrijvingenToegewezenReis(idsToAssign, week);
    setSavingWeek(null);

    if (!success) {
      setErrorMsg(
        error?.message || 'Kon de plaatsing niet opslaan in de database. Probeer het opnieuw.'
      );
      return;
    }

    // Wis selectie van deze personen in alle weken
    setSelectedByWeek((prev) => {
      const next: Record<string, Set<string>> = {};
      for (const [w, set] of Object.entries(prev)) {
        const filtered = new Set(Array.from(set).filter((k) => !selectedKeys.has(k)));
        next[w] = filtered;
      }
      return next;
    });

    onAssignmentChange(idsToAssign, week);
  };

  const handleUnassignPerson = async (person: DeduplicatedPerson) => {
    const key = getPersonKey(person.primary);
    setRemovingPersonKey(key);
    setErrorMsg(null);

    const { success, error } = await updateInschrijvingenToegewezenReis(person.allIds, null);
    setRemovingPersonKey(null);

    if (!success) {
      setErrorMsg(
        error?.message || 'Kon de plaatsing niet ongedaan maken. Probeer het opnieuw.'
      );
      return;
    }

    onAssignmentChange(person.allIds, null);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Samenvatting & Filters */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-gray-100 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal flex items-center gap-2.5">
                <Calendar className="w-7 h-7 text-purple-accent" />
                Reizen Indelen per Week
              </h1>
              <p className="text-sm text-gray-soft mt-1">
                Klik op een naam om het volledige inschrijfformulier te openen. Vink meerdere kandidaten aan om ze in een reis te plaatsen.
              </p>
            </div>

            {/* Statistieken */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-lavender/40 border border-purple-accent/15">
                <p className="text-[11px] uppercase tracking-wider text-gray-soft font-medium">
                  Inschrijvingen
                </p>
                <p className="text-lg font-display font-bold text-charcoal">
                  {scopedInschrijvingen.length}{' '}
                  <span className="text-xs font-normal text-gray-soft">
                    ({persons.length} unieke personen)
                  </span>
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-green-50 border border-green-200">
                <p className="text-[11px] uppercase tracking-wider text-green-700 font-medium">
                  Ingedeeld in reis
                </p>
                <p className="text-lg font-display font-bold text-green-800">
                  {totalAssignedCount}
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[11px] uppercase tracking-wider text-amber-800 font-medium">
                  Nog in te delen
                </p>
                <p className="text-lg font-display font-bold text-amber-900">
                  {persons.length - totalAssignedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Filterbalk */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Periode filter */}
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setDateScope('since_nov7')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    dateScope === 'since_nov7'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-soft hover:text-charcoal'
                  }`}
                >
                  Vanaf 7 nov (87)
                </button>
                <button
                  type="button"
                  onClick={() => setDateScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    dateScope === 'all'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-soft hover:text-charcoal'
                  }`}
                >
                  Alle inschrijvingen
                </button>
              </div>

              {/* Bestemming filter */}
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setDestinationFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    destinationFilter === 'all'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-soft hover:text-charcoal'
                  }`}
                >
                  Alle bestemmingen
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationFilter('nl_de')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    destinationFilter === 'nl_de'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-soft hover:text-charcoal'
                  }`}
                >
                  🇳🇱🇩🇪 NL / Duitsland
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationFilter('it')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    destinationFilter === 'it'
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-soft hover:text-charcoal'
                  }`}
                >
                  🇮🇹 Italië (+€145)
                </button>
              </div>
            </div>

            {/* Zoekbalk */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op naam of woonplaats..."
                className="pl-9 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Sneloverzicht chips per week */}
        <div className="flex flex-wrap gap-2">
          {weekBuckets.map(({ week, assigned, available }) => (
            <button
              key={week}
              type="button"
              onClick={() => {
                setExpandedWeeks((prev) => ({ ...prev, [week]: true }));
                const el = document.getElementById(`week-card-${week}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                assigned.length > 0
                  ? 'bg-green-50/90 border-green-300 text-charcoal hover:bg-green-100/80'
                  : 'bg-white border-gray-200 text-charcoal hover:border-purple-accent/40'
              }`}
            >
              <span className="font-semibold">{week}</span>
              {assigned.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-green-600 text-white text-[11px] font-bold">
                  {assigned.length} in reis
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded-md bg-purple-accent/10 text-purple-accent text-[11px] font-semibold">
                {available.length} vrij
              </span>
            </button>
          ))}
        </div>

        {/* Weekkaarten */}
        <div className="space-y-5">
          {weekBuckets.map(({ week, assigned, available, assignedElsewhere }, index) => {
            const isExpanded = isWeekExpanded(week, index);
            const selectedSet = selectedByWeek[week] || new Set<string>();
            const selectedCount = selectedSet.size;
            const isSavingThisWeek = savingWeek === week;

            return (
              <div
                key={week}
                id={`week-card-${week}`}
                className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden"
              >
                {/* Week Header */}
                <button
                  type="button"
                  onClick={() => toggleWeekExpanded(week)}
                  className="w-full px-5 sm:px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white via-lavender/15 to-mint/20 hover:bg-lavender/20 transition-colors text-left border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1F4E37] text-mint flex items-center justify-center shrink-0 shadow-sm">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-display font-bold text-charcoal">
                        Week: {week}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-soft">
                        {assigned.length === 0
                          ? 'Nog geen deelnemers toegewezen aan deze reis'
                          : `${assigned.length} deelnemer${assigned.length === 1 ? '' : 's'} ingedeeld in deze reis`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge
                      className={`px-3 py-1 text-xs font-semibold ${
                        assigned.length > 0
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                      {assigned.length} toegewezen
                    </Badge>

                    <Badge className="px-3 py-1 text-xs font-semibold bg-purple-accent/10 text-purple-accent border-purple-accent/20">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      {available.length} beschikbaar
                    </Badge>

                    {assignedElsewhere.length > 0 && (
                      <Badge className="px-2.5 py-1 text-xs font-normal bg-gray-100 text-gray-500 border-gray-200">
                        {assignedElsewhere.length} elders ingedeeld
                      </Badge>
                    )}

                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center ml-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-charcoal" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-charcoal" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-5 sm:p-7 space-y-8">
                    {/* DEEL 1: TOEGEWEZEN DEELNEMERS IN DEZE REIS */}
                    <div className="rounded-2xl bg-green-50/50 border border-green-200/80 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <h3 className="text-base sm:text-lg font-display font-bold text-charcoal">
                            Ingedeeld in deze reis ({assigned.length})
                          </h3>
                        </div>
                        <span className="text-xs text-gray-soft">
                          Deze personen zijn verborgen bij de beschikbare kandidaten van andere weken
                        </span>
                      </div>

                      {assigned.length === 0 ? (
                        <p className="text-sm text-gray-soft italic py-2">
                          Nog niemand toegewezen aan {week}. Vink hieronder beschikbare kandidaten aan en klik op &ldquo;Bevestig plaatsing&rdquo;.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {assigned.map((person) => {
                            const item = person.primary;
                            const key = getPersonKey(item);
                            const isRemoving = removingPersonKey === key;
                            const isItalie = (item.expeditie_voorkeur || '')
                              .toLowerCase()
                              .includes('itali');

                            return (
                              <div
                                key={key}
                                className="bg-white rounded-2xl p-4 border border-green-200 shadow-xs flex flex-col justify-between gap-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => onOpenDetail(item)}
                                      className="text-left font-display font-bold text-charcoal hover:text-purple-accent hover:underline text-base inline-flex items-center gap-1.5 group"
                                    >
                                      <span className="truncate">{item.naam}</span>
                                      <Eye className="w-3.5 h-3.5 text-purple-accent opacity-70 group-hover:opacity-100 shrink-0" />
                                    </button>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-soft mt-0.5">
                                      {item.leeftijd && <span>{item.leeftijd} jaar</span>}
                                      {item.woonplaats && (
                                        <span className="inline-flex items-center gap-0.5">
                                          • <MapPin className="w-3 h-3" /> {item.woonplaats}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                                      isItalie
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-sky-100 text-sky-900'
                                    }`}
                                  >
                                    {isItalie ? '🇮🇹 Italië' : '🇳🇱🇩🇪 NL / DE'}
                                  </span>
                                </div>

                                {/* Persoonlijkheid & vrienden-check */}
                                <div className="flex flex-wrap gap-1.5">
                                  {(item.persoonlijkheid || []).map((trait) => (
                                    <span
                                      key={trait}
                                      className="px-2 py-0.5 rounded-md bg-lavender/50 text-purple-accent text-[11px] font-medium"
                                    >
                                      {trait}
                                    </span>
                                  ))}
                                  {item.km_wandelen && (
                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-charcoal/70 text-[11px]">
                                      🥾 {item.km_wandelen}
                                    </span>
                                  )}
                                  {item.vrienden_ingeschreven && (
                                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[11px] font-medium">
                                      ⚠️ Vriend(in): {item.vrienden_namen || 'Ja'}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                                  <button
                                    type="button"
                                    onClick={() => onOpenDetail(item)}
                                    className="text-xs font-medium text-purple-accent hover:underline inline-flex items-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    Volledig formulier
                                  </button>

                                  <button
                                    type="button"
                                    disabled={isRemoving}
                                    onClick={() => handleUnassignPerson(person)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors disabled:opacity-50"
                                  >
                                    {isRemoving ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Undo2 className="w-3.5 h-3.5" />
                                    )}
                                    Haal uit reis
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* DEEL 2: BESCHIKBARE KANDIDATEN VOOR DEZE WEEK */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-display font-bold text-charcoal flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-accent" />
                            Beschikbare kandidaten voor {week} ({available.length})
                          </h3>
                          <p className="text-xs text-gray-soft">
                            Vink één of meerdere personen aan en bevestig hun plaatsing in deze reis.
                          </p>
                        </div>

                        {/* Actiebalk voor aangevinkte personen */}
                        {selectedCount > 0 && (
                          <div className="flex items-center gap-2 bg-lavender/40 border border-purple-accent/30 px-3.5 py-2 rounded-2xl">
                            <span className="text-xs sm:text-sm font-semibold text-charcoal">
                              {selectedCount} geselecteerd
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => clearSelectionInWeek(week)}
                              className="h-8 px-2.5 text-xs text-gray-soft hover:text-charcoal"
                            >
                              Wissen
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isSavingThisWeek}
                              onClick={() => handleConfirmAssignment(week)}
                              className="h-8 bg-[#1F4E37] hover:bg-[#1F4E37]/90 text-white text-xs sm:text-sm font-semibold rounded-xl"
                            >
                              {isSavingThisWeek ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                  Bevestigen...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                                  Bevestig plaatsing ({selectedCount})
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {available.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-soft">
                          Geen beschikbare kandidaten voor deze week (met de huidige filters).
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {available.map((person) => {
                            const item = person.primary;
                            const key = getPersonKey(item);
                            const isChecked = selectedSet.has(key);
                            const isItalie = (item.expeditie_voorkeur || '')
                              .toLowerCase()
                              .includes('itali');
                            const otherWeeks = person.allBeschikbaarheid.filter(
                              (w) => w !== week
                            );

                            return (
                              <div
                                key={key}
                                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                                  isChecked
                                    ? 'bg-lavender/25 border-purple-accent ring-2 ring-purple-accent/30 shadow-sm'
                                    : 'bg-gray-50/70 hover:bg-white border-gray-200/80 hover:border-purple-accent/30'
                                }`}
                              >
                                <div>
                                  {/* Bovenste rij: Checkbox + Naam + Bestemming */}
                                  <div className="flex items-start gap-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleSelectPersonInWeek(week, key)}
                                      aria-label={`Selecteer ${item.naam} voor ${week}`}
                                      className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                        isChecked
                                          ? 'bg-purple-accent border-purple-accent text-white'
                                          : 'bg-white border-gray-300 hover:border-purple-accent'
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <button
                                          type="button"
                                          onClick={() => onOpenDetail(item)}
                                          className="text-left font-display font-bold text-charcoal hover:text-purple-accent hover:underline text-sm sm:text-base leading-snug truncate"
                                          title="Klik om het volledige inschrijfformulier te openen"
                                        >
                                          {item.naam}
                                        </button>

                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                                            isItalie
                                              ? 'bg-amber-100 text-amber-900'
                                              : 'bg-sky-100 text-sky-900'
                                          }`}
                                        >
                                          {isItalie ? '🇮🇹 Italië' : '🇳🇱🇩🇪 NL / DE'}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-soft mt-0.5">
                                        {item.leeftijd && <span>{item.leeftijd} jaar</span>}
                                        {item.woonplaats && <span>• {item.woonplaats}</span>}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Eigenschappen & wandelconditie */}
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {(item.persoonlijkheid || []).map((trait) => (
                                      <span
                                        key={trait}
                                        className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-charcoal/80 text-[11px] font-medium"
                                      >
                                        {trait}
                                      </span>
                                    ))}
                                    {item.km_wandelen && (
                                      <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-charcoal/70 text-[11px] inline-flex items-center gap-1">
                                        <Activity className="w-3 h-3 text-purple-accent" />
                                        {item.km_wandelen}
                                      </span>
                                    )}
                                  </div>

                                  {/* Vriend(in) waarschuwing indien van toepassing */}
                                  {item.vrienden_ingeschreven && (
                                    <div className="mt-2 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium">
                                      ⚠️ Vriend(in) ingeschreven: {item.vrienden_namen || 'Ja'}
                                    </div>
                                  )}
                                </div>

                                {/* Onderste rij: Andere beschikbare weken + Formulier knop */}
                                <div className="pt-2.5 border-t border-gray-200/70 flex items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    {otherWeeks.length === 0 ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 text-[11px] font-semibold">
                                        <Sparkles className="w-3 h-3" />
                                        Enkel deze week!
                                      </span>
                                    ) : (
                                      <span
                                        className="text-[11px] text-gray-soft truncate block"
                                        title={`Ook beschikbaar in: ${otherWeeks.join(', ')}`}
                                      >
                                        +{otherWeeks.length} andere{' '}
                                        {otherWeeks.length === 1 ? 'week' : 'weken'}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onOpenDetail(item)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-purple-accent/10 border border-gray-200 text-xs font-medium text-purple-accent transition-colors"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      Formulier
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Onderaan ook een bevestigknop als er mensen zijn aangevinkt */}
                      {selectedCount > 0 && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            disabled={isSavingThisWeek}
                            onClick={() => handleConfirmAssignment(week)}
                            className="bg-[#1F4E37] hover:bg-[#1F4E37]/90 text-white font-semibold rounded-xl px-6"
                          >
                            {isSavingThisWeek ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Plaatsing opslaan...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Bevestig plaatsing in {week} ({selectedCount})
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* DEEL 3 (optioneel): Personen die voor deze week beschikbaar waren maar al in een andere week zitten */}
                    {assignedElsewhere.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-soft mb-2 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" />
                          Reeds ingedeeld in een andere week ({assignedElsewhere.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assignedElsewhere.map((person) => {
                            const item = person.primary;
                            return (
                              <button
                                key={getPersonKey(item)}
                                type="button"
                                onClick={() => onOpenDetail(item)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200/80 text-xs text-gray-600 transition-colors"
                              >
                                <span className="font-medium text-charcoal/80">{item.naam}</span>
                                <span className="text-[11px] text-green-700 font-semibold">
                                  → {person.toegewezenReis}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
