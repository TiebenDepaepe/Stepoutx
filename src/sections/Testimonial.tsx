import { useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, ArrowLeft, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Je begint spontaan aan het avontuur met onbekenden, die je al snel vrienden kunt noemen. Ik heb me geen enkel moment geforceerd of verplicht gevoeld: alles verliep op een natuurlijke en vanzelfsprekende manier.",
    rating: 5,
  },
  {
    quote: "Perfect om vanaf dag 1 de groep goed te leren kennen en een hechte band te vormen. Ik heb vrienden voor het leven gemaakt en deze reis vergeet ik nooit meer.",
    rating: 5,
  },
  {
    quote: "Een geweldige ervaring! Ik heb niet alleen nieuwe mensen leren kennen, maar ben ook echt uit mijn comfortzone durven stappen dankzij de fantastische groepssfeer. Het was een avontuur dat ik nooit zal vergeten. Zeker een aanrader! Niet twijfelen, gewoon doen!",
    rating: 5,
  },
  {
    quote: "Het was een fantastisch avontuur vol verrassingen! Ik heb zoveel leuke ontmoetingen gehad met onbekenden. Ik zou me zo opnieuw inschrijven!",
    rating: 5,
  },
  {
    quote: "De gastvrijheid van de lokale bewoners heeft mij enorm verbaasd en de toffe sfeer in de groep maakte deze expeditie onvergetelijk!",
    rating: 5,
  },
  {
    quote: "Dit was de meest leerrijke en avontuurlijke expeditie die ik ooit heb gedaan. Je leert je comfortzone achter je te laten en amuseert je tegelijk te pletter.",
    rating: 5,
  },
  {
    quote: "Voor mij was PlotTwist een unieke ervaring. Het gaat niet alleen om uit je comfortzone stappen, maar ook om het beleven van geweldige momenten die je tijdens een gewone vakantie niet snel zou meemaken. Ik heb enorm veel bijgeleerd, ook over mezelf. Ik zou het echt iedereen aanraden!",
    rating: 5,
  },
  {
    quote: "Heel leuke en originele manier om nieuwe mensen te leren kennen!",
    rating: 5,
  },
  {
    quote: "Super leuke ervaringen! Nieuwe avonturen, en geweldige mensen leren kennen!",
    rating: 5,
  },
  {
    quote: "Ik heb zo een onvergetelijke tijd beleefd!!! Je stapt uit je comfortzone door nieuwe mensen te leren kennen en doet leuke activiteiten en praaachtige wandelingen. En het belangrijkste: je houdt er supermooie vriendschappen aan over xoxo",
    rating: 5,
  },
  {
    quote: "Met zes mensen liftte we door Nederland met de leukste activiteiten tussenin en groeiden we als groep snel naar elkaar toe. Het was spannend, verbindend en voor mij echt een onvergetelijk avontuur.",
    rating: 5,
  },
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-16 left-8 md:left-16 opacity-20">
        <Quote className="w-16 h-16" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-mint rounded-3xl p-8 md:p-14 relative transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Quote icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <Quote className="w-6 h-6 text-purple-accent" />
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-8 pt-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          {/* Quote */}
          <div className="relative min-h-[100px] flex items-center justify-center">
            <p className="text-xl md:text-2xl text-charcoal text-center leading-relaxed font-medium">
              "{testimonials[currentIndex].quote}"
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white hover:bg-charcoal hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-charcoal w-6' : 'bg-charcoal/30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white hover:bg-charcoal hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
