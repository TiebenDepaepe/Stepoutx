import { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink, Youtube } from 'lucide-react';

const trips = [
  {
    id: 1,
    title: 'Expeditie Nederland',
    shortDesc: '6 onbekenden, liften, bij vreemden slapen. Pure avontuur.',
    image: '/images/05WCFuh3KzWfk29snTLJSASWjzs.jpg',
    videoUrl: 'https://youtu.be/LI2TVbdg-0I?si=CfmQLiVZFYQKg-_K',
  },
  {
    id: 2,
    title: 'Backpacken met onbekenden',
    shortDesc: '7 onbekenden, grenzen verleggen, nieuwe vriendschappen.',
    image: '/images/MVsfi8VMFgYmg2E46x4oNhPzNs.jpg',
    videoUrl: 'https://youtu.be/pROTltVDn7o?si=HKNbi3d7B0VYDWf9',
  },
];

interface TripCardProps {
  trip: (typeof trips)[0];
  index: number;
  isVisible: boolean;
}

const TripCard = ({ trip, index, isVisible }: TripCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (trip.videoUrl) {
      window.open(trip.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`group cursor-pointer transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* YouTube badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
          <Youtube className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-charcoal">Bekijk video</span>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
            <Play className="w-6 h-6 text-red-600 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Hover overlay with link indicator */}
        <div
          className={`absolute inset-0 bg-charcoal/30 transition-opacity duration-300 flex items-end justify-start p-4 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-charcoal">
            <ExternalLink className="w-3.5 h-3.5" />
            Open op YouTube
          </span>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-display font-bold text-charcoal mb-1 group-hover:text-purple-accent transition-colors">
        {trip.title}
      </h3>
      <p className="text-charcoal/60 text-sm">
        {trip.shortDesc}
      </p>
    </div>
  );
};

export default function Trips() {
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

  return (
    <section
      id="reizen"
      ref={sectionRef}
      className="py-16 md:py-20 bg-white relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-2">
            Bekijk onze <span className="text-purple-accent">avonturen</span> op YouTube
          </h2>
          <p className="text-charcoal/60 text-sm">
            Een kijkje in onze reizen en de herinneringen die we maakten
          </p>
        </div>

        {/* Trips Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {trips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
