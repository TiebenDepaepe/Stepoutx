import { useEffect, useRef, useState } from 'react';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';

const includedItems = [
  '6 dagen op reis met een groep van 6 jongeren',
  'Begeleiding door Daria, die de hele reis meegaat',
  'Kennismaking met de groep vóór vertrek',
  'Elke dag een voorbereide dagplanning met briefing',
  'Dagelijkse sociale en persoonlijke challenges',
  'Verplaatsingen te voet of al liftend',
  '2 à 3 betaalde activiteiten tijdens de reis',
  'Eetbudget voor elke dag',
  'Begeleiding bij het zoeken van slaapplekken',
  'Noodbudget voor een hostel als het niet lukt',
  'Toegang tot de StepOut-community na de reis',
];

const notIncludedItems = [
  'Persoonlijk materiaal',
  'Extra snacks of eigen uitgaven',
];

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/10 rounded-full text-sm font-medium text-charcoal mb-6">
              <Sparkles className="w-4 h-4 text-purple-accent" />
              PRIJS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
              6 dagen micro-expeditie
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl md:text-6xl font-display font-bold text-purple-accent">€450</span>
              <span className="text-charcoal/50 text-lg">inclusief eten</span>
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
                <h3 className="text-xl font-display font-bold text-charcoal">Wat zit er in</h3>
              </div>
              
              <ul className="space-y-3">
                {includedItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-charcoal/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Activity examples note */}
              <div className="mt-4 p-3 bg-lavender/50 rounded-xl">
                <p className="text-xs text-charcoal/60">
                  Activiteiten bijvoorbeeld: klimmen, kajakken, bijlwerpen, escaperoom, stadsspel, ragerooom, boulderen, hoogteparcour enzovoort
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-charcoal/10 pt-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-charcoal/70">Wat zit er niet in</h3>
              </div>
              
              <ul className="space-y-2">
                {notIncludedItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-charcoal/50 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <a 
                href="#contact" 
                className="w-full btn-primary justify-center group"
              >
                Reserveer je plek
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-charcoal/50 mt-3">
                Beperkte plekken beschikbaar per reis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
