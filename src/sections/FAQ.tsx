import { useEffect, useRef, useState } from 'react';
import { Plus, X, Sparkles, Star } from 'lucide-react';

const faqs = [
  {
    question: 'Voor wie is PlotTwist?',
    answer:
      'PlotTwist is er voor jongeren van 18 tot 26 jaar die zin hebben in avontuur, nieuwe mensen willen leren kennen en openstaan voor een reis die net iets anders loopt dan een gewone vakantie. Je hoeft niet de meest sociale, sportieve of ervaren reiziger te zijn. Zolang je nieuwsgierig bent, openstaat voor nieuwe ervaringen en durft mee te stappen in het onbekende, pas je bij PlotTwist.',
  },
  {
    question: 'Is het veilig om te liften en bij mensen te overnachten?',
    answer:
      'Veiligheid is onze hoogste prioriteit. We liften altijd in groepen van minimaal twee personen, en onze ervaren begeleiders kennen de routes en procedures. Moest slaapplek niet lukken wordt er gekeken naar het back-up plan.',
  },
  {
    question: 'Hoe worden de groepen samengesteld?',
    answer: (
      <div className="space-y-3">
        <p>
          Dit is zeer belangrijk voor ons! Bij PlotTwist draait alles om de mensen met wie je op avontuur vertrekt. Daarom besteden we veel aandacht aan het samenstellen van de groepen.
        </p>
        <p>
          Vooraf vult iedereen een vragenlijst in waarin we peilen naar je persoonlijkheid, interesses, verwachtingen en hoe je in een groep staat. Op basis daarvan stellen we de groepen zorgvuldig samen.
        </p>
        <p>
          We kijken daarbij niet alleen naar gelijkenissen, maar ook naar verschillen. We willen geen groep waarin iedereen exact hetzelfde is, maar juist een leuke mix van persoonlijkheden die elkaar aanvullen. Denk aan spontane avonturiers, rustige denkers, grappenmakers en mensen die elkaar uit hun comfortzone halen.
        </p>
        <p>
          We houden ook rekening met leeftijd, interesses en de groepsdynamiek. Ons doel is dat iedereen zich op zijn gemak kan voelen, zichzelf kan zijn en aansluiting vindt bij de anderen.
        </p>
        <p>
          <strong className="font-semibold text-charcoal">
            We kunnen natuurlijk nooit garanderen dat iedereen meteen beste vrienden wordt.
          </strong>{' '}
          Maar we doen er alles aan om groepen samen te stellen waarin de kans op een sterke klik zo groot mogelijk is.
        </p>
        <p>
          En misschien is dat net het mooiste aan PlotTwist: je vertrekt met zeven onbekenden en komt terug met mensen die je anders misschien nooit had leren kennen!
        </p>
      </div>
    ),
  },
  {
    question: 'Wat gebeurt er na de expeditie?',
    answer:
      'Na de expeditie word je lid van de PlotTwist-community! Je krijgt toegang tot onze online groep waar je in contact blijft met mede-deelnemers, uitnodigingen voor reunies ontvangt, en als eerste hoort over nieuwe expedities.',
  },
  {
    question: 'Waar betaal je precies voor?',
    answer: (
      <div className="space-y-4">
        <p>
          Bij PlotTwist betaal je niet zomaar voor een reis, maar voor een volledig georganiseerd avontuur waarbij jij zelf niets hoeft te plannen!
        </p>

        <div>
          <p className="font-semibold text-charcoal mb-2">Wat zit er allemaal inbegrepen in de prijs?</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="font-semibold text-charcoal">Een volledig uitgewerkte expeditie:</strong>{' '}
              Wij stippelen de route uit, zoeken geschikte locaties en bereiden alles achter de schermen voor.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Minstens 3 betaalde activiteiten:</strong>{' '}
              Denk aan kajakken, klimmen, een hoogteparcours of andere avontuurlijke activiteiten.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Een zorgvuldig samengestelde groep:</strong>{' '}
              We nemen de tijd om 7 onbekenden te matchen op basis van persoonlijkheid, interesses en groepsdynamiek.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Een vaste begeleider:</strong>{' '}
              Tijdens de volledige expeditie reist er een PlotTwist-leader met jullie mee.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Avondeten:</strong>{' '}
              Elke avond voorzien wij het eten voor de groep.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Challenges en avondspellen:</strong>{' '}
              Dagelijkse uitdagingen, verrassingen en spelletjes die jullie avontuur extra bijzonder maken.
            </li>
            <li>
              <strong className="font-semibold text-charcoal">Organisatie en ondersteuning:</strong>{' '}
              Wij regelen de voorbereiding, reserveringen, materialen en ondersteuning tijdens de reis.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-charcoal mb-1">Wat is niet inbegrepen?</p>
          <p>
            Ontbijt, lunch en persoonlijke uitgaven betaal je zelf. Ook het vervoer gebeurt op avontuurlijke wijze: jullie liften en wandelen, en zoeken samen met de groep een slaapplek bij locals.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-charcoal">Waarom kost het dan €450?</p>
          <p>
            Omdat er achter die zes dagen veel meer zit dan wat je onderweg ziet. Van het samenstellen van de groepen en het uitstippelen van de routes tot de activiteiten, begeleiding en volledige voorbereiding.
          </p>
          <p>
            Je betaalt dus niet voor luxe hotels of georganiseerd busvervoer. Je betaalt voor een avontuurlijke ervaring die wij van begin tot einde voorbereiden, maar waarin jullie zelf het avontuur beleven.
          </p>
          <p className="font-medium text-charcoal pt-1">
            Wij zorgen voor de voorbereiding, de activiteiten en de begeleiding. Jullie zorgen voor de verhalen!
          </p>
        </div>
      </div>
    ),
  },
  {
    question: 'Vanaf welke leeftijd kan ik deelnemen?',
    answer:
      'Onze expedities zijn voor jongeren van 18 tot 26 jaar.',
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
  {
    question: 'Hoe ziet een dagplanning er uit?',
    answer: (
      <div>
        <p className="mb-4">
          Geen enkele dag is hetzelfde, de exacte planning ontdek je pas stap voor stap tijdens het avontuur. Maar om je een idee te geven van het ritme, zie je hieronder een voorbeeld van hoe een dagplanning eruit kan zien:
        </p>
        <div className="mt-3 max-w-md rounded-2xl overflow-hidden shadow-md border border-charcoal/10">
          <img 
            src="/images/dagplanning.jpg" 
            alt="Voorbeeld dagplanning" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    ),
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
          isOpen ? 'max-h-[2000px] pb-5' : 'max-h-0'
        }`}
      >
        <div className="text-charcoal/70 leading-relaxed pr-12">{faq.answer}</div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // All FAQs closed by default
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
