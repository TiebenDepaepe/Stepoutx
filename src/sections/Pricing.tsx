import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Compass,
  Home,
  ShieldCheck,
  Ticket,
  Utensils,
  Flame,
  ClipboardCheck,
  Heart,
  Gift,
  ChevronDown,
  Info,
  type LucideIcon,
} from 'lucide-react';

interface IncludedBlock {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
}

const includedBlocks: IncludedBlock[] = [
  {
    icon: Sparkles,
    title: 'Geen enkele expeditie is hetzelfde',
    subtitle: 'Jouw verhaal bestaat maar een keer.',
    description:
      'Iedere groep krijgt een eigen route, met andere plekken, ontmoetingen en verrassingen. De basis van het avontuur blijft hetzelfde, maar hoe de reis verloopt, is telkens anders. Je boekt dus geen standaardroute die iedere week opnieuw wordt afgewerkt.',
  },
  {
    icon: UserCheck,
    title: 'Een groep die bewust is samengesteld',
    subtitle: 'Geen namen uit een hoed trekken.',
    description:
      'Daria en haar team lezen persoonlijk de inschrijvingen en stellen de groepen zorgvuldig samen. We kijken verder dan alleen leeftijd. De bedoeling is een fijne mix van persoonlijkheden die samen op avontuur kunnen gaan. Natuurlijk kan niemand een perfecte klik garanderen.',
  },
  {
    icon: Compass,
    title: 'Een route die je vooraf niet kent',
    subtitle: 'Niet alles weten is net het leukste.',
    description:
      'We bereiden de route voor, maar de exacte bestemmingen blijven geheim. Zo ontdek je onderweg waar je terechtkomt. Geen voorspelbaar reisprogramma dat je vooraf al volledig op Google kunt bekijken.',
  },
  {
    icon: Home,
    title: 'Slapen bij locals',
    subtitle: 'Bijzondere ontmoetingen onderweg.',
    description:
      "Slapen bij locals is een van de unieke onderdelen van PlotTwist. We onderzoeken en testen vooraf in welke regio's dit mogelijk is. De exacte slaapplekken liggen niet vast, maar dat betekent niet dat je er alleen voor staat. Je wordt tijdens het zoeken begeleid en ondersteund door je PlotTwist-leader. Zo combineren we een goed voorbereid avontuur met spontane ontmoetingen en onverwachte ervaringen.",
  },
  {
    icon: ShieldCheck,
    title: 'Een vaste PlotTwist-leader',
    subtitle: 'Je staat er niet alleen voor.',
    description:
      'Een vaste begeleider reist gedurende de hele expeditie mee, ondersteunt de groep en helpt het avontuur in goede banen te leiden. Zo hoef je niet zelf een volledige groepsreis te organiseren.',
  },
  {
    icon: Ticket,
    title: 'Minstens 3 activiteiten inbegrepen',
    subtitle: 'Niet telkens extra bijbetalen.',
    description:
      'Tijdens je expeditie zijn minstens 3 georganiseerde activiteiten inbegrepen in de prijs. Welke activiteiten dat precies zijn, hangt af van de reis en de route.',
  },
  {
    icon: Utensils,
    title: 'Avondeten is geregeld',
    subtitle: 'Samen eten, zonder extra rekening.',
    description:
      'Het avondeten is inbegrepen. Zo kan de groep samen de dag afsluiten zonder elke avond apart restaurantkosten te moeten verdelen. Ontbijt en lunch zijn niet inbegrepen.',
  },
  {
    icon: Flame,
    title: 'Challenges en avondspellen',
    subtitle: 'De onverwachte momenten maken het verhaal.',
    description:
      "Onderweg en 's avonds voorzien we challenges en spellen om samen plezier te maken en elkaar beter te leren kennen.",
  },
  {
    icon: Gift,
    title: "Extra's: PlotTwist shirts + sportrepen",
    subtitle: 'Een blijvend aandenken en energie voor onderweg.',
    description:
      'Elke deelnemer krijgt een exclusief PlotTwist T-shirt en sportrepen voor onderweg tijdens de expeditie.',
  },
  {
    icon: ClipboardCheck,
    title: 'Elke expeditie, persoonlijk voorbereid',
    subtitle: 'Achter elke PlotTwist zit veel meer dan je denkt.',
    description:
      'Achter de schermen bereiden we iedere expeditie zorgvuldig voor. We lezen je antwoorden, proberen te begrijpen wie je bent en bekijken bij welke groep je het beste past. Daarnaast werken we voor elke reis een unieke route, activiteiten en verrassingen uit. Alles met een doel: een onvergetelijke week beleven met mensen waarmee het hopelijk ook na de reis blijft klikken.',
  },
  {
    icon: Heart,
    title: 'Een community die blijft groeien',
    subtitle: 'Jouw PlotTwist stopt niet na 6 dagen.',
    description:
      'Ook na je expeditie ben je welkom in onze PlotTwist-community. We organiseren maandelijks reunies waar je vrijblijvend aan kunt deelnemen. Een leuke kans om je reisgenoten terug te zien, nieuwe mensen te ontmoeten en samen nieuwe herinneringen te maken. (Momenteel telt onze community al meer dan 100 leden!)',
  },
];

export default function Pricing() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleBlock = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="prijs"
      ref={sectionRef}
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 1. Bovenste prijsblok */}
          <div className="relative rounded-3xl bg-[#1F4E37] text-white p-8 sm:p-10 md:p-12 shadow-xl overflow-hidden mb-12 md:mb-16">
            {/* Subtiele mintkleurige achtergrond-accenten */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-mint/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-mint/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              {/* Klein label bovenaan */}
              <span className="inline-block px-4 py-1.5 rounded-full bg-mint/15 border border-mint/30 text-mint text-xs sm:text-sm font-display font-bold tracking-wider uppercase mb-5">
                JOUW PLOTTWIST EXPEDITIE
              </span>

              {/* Grote prijs + per persoon · incl. btw */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:items-baseline gap-1 sm:gap-3 mb-5">
                <span className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-white tracking-tight leading-none">
                  €450
                </span>
                <span className="text-sm sm:text-base text-mint/85 italic">
                  per persoon · incl. btw
                </span>
              </div>

              {/* Daaronder in het vet */}
              <p className="text-lg sm:text-xl md:text-2xl font-display font-bold text-mint mb-3">
                6 dagen. 8 onbekenden. 1 avontuur.
              </p>

              {/* Beschrijving */}
              <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
                Geen massale groepsreis, maar een unieke expeditie waarin je elkaar echt leert kennen.
              </p>
            </div>
          </div>

          {/* 2. Wat zit er allemaal in? */}
          <div className="mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#1F4E37] text-center mb-6 md:mb-8">
              Wat zit er allemaal in?
            </h2>

            <div className="space-y-3">
              {includedBlocks.map((block, index) => {
                const Icon = block.icon;
                const isOpen = openIndex === index;

                return (
                  <div
                    key={block.title}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? 'bg-mint/40 border-[#1F4E37]/30 shadow-sm'
                        : 'bg-white border-charcoal/10 hover:border-[#1F4E37]/25 hover:bg-mint/15'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleBlock(index)}
                      aria-expanded={isOpen}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3.5 sm:gap-4 text-left cursor-pointer"
                    >
                      {/* Links icoon */}
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isOpen
                            ? 'bg-[#1F4E37] text-mint'
                            : 'bg-mint text-[#1F4E37]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Titel en ondertitel */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-display font-bold text-charcoal leading-snug">
                          {block.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-charcoal/60 mt-0.5 leading-snug">
                          {block.subtitle}
                        </p>
                      </div>

                      {/* Rechts pijltje */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#1F4E37] text-white rotate-180'
                            : 'bg-mint/70 text-[#1F4E37]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </button>

                    {/* Uitklapbare uitleg */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 pl-[3.85rem] sm:pl-[4.5rem] pr-4 sm:pr-8">
                          <p className="text-xs sm:text-sm md:text-base text-charcoal/80 leading-relaxed">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Goed om te weten – Prijsoverzicht */}
          <div className="rounded-3xl bg-mint/60 border border-[#1F4E37]/15 p-6 sm:p-8 md:p-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#1F4E37] text-mint flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1F4E37]">
                Goed om te weten
              </h3>
            </div>

            {/* Prijzen op twee overzichtelijke regels */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#1F4E37]/10 divide-y divide-charcoal/10 mb-5">
              <div className="flex items-center justify-between gap-4 pb-3.5 sm:pb-4">
                <span className="text-sm sm:text-base md:text-lg font-display font-bold text-charcoal">
                  PlotTwist-expeditie (6 dagen)
                </span>
                <span className="text-xl sm:text-2xl font-display font-bold text-[#1F4E37] shrink-0">
                  €450
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3.5 sm:pt-4">
                <span className="text-sm sm:text-base md:text-lg font-display font-bold text-charcoal">
                  Italie + busvervoer (7 dagen)
                </span>
                <span className="text-xl sm:text-2xl font-display font-bold text-[#1F4E37] shrink-0">
                  €595
                </span>
              </div>
            </div>

            {/* Korte toelichting */}
            <p className="text-sm sm:text-base text-charcoal/85 font-medium leading-relaxed mb-2">
              Voor Italie komt er €145 bij voor het georganiseerde busvervoer heen en terug.
            </p>

            {/* Kleinere tekst daaronder */}
            <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">
              Ontbijt, lunch en persoonlijke uitgaven zijn niet inbegrepen. Alle vermelde prijzen zijn inclusief btw.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
