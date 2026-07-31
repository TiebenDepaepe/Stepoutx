import { useEffect, useRef } from 'react';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';

const includedItems = [
  {
    text: 'Een zorgvuldig gematchte groep van 7 deelnemers',
    subtext: 'Bij PlotTwist is het matchen van de groep een prioriteit. We kijken echt naar wie jij bent, je persoonlijkheid en wat je zoekt in de reis om zo een passende groep samen te stellen.'
  },
  { text: 'Een volledig uitgewerkte planning voor elke dag' },
  { text: 'Vooraf uitgestippelde wandelroutes' },
  { text: 'Een vaste begeleider tijdens de volledige reis' },
  { text: 'Begeleiding en een duidelijke aanpak voor het liften' },
  { text: 'Begeleiding bij het zoeken naar een slaapplek bij locals' },
  { text: 'Minstens drie avontuurlijke activiteiten onderweg' },
  { text: 'Groepsspellen en persoonlijke challenges op maat' },
  { text: 'Avondeten tijdens de volledige expeditie' },
  { text: 'Een exclusief PlotTwist T-shirt' },
  { text: 'Alle organisatie, reservaties en ondersteuning bij problemen' },
  { text: 'Toegang tot de PlotTwist-community na de reis' }
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animations if needed, otherwise handled by transition-all
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="prijs" ref={sectionRef} className="pt-12 md:pt-16 pb-20 md:pb-28 bg-mint relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-16 left-12 md:left-24 opacity-30">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-20 right-24 opacity-20">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/10 rounded-full text-sm font-medium text-charcoal mb-6">
              <Sparkles className="w-4 h-4 text-purple-accent" />
              PRIJS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-charcoal mb-4">
              Jouw volgende avontuur
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl md:text-6xl font-display font-bold text-purple-accent">€450</span>
            </div>
          </div>

          {/* Single Pricing Card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-soft border border-charcoal/5">
            {/* Included Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-charcoal">Wat is inbegrepen?</h3>
              </div>
              
              <ul className="space-y-4">
                {includedItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal font-medium text-sm leading-relaxed">{item.text}</p>
                      {item.subtext && (
                        <p className="text-xs text-charcoal/60 mt-1 italic leading-relaxed">
                          ({item.subtext})
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Niet inbegrepen Section */}
            <div className="border-t border-charcoal/10 pt-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-charcoal/70">Wat is niet inbegrepen?</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal/70 text-sm leading-relaxed">De overnachtingen zelf zijn niet vooraf geboekt of inbegrepen</p>
                    <p className="text-xs text-charcoal/50 mt-1 italic">
                      (Samen met de groep ga je iedere avond op zoek naar een slaapplek bij locals.)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal/70 text-sm leading-relaxed">Ontbijt en lunch tijdens de expeditie</p>
                    <p className="text-xs text-charcoal/50 mt-1 italic">
                      (Hou hiervoor ongeveer €30 budget over voor de volledige reis.)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal/70 text-sm leading-relaxed">Persoonlijke uitgaven</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a 
                href="#contact" 
                className="w-full btn-primary justify-center group"
              >
                Schrijf je nu in
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-charcoal/50 mt-3">
                Inschrijvingen geopend enkel voor 10 t.e.m. 15 augustus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
