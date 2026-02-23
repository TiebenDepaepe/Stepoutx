import { useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, ArrowLeft, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Dit was de meest leerrijke en avontuurlijke reis die ik ooit heb gedaan. Je leert je comfortzone achter je te laten en amuseert je tegelijk te pletter.",
    author: 'Lawrence Penne',
    location: 'Sint-Niklaas',
    age: '21 jaar',
    rating: 5,
  },
  {
    quote: "Voor mij was StepOut een unieke ervaring. Het gaat niet alleen om uit je comfortzone stappen, maar ook om het beleven van geweldige momenten die je tijdens een gewone vakantie niet snel zou meemaken. Ik heb enorm veel bijgeleerd, ook over mezelf. Ik zou het echt iedereen aanraden!",
    author: 'Nicole Aguilera',
    location: 'Wilrijk',
    age: '23 jaar',
    rating: 5,
  },
  {
    quote: "Heel leuke en originele manier om nieuwe mensen te leren kennen!",
    author: 'Mauro Devos',
    location: 'Roeselare',
    age: '24 jaar',
    rating: 5,
  },
  {
    quote: "Super leuke ervaringen! Nieuwe avonturen, en geweldige mensen leren kennen!",
    author: 'Emma Demolder',
    location: 'Aarschot',
    age: '20 jaar',
    rating: 5,
  },
  {
    quote: "Ik heb zo een onvergetelijke tijd beleefd!!! Je stapt uit je comfortzone door nieuwe mensen te leren kennen en doet leuke activiteiten en praaachtige wandelingen. En het belangrijkste: je houdt er supermooie vriendschappen aan over xoxo",
    author: 'Luna Ozturk',
    location: 'Gent',
    age: '18 jaar',
    rating: 5,
  },
  {
    quote: "Met zes mensen liftte we door Nederland met de leukste activiteiten tussenin en groeiden we als groep snel naar elkaar toe. Het was spannend, verbindend en voor mij echt een onvergetelijk avontuur.",
    author: 'Antwan Teirbrood',
    location: 'Antwerpen',
    age: '18 jaar',
    rating: 5,
  }
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
          <div className="relative min-h-[100px] flex items-center justify-center mb-8">
            <p className="text-xl md:text-2xl text-charcoal text-center leading-relaxed font-medium">
              "{testimonials[currentIndex].quote}"
            </p>
          </div>

          {/* Author */}
          <div className="text-center">
            <p className="font-display font-bold text-charcoal text-lg">
              {testimonials[currentIndex].author}
            </p>
            <p className="text-sm text-charcoal/60">
              {testimonials[currentIndex].location} • {testimonials[currentIndex].age}
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
