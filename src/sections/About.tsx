import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

const highlights = [
  { icon: Users, label: '6 deelnemers' },
  { icon: Calendar, label: '4 of 6 dagen' },
];

const locations = [
  { name: 'Nederland', color: 'bg-blush' },
  { name: 'Luxemburg', color: 'bg-sky-soft' },
  { name: 'Duitsland', color: 'bg-mint' },
];

export default function About() {
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

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="over-ons"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative max-w-md mx-auto lg:mx-0 px-4 sm:px-0">
              {/* Image container */}
              <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-xl border-4 border-white mb-6">
                <img
                  src="/images/05WCFuh3KzWfk29snTLJSASWjzs.jpg"
                  alt="StepOut groep"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              {/* Labels below image */}
              <div className="flex flex-col items-center gap-3">
                {/* Top row: deelnemers and dagen */}
                <div className="flex flex-wrap justify-center gap-2">
                  {highlights.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white px-4 py-2 rounded-full shadow-lg border border-charcoal/10 flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4 text-purple-accent" />
                        <span className="text-sm font-medium text-charcoal whitespace-nowrap">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Bottom row: locations */}
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <MapPin className="w-4 h-4 text-charcoal/40" />
                  {locations.map((loc) => (
                    <span
                      key={loc.name}
                      className={`${loc.color} px-3 py-1.5 rounded-full text-sm font-medium text-charcoal border border-charcoal/5`}
                    >
                      {loc.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-6 leading-tight">
              Wat houdt een PlotTwist-
              <span className="text-purple-accent">expeditie</span> in?
            </h2>

            <div className="space-y-4 text-charcoal/70 leading-relaxed mb-8">
              <p>
                PlotTwist is een <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">avontuurlijke</span> groepsreis van 4 of 6 dagen voor jongeren van 18 tot 26 jaar. Je reist in een groep van 7 personen: jij, 5 andere jongeren en 1 begeleider. Vooraf word je <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">gematcht</span> op basis van persoonlijkheid, interesses en andere factoren, zodat je in een groep terechtkomt die zo goed mogelijk bij je past.
              </p>
              <p>
                Samen <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">wandelen</span> en <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">liften</span> jullie van plek naar plek. Onderweg doen jullie <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">challenges</span>, groepsopdrachten en verrassende <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">activiteiten</span> zoals kajakken, klimmen, escaperooms, bijlwerpen, stadsspellen en meer. Welke activiteiten op jouw reis komen, ontdek je pas onderweg via de dagplanning. Zo stap je elke dag een beetje het onbekende in.
              </p>
              <p>
                ’s Avonds zoeken jullie samen een <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">slaapplek bij locals</span>. Dat is een vast onderdeel van PlotTwist en zorgt voor spontane ontmoetingen, bijzondere verhalen en momenten die je niet snel vergeet.
              </p>
              <p className="font-medium text-charcoal">
                Na de reis blijf je deel van de <span className="font-semibold text-purple-accent">PlotTwist-community</span>, waar je elkaar opnieuw kan zien, reünies kan afspreken en nieuwe avonturen kan beleven. Want bij PlotTwist stopt het avontuur niet wanneer de reis eindigt.
              </p>
            </div>

            {/* CTA Button */}
            <button onClick={scrollToContact} className="btn-primary group">
              Schrijf je hier in
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
