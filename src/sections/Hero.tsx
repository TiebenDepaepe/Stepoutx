import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';



export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Attempt to autoplay programmatically for better browser compatibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to play programmatically - handles cases where autoPlay attribute fails
    video.play().catch(() => {
      // Autoplay blocked by browser policy - poster will show, user can click to play
      // No additional UI needed per design requirements
    });
  }, []);

  const scrollToOverOns = () => {
    const element = document.querySelector('#over-ons');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="min-h-screen bg-mint pt-20 md:pt-24 relative overflow-hidden"
    >
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
      
      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80V40C120 60 240 70 360 60C480 50 600 20 720 15C840 10 960 30 1080 40C1200 50 1320 50 1380 50H1440V80H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <img 
              src="/images/logo-green.png" 
              alt="Plot Twist Logo" 
              className="h-44 sm:h-60 md:h-80 lg:h-96 w-auto object-contain mb-0" 
            />
            <p className="-mt-4 sm:-mt-6 md:-mt-8 text-lg md:text-xl text-charcoal/70 mb-8 max-w-lg leading-relaxed">
              Een avontuurlijke reis voor jongeren van 18 tot 26 jaar, waar je met onbekenden vertrekt en terugkomt met verhalen, nieuwe connecties en een paar stevige plotwists.
            </p>
            <button onClick={scrollToOverOns} className="btn-primary group">
              Meer info
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Content - Video */}
          <div
            className={`relative transition-all duration-700 delay-200 lg:max-w-[420px] lg:ml-auto ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative">
              {/* Decorative elements around video */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-lavender rounded-full opacity-60 blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blush rounded-full opacity-50 blur-xl" />
              
              {/* Video container with modern frame */}
              <div className="relative">
                {/* Main video frame */}
                <div 
                  className="relative overflow-hidden bg-white shadow-2xl"
                  style={{
                    borderRadius: '40px 40px 20px 20px',
                  }}
                >
                  {/* Top bar decoration */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10 flex items-center px-6 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full aspect-[3/4] object-cover pt-12 cursor-pointer"
                    poster="/images/05WCFuh3KzWfk29snTLJSASWjzs.jpg"
                    onClick={(e) => {
                      const video = e.currentTarget;
                      if (video.paused) {
                        video.play();
                      }
                    }}
                  >
                    <source src="/videos/mBbh6WeyNmkciEOtfI5FtDgL0.mp4" type="video/mp4" />
                  </video>
                </div>
                
                {/* Brand overlay card */}
                <div className="absolute -bottom-4 left-6 right-6 bg-white rounded-2xl shadow-lg p-4 border border-charcoal/5 flex items-center justify-center gap-3">
                  <img src="/images/logo.png" alt="Plot Twist Logo" className="h-7 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
