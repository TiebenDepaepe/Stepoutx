import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Users, Sun, CalendarDays } from 'lucide-react';

const details = [
  { icon: Users, text: 'Voor jongeren van 20–26 jaar' },
  { icon: Sun, text: 'Voor september - november' },
  { icon: CalendarDays, text: 'Inschrijvingen openen op 10 augustus' },
];

export default function ComingSoon() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pt-4 md:pt-8 pb-16 md:pb-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-16 left-12 md:left-24 opacity-30">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-20 right-24 opacity-20">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/10 rounded-full text-sm font-medium text-charcoal mb-6">
              <Sparkles className="w-4 h-4 text-purple-accent" />
              NIEUW
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
              4-daagse expedities
            </h2>
            <p className="text-charcoal/50 text-lg">
              vrijdag t.e.m. maandag
            </p>
          </div>

          {/* Card */}
          <div className="bg-mint rounded-3xl p-8 md:p-10 shadow-soft border border-charcoal/5">
            <div className="space-y-4">
              {details.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${300 + i * 150}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-purple-accent" />
                  </div>
                  <span className="text-charcoal/70 text-sm leading-relaxed font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-6 mt-6 border-t border-charcoal/10">
              <a
                href="#nieuwsbrief"
                className="w-full btn-primary justify-center group"
              >
                Blijf op de hoogte
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-charcoal/50 mt-3">
                Schrijf je in voor de nieuwsbrief
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
