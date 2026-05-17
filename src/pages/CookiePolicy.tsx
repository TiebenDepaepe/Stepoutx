import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookiePolicy() {
  const declarationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!declarationRef.current) return;

    const script = document.createElement('script');
    script.id = 'CookieDeclaration';
    script.src =
      'https://consent.cookiebot.com/c3166021-ec08-4844-87e2-0f432ae7de90/cd.js';
    script.type = 'text/javascript';
    script.async = true;
    declarationRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
          Cookiebeleid
        </h1>
        <p className="text-charcoal/70 mb-10 leading-relaxed">
          Op deze pagina vind je een overzicht van alle cookies die op deze
          website worden gebruikt, samen met hun doel en bewaartermijn. Je kan
          jouw toestemming op elk moment intrekken of aanpassen via de knop{' '}
          <strong>Cookie-instellingen</strong> onderaan de pagina.
        </p>
        <div ref={declarationRef} />
      </main>
      <Footer />
    </div>
  );
}
