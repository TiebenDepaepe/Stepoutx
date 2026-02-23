import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

const highlights = [
  { icon: Users, label: '6 deelnemers' },
  { icon: Calendar, label: '6 dagen' },
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
              Wat houdt een StepOut-
              <span className="text-purple-accent">reis</span> in?
            </h2>
            
            <div className="space-y-4 text-charcoal/70 leading-relaxed mb-8">
              <p>
                Je vertrekt <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">zes dagen</span> op pad met een kleine groep van <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">zes jongeren</span> en begeleider <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">Daria</span>. Voor vertrek is er een kennismaking met de groep.
              </p>
              <p>
                Elke ochtend krijg je een briefing met de dagplanning. Die bestaat uit verplaatsingen, sociale en persoonlijke <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">challenges</span>, teamopdrachten en 3 <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">activiteiten</span> zoals klimmen, kajakken, bijlwerpen of een stadsspel.
              </p>
              <p>
                's Avonds zoekt de groep samen een <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">slaapplek</span>. Lukt dat niet, dan is er altijd een <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">back-up</span> met <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">noodbudget</span>.
              </p>
              <p className="font-medium text-charcoal">
                Na de reis word je deel van de <span className="font-semibold text-purple-accent">StepOut-community</span>, hierin vinden maandelijkse activiteiten plaats en kan je weer nieuwe mensen leren kennen.
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
