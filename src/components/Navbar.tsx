import { useState, useEffect } from 'react';
import { Menu, X, Youtube, Instagram } from 'lucide-react';

// TikTok icon component since lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Tent logo icon
const TentLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5L5 35H15L20 25L25 35H35L20 5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 28H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Info', href: '#over-ons' },
  { name: 'Expedities', href: '#reizen' },
  { name: 'Prijs', href: '#prijs' },
  { name: 'Inschrijven', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-charcoal/10 shadow-sm'
            : 'bg-white border-b border-charcoal/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
              className="flex items-center gap-2 group"
            >
              <TentLogo className="w-8 h-8 text-charcoal group-hover:text-purple-accent transition-colors" />
              <span className="font-display font-bold text-xl text-charcoal">StepOut!</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`text-sm font-medium transition-colors relative group ${
                    link.name === 'Home' ? 'text-purple-accent' : 'text-charcoal hover:text-purple-accent'
                  }`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://youtube.com/@dariakenis?si=9Iyj3OR-mslEzjyX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@dariahaha._?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/dariahaha._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-soft border border-charcoal/10 p-6 transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`text-lg font-medium py-2 px-4 rounded-xl transition-colors ${
                  link.name === 'Home'
                    ? 'text-purple-accent bg-purple-accent/10'
                    : 'text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-charcoal/10">
            <a
              href="https://youtube.com/@dariakenis?si=9Iyj3OR-mslEzjyX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-12 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@dariahaha._?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-12 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/dariahaha._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-12 rounded-xl border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
