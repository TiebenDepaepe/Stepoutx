import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, ArrowRight, Images, Loader2 } from 'lucide-react';

// Helper to get thumbnail path from full image path
const getThumbPath = (src: string): string => {
  // Extract filename and extension
  const filename = src.split('/').pop() || '';
  const lastDotIndex = filename.lastIndexOf('.');
  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex); // .jpeg, .jpg, or .webp
  
  // Use .jpg for jpeg/jpg, keep original extension for webp
  const thumbExt = ext === '.webp' ? '.webp' : '.jpg';
  return `/images/thumbs/${name}_thumb${thumbExt}`;
};

// Main page images (visible in grid)
const mainImages = [
  { src: '/images/width-768.jpeg', alt: 'Vriendschap op de weg' },
  { src: '/images/width-1024.jpeg', alt: 'Groep op de camping' },
  { src: '/images/width-1200.jpeg', alt: 'Klimmen' },
  { src: '/images/width-1536.jpeg', alt: 'Kajakken' },
  { src: '/images/width-1536.webp', alt: 'Geiten voeren' },
  { src: '/images/width-1600.webp', alt: 'Raften op het water' },
  { src: '/images/width-1800.jpeg', alt: 'Molen bezoek' },
  { src: '/images/width-2048.webp', alt: 'Emma en Daria' },
  { src: '/images/width-2400.jpeg', alt: 'Geiten selfie' },
  { src: '/images/width-15364.webp', alt: 'Hert ontmoeting' },
];

// Additional carousel-only images
const carouselOnlyImages = [
  { src: '/images/width-20488.webp', alt: 'Groep raften' },
  { src: '/images/1f4a6734-e58b-4ba3-a568-e9f82b5d9aed.jpeg', alt: 'Avontuur' },
  { src: '/images/2773dbc8-25f8-4f32-997b-a383fb13eba8.jpeg', alt: 'Vriendschap' },
  { src: '/images/4136f488-2458-45b0-a2c2-33cbab5a34f4.jpeg', alt: 'Natuur' },
  { src: '/images/a5d3a136-d9a2-4804-969d-06bb51eda3b9.jpeg', alt: 'Groep' },
  { src: '/images/b0686d8a-dcba-43d6-adfd-13b99406a083.jpeg', alt: 'Activiteit' },
  { src: '/images/bccd2d33-5723-4dd5-8d51-dbfa949b2dcf.jpeg', alt: 'Moment' },
  { src: '/images/DSC04417.jpeg', alt: 'Foto' },
  { src: '/images/ef766023-579f-4d69-97e1-74847ab2f92a.jpeg', alt: 'Herinnering' },
  { src: '/images/IMG_0633.jpeg', alt: 'Reis' },
  { src: '/images/IMG_2904.jpeg', alt: 'Avontuur' },
  { src: '/images/IMG_2907.jpeg', alt: 'Vriendschap' },
  { src: '/images/IMG_2913.jpeg', alt: 'Groep' },
  { src: '/images/IMG_2939.jpeg', alt: 'Moment' },
  { src: '/images/IMG_2979.jpeg', alt: 'Natuur' },
  { src: '/images/IMG_4519.jpeg', alt: 'Activiteit' },
  { src: '/images/IMG_7553.jpeg', alt: 'Foto' },
  { src: '/images/IMG_7554.jpeg', alt: 'Herinnering' },
  { src: '/images/IMG_7555.jpeg', alt: 'Reis' },
  { src: '/images/IMG_8479.jpeg', alt: 'Avontuur' },
  { src: '/images/IMG_8607.jpeg', alt: 'Vriendschap' },
  { src: '/images/IMG_8674.jpeg', alt: 'Groep' },
  { src: '/images/IMG_8696.jpeg', alt: 'Moment' },
  { src: '/images/IMG_9615.jpeg', alt: 'Natuur' },
  { src: '/images/IMG_9795.jpeg', alt: 'Activiteit' },
  { src: '/images/PHOTO-2025-07-21-10-27-44.jpeg', alt: 'Foto' },
  { src: '/images/PHOTO-2025-07-21-10-27-50.jpeg', alt: 'Herinnering' },
  { src: '/images/PHOTO-2025-07-21-10-29-40.jpeg', alt: 'Reis' },
];

// Combine all images for carousel
const allImages = [...mainImages, ...carouselOnlyImages];

// Memoized thumbnail component to prevent re-renders
interface ThumbnailButtonProps {
  index: number;
  currentIndex: number;
  imageSrc: string;
  imageAlt: string;
  onClick: () => void;
}

const ThumbnailButton = memo(({ index, currentIndex, imageSrc, imageAlt, onClick }: ThumbnailButtonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isActive = index === currentIndex;
  
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-300 relative ${
        isActive
          ? 'ring-2 ring-white scale-110'
          : 'opacity-50 hover:opacity-80'
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
        </div>
      )}
      <img
        src={getThumbPath(imageSrc)}
        alt={imageAlt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        decoding="async"
      />
    </button>
  );
});

ThumbnailButton.displayName = 'ThumbnailButton';

export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsImageLoading(true);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, []);

  const goToNext = useCallback(() => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, []);

  const goToImage = (index: number) => {
    if (index !== currentIndex) {
      setIsImageLoading(true);
      setCurrentIndex(index);
    }
  };

  // Get visible thumbnails (prev 3, current, next 3)
  const getVisibleThumbnails = () => {
    const thumbnails = [];
    for (let i = -3; i <= 3; i++) {
      const index = (currentIndex + i + allImages.length) % allImages.length;
      thumbnails.push({ index, image: allImages[index], offset: i });
    }
    return thumbnails;
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-mint relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-16 left-12 opacity-20">
        <Camera className="w-10 h-10" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/10 rounded-full text-sm font-medium text-charcoal mb-6">
            <Camera className="w-4 h-4 text-purple-accent" />
            HERINNERINGEN
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
            Momenten van <span className="text-purple-accent">avontuur</span>
          </h2>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Een kijkje in de herinneringen die onze deelnemers maakten tijdens hun StepOut-reis
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[180px]">
          {mainImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                index === 0 || index === 2 ? 'row-span-2' : ''
              } ${index === 6 || index === 9 ? 'col-span-2' : ''} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 50}ms`, transitionDuration: '500ms' }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Subtle hover overlay - no text */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
              
              {/* Subtle expand icon on hover */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <Maximize2 className="w-4 h-4 text-charcoal" />
              </div>
            </button>
          ))}
          
          {/* "See More" card - invites users to open carousel */}
          <button
            onClick={() => openLightbox(mainImages.length)}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer row-span-2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${mainImages.length * 50}ms`, transitionDuration: '500ms' }}
          >
            {/* Background image with overlay */}
            <img
              src={carouselOnlyImages[0].src}
              alt="Bekijk meer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal/70 via-charcoal/50 to-purple-900/60" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Images className="w-7 h-7 text-white" />
              </div>
              <p className="text-white font-display font-bold text-lg mb-1">+{carouselOnlyImages.length}</p>
              <p className="text-white/80 text-sm text-center">Bekijk alle foto's</p>
            </div>
            
            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-colors duration-300" />
          </button>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <p className="text-charcoal/60 mb-4">
            Wil jij ook zulke herinneringen maken?
          </p>
          <button 
            onClick={scrollToContact}
            className="btn-primary group"
          >
            Start jouw avontuur
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-sm flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Current image */}
            <div className="relative max-w-4xl max-h-[70vh] w-full h-full flex items-center justify-center">
              {/* Loading spinner */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-12 h-12 text-white/60 animate-spin" />
                </div>
              )}
              <img
                src={allImages[currentIndex].src}
                alt={allImages[currentIndex].alt}
                className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
              />
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="bg-charcoal/50 backdrop-blur-md py-4 px-4">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              {getVisibleThumbnails().map(({ index, image }) => (
                <ThumbnailButton
                  key={index}
                  index={index}
                  currentIndex={currentIndex}
                  imageSrc={image.src}
                  imageAlt={image.alt}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
            
            {/* Image counter */}
            <p className="text-center text-white/60 text-sm mt-3">
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
