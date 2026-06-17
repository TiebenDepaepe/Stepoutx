import { Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    Cookiebot?: { renew: () => void };
  }
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);



export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mint py-12 md:py-16 border-t border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <a href="#home" className="flex items-center group">
              <img 
                src="/images/logo.png" 
                alt="Plot Twist Logo" 
                className="h-13 md:h-16 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </a>
            <p className="text-sm text-charcoal/60">
              © {currentYear} Made by Plot Twist
            </p>
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-charcoal/70">
              <Link
                to="/privacybeleid"
                className="hover:text-charcoal hover:underline transition-colors"
              >
                Privacybeleid
              </Link>
              <span aria-hidden="true" className="text-charcoal/30">·</span>
              <Link
                to="/cookiebeleid"
                className="hover:text-charcoal hover:underline transition-colors"
              >
                Cookiebeleid
              </Link>
              <span aria-hidden="true" className="text-charcoal/30">·</span>
              <button
                type="button"
                onClick={() => window.Cookiebot?.renew()}
                className="hover:text-charcoal hover:underline transition-colors"
              >
                Cookie-instellingen
              </button>
            </nav>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://youtube.com/@dariakenis?si=9Iyj3OR-mslEzjyX"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@dariahaha._?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/step_out_x?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-white border-2 border-charcoal/20 flex items-center justify-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
