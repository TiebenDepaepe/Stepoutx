import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { subscribeToNewsletter } from '@/services/nieuwsbriefService';

const emailSchema = z.string().email('Vul een geldig e-mailadres in');

export default function Newsletter() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    const { success, error: submitError, isDuplicate } = await subscribeToNewsletter(email);

    if (success) {
      setIsSuccess(true);
      setEmail('');
    } else if (isDuplicate) {
      setError('Dit e-mailadres is al ingeschreven.');
    } else {
      setError(submitError?.message || 'Er is iets misgegaan. Probeer het later opnieuw.');
    }

    setIsSubmitting(false);
  };

  return (
    <section id="nieuwsbrief" ref={sectionRef} className="py-20 md:py-28 bg-mint relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-32 right-[15%] animate-float opacity-60">
        <div className="w-3 h-3 rounded-full bg-charcoal/20" />
      </div>
      <div className="absolute top-48 right-[25%] animate-float animation-delay-200 opacity-40">
        <div className="w-2 h-2 rounded-full bg-charcoal/20" />
      </div>
      <div className="absolute top-24 left-[10%] animate-float animation-delay-300 opacity-50">
        <div className="w-4 h-4 rounded-full bg-charcoal/15" />
      </div>

      {/* Decorative hand-drawn squiggles */}
      <div className="absolute top-40 left-[5%] opacity-20">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
          <path d="M5 20C15 10 25 30 35 20C45 10 55 30 55 20" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80V40C120 60 240 70 360 60C480 50 600 20 720 15C840 10 960 30 1080 40C1200 50 1320 50 1380 50H1440V80H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-charcoal/20 rounded-full text-sm font-medium text-charcoal mb-6">
            <Sparkles className="w-4 h-4" />
            NIEUWSBRIEF
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
            Blijf op de hoogte
          </h2>
          <p className="text-charcoal/70 mb-8 max-w-lg mx-auto">
            Schrijf je in voor onze nieuwsbrief en ontvang als eerste updates over nieuwe reizen en avonturen.
          </p>

          {/* Form or Success */}
          {isSuccess ? (
            <div className="flex items-center justify-center gap-3 text-charcoal">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-medium">Bedankt! Je bent ingeschreven voor de nieuwsbrief.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="jouw@email.com"
                  className={`flex-1 px-4 py-3 bg-white rounded-xl border-2 outline-none transition-all ${
                    error
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-charcoal/10 focus:border-charcoal/30 focus:ring-2 focus:ring-purple-accent/20'
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Bezig...' : 'Inschrijven'}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-left">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
