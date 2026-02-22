import { useEffect, useRef, useState } from 'react';
import { Zap, Users, Heart, Compass } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Avontuur met structuur',
    description: (
      <>
        Je trekt <span className="font-semibold text-charcoal bg-green-200/70 rounded px-1">zes dagen</span> op pad met een kleine groep. Elke dag krijg je een nieuwe briefing met <span className="font-semibold text-charcoal bg-green-200/70 rounded px-1">challenges, routes en opdrachten</span>.
      </>
    ),
    bgColor: 'bg-mint',
    accentColor: 'bg-green-400',
    number: '01',
  },
  {
    icon: Users,
    title: 'Sterke groepsdynamiek',
    description: (
      <>
        Je reist met <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">vijf andere jongeren</span> die bewust voor dit avontuur kiezen. Samen <span className="font-semibold text-charcoal bg-purple-200/70 rounded px-1">liften, eten en uitdagingen</span> oplossen zorgt voor snelle, echte connecties.
      </>
    ),
    bgColor: 'bg-lavender',
    accentColor: 'bg-purple-400',
    number: '02',
  },
  {
    icon: Heart,
    title: 'Persoonlijke uitdagingen',
    description: (
      <>
        Dagelijks krijg je sociale en persoonlijke challenges. Geen extreme opdrachten, maar <span className="font-semibold text-charcoal bg-pink-200/70 rounded px-1">kleine stappen buiten je comfortzone</span>.
      </>
    ),
    bgColor: 'bg-blush',
    accentColor: 'bg-pink-400',
    number: '03',
  },
  {
    icon: Compass,
    title: 'Begeleid door StepOut',
    description: (
      <>
        Een <span className="font-semibold text-charcoal bg-blue-200/70 rounded px-1">StepOut-leader</span> reist met jullie mee. Die zorgt voor <span className="font-semibold text-charcoal bg-blue-200/70 rounded px-1">veiligheid, structuur</span> en de juiste sfeer in de groep.
      </>
    ),
    bgColor: 'bg-sky-soft',
    accentColor: 'bg-blue-400',
    number: '04',
  },
];

export default function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-8 md:left-16 opacity-30">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <path d="M10 10C25 20 30 40 20 55" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-40 right-12 opacity-20">
        <div className="w-4 h-4 rounded-full bg-charcoal/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
            Hoe ziet een <span className="text-purple-accent">StepOut</span>-reis eruit?
          </h2>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Een unieke ervaring die je uitdaagt, verbindt en laat groeien
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`group relative ${feature.bgColor} rounded-3xl p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Number badge */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 ${feature.accentColor} rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {feature.number}
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-charcoal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-charcoal mb-3 group-hover:text-purple-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <Icon className="w-16 h-16" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
