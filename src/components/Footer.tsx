import { Youtube, Instagram } from 'lucide-react';

// TikTok icon component
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mint py-12 md:py-16 border-t border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <a href="#home" className="flex items-center gap-2 group">
              <TentLogo className="w-8 h-8 text-charcoal group-hover:text-purple-accent transition-colors" />
              <span className="font-display font-bold text-xl text-charcoal">StepOut!</span>
            </a>
            <p className="text-sm text-charcoal/60">
              © {currentYear} Made by Stepout!
            </p>
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
              href="https://www.instagram.com/dariahaha._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
