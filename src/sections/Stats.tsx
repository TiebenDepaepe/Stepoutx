import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 5, suffix: '', label: 'Succesvolle reizen gepland' },
  { value: 30, suffix: '', label: 'Super leuke deelnemers' },
  { value: 100, suffix: '+', label: 'Herinneringen voor altijd' },
  { value: 50, suffix: '+', label: 'Activiteiten uitdagingen' },
];

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

interface StatItemProps {
  stat: (typeof stats)[0];
  index: number;
  isVisible: boolean;
}

const StatItem = ({ stat, index, isVisible }: StatItemProps) => {
  const count = useAnimatedCounter(stat.value, 2000, isVisible);

  return (
    <div
      className={`text-center transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-1">
        {count}
        {stat.suffix}
      </div>
      <p className="text-xs md:text-sm text-charcoal/60">{stat.label}</p>
    </div>
  );
};

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-mint relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -my-8 relative">
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {stats.map((stat, index) => (
              <StatItem
                key={stat.label}
                stat={stat}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
