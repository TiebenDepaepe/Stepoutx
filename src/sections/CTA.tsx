import { useEffect, useRef, useState } from 'react';
import { Mail, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

const responseOptions = [
  {
    icon: CheckCircle,
    title: 'Geselecteerd',
    description: 'Je krijgt een voorstel met datum en groep, en kan je plek bevestigen met een voorschot.',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Clock,
    title: 'Wachtlijst',
    description: 'Je past bij het concept, maar de groep zit vol. Je wordt gecontacteerd als er een plek vrijkomt.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: XCircle,
    title: 'Niet geselecteerd',
    description: 'De reis past op dit moment niet goed bij jou of bij de groep.',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-500',
  },
];

export default function CTA() {
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
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-mint rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
                Klaar om mee te gaan?
              </h2>
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                Je vult het <span className="font-semibold text-charcoal bg-green-200/70 rounded px-1">inschrijfformulier</span> in met een paar vragen over jezelf, je motivatie en je beschikbaarheid. Op basis daarvan stelt Daria de groepen samen.
              </p>
            </div>

            {/* Response Options */}
            <div className="mb-8">
              <p className="text-center text-charcoal/60 mb-6">
                Daarna krijg je altijd een mail met één van deze drie antwoorden:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {responseOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.title}
                      className={`${option.bgColor} rounded-2xl p-5 transition-all duration-500 hover:shadow-lg ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3">
                        <Icon className={`w-5 h-5 ${option.iconColor}`} />
                      </div>
                      <h4 className="font-display font-bold text-charcoal mb-2">{option.title}</h4>
                      <p className="text-sm text-charcoal/70 leading-relaxed">{option.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom note - flat text */}
            <p className="text-center text-sm text-charcoal/60 mb-8">
              Zo blijven de groepen klein en goed samengesteld.
            </p>

            {/* CTA Button at bottom */}
            <div className="text-center">
              <a 
                href="mailto:info@stepout.nl" 
                className="btn-primary inline-flex group text-lg px-8 py-4 whitespace-nowrap"
              >
                <Mail className="w-5 h-5 mr-2" />
                Schrijf je hier in
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
