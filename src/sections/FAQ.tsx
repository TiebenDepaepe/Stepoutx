import { useEffect, useRef, useState } from 'react';
import { Plus, X, Sparkles, Star } from 'lucide-react';

const faqs = [
  {
    question: 'Voor wie is StepOut?',
    answer:
      'StepOut is voor jongeren tussen de 18 en 25 jaar die op zoek zijn naar avontuur, persoonlijke groei en nieuwe connecties. Je hoeft niet extrovert of super sportief te zijn - we zoeken mensen die openstaan voor nieuwe ervaringen.',
  },
  {
    question: 'Is het veilig om te liften en bij mensen te overnachten?',
    answer:
      'Veiligheid is onze hoogste prioriteit. We liften altijd in groepen van minimaal twee personen, en onze ervaren begeleiders kennen de routes en procedures. We hebben ook altijd een back-up plan met noodbudget voor accommodatie.',
  },
  {
    question: 'Hoe worden de groepen samengesteld?',
    answer:
      'We streven naar diverse groepen met een mix van persoonlijkheden, achtergronden en ervaringen. Voor vertrek is er een kennismaking zodat je alvast wat mensen leert kennen.',
  },
  {
    question: 'Wat gebeurt er na de reis?',
    answer:
      'Na de reis word je lid van de StepOut-community! Je krijgt toegang tot onze online groep waar je in contact blijft met mede-deelnemers, uitnodigingen voor reunies ontvangt, en als eerste hoort over nieuwe reizen.',
  },
  {
    question: 'Waarom kost de reis €450?',
    answer:
      'Je betaalt niet voor transport of luxe hotels, maar voor de volledige ervaring. Je reist zes dagen in een kleine groep van zes jongeren, met persoonlijke begeleiding door een begeleider. Het programma is op voorhand uitgewerkt, er zitten activiteiten en eatbudget in, en er is altijd een noodplan. Ik geef jullie de meest unieke ervaring: zes dagen samen op pad, uit je comfortzone, met mensen die je nog niet kent, maar waarschijnlijk nooit meer vergeet.',
  },
  {
    question: 'Vanaf welke leeftijd kan ik deelnemen?',
    answer:
      'Onze reizen zijn voor jongeren van 18 tot 25 jaar. Ben je net 17 maar al volwassen genoeg? Neem contact met ons op, we kijken graag mee.',
  },
  {
    question: 'Moet ik extravert zijn om mee te doen?',
    answer:
      'Absoluut niet! We hebben juist aangetroffen dat een mix van introverte en extraverte deelnemers de beste groepsdynamiek geeft. Er is ruimte voor ieders persoonlijkheid en tempo.',
  },
  {
    question: 'Moet ik avontuurlijk of sportief zijn?',
    answer:
      'Je hoeft geen atleet te zijn! De activiteiten zijn toegankelijk voor verschillende niveaus. Het draait meer om de bereidheid om nieuwe dingen te proberen dan om fysieke prestaties.',
  },
];

interface FAQItemProps {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}

const FAQItem = ({ faq, isOpen, onToggle, index, isVisible }: FAQItemProps) => {
  return (
    <div
      className={`border-b border-charcoal/20 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 md:py-5 flex items-center justify-between text-left group"
      >
        <span className="text-base md:text-lg font-medium text-charcoal pr-4 group-hover:text-purple-accent transition-colors">
          {faq.question}
        </span>
        <div
          className={`w-8 h-8 rounded-full border-2 border-charcoal/30 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isOpen ? 'bg-charcoal border-charcoal rotate-45' : 'group-hover:border-charcoal'
          }`}
        >
          {isOpen ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Plus className="w-4 h-4 text-charcoal" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-charcoal/70 leading-relaxed pr-12">{faq.answer}</p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(4); // Open the pricing FAQ by default
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

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-8 md:left-16">
        <Star className="w-8 h-8 text-charcoal/15" />
      </div>
      <div className="absolute top-32 left-16 md:left-24">
        <Star className="w-5 h-5 text-charcoal/10" />
      </div>
      <div className="absolute top-24 right-12 md:right-24">
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="opacity-20">
          <path
            d="M10 10L30 30M30 10L10 30"
            stroke="#1D1D1D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-charcoal/20 rounded-full text-sm font-medium text-charcoal mb-6">
            <Sparkles className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            Heb je vragen?
          </h2>
          <p className="text-charcoal/70">
            Hier zijn de meest voorkomende vragen en hun antwoord om jouw avontuur zo duidelijk mogelijk te maken!
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-3xl">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
