import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { getOptimizedImageUrl } from '../api/client';

interface HeroSectionProps {
  onExploreProjects: () => void;
}

const ARCH_PATTERN = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(138,106,61,0.06) 60px, rgba(138,106,61,0.06) 61px),' +
    'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(138,106,61,0.06) 60px, rgba(138,106,61,0.06) 61px)',
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreProjects }) => {
  const { siteContent } = useStudioData();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  const bannerImages: string[] = (
    siteContent.heroBannerImages && siteContent.heroBannerImages.length > 0
      ? siteContent.heroBannerImages
      : siteContent.heroBannerImage
        ? [siteContent.heroBannerImage]
        : []
  );

  useEffect(() => {
    if (bannerImages.length < 2) return;
    const nextIdx = (currentSlideIndex + 1) % bannerImages.length;
    if (imagesLoaded.has(nextIdx)) return;
    const img = new Image();
    img.onload = () => {
      setImagesLoaded(prev => new Set(prev).add(nextIdx));
    };
    img.decoding = 'async';
    img.src = getOptimizedImageUrl(bannerImages[nextIdx], undefined, 'full');
  }, [bannerImages, currentSlideIndex, imagesLoaded]);

  const handleImageLoad = (idx: number) => {
    setImagesLoaded(prev => {
      if (prev.has(idx)) return prev;
      return new Set(prev).add(idx);
    });
  };

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % bannerImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <section className="relative h-screen w-full bg-[#1C1C1C] text-white flex flex-col justify-between overflow-hidden border-b border-[#D8D2C7]/30">

      {/* Warm architectural placeholder — always visible behind images (prevents pure-black flash) */}
      <div className="absolute inset-0 z-0 bg-[#26221d]" style={ARCH_PATTERN} />

      {/* Background Images with Cross-Fade Transitions */}
      <div className="absolute inset-0 z-0">
        {bannerImages.length > 0 ? (
          bannerImages.map((imgUrl, idx) => {
            const isCurrent = idx === currentSlideIndex;
            const isFirst = idx === 0;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={getOptimizedImageUrl(imgUrl, undefined, isCurrent ? 'hero' : 'full')}
                  alt={`Ubuntu Haus Studio Architectural Banner ${idx + 1}`}
                  fetchPriority={isFirst ? 'high' : 'low'}
                  decoding={isFirst ? 'sync' : 'async'}
                  loading={isFirst ? 'eager' : 'lazy'}
                  width="1920"
                  height="1080"
                  sizes="100vw"
                  onLoad={() => handleImageLoad(idx)}
                  className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.88]"
                  style={{
                    aspectRatio: '16/9',
                    opacity: isCurrent ? 1 : (imagesLoaded.has(idx) ? 1 : 0.92),
                    transition: 'opacity 0.45s ease',
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 bg-[#1C1C1C]" style={ARCH_PATTERN} />
        )}

        {/* Dark subtle gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:w-[65%]" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-30 max-w-[1500px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-16 lg:py-24 flex-1 flex flex-col justify-center">
        <div className="max-w-xl space-y-6">
          
          {/* Main Display Headline */}
          {(siteContent.heroHeadingLine1 || siteContent.heroHeadingLine2 || siteContent.heroSubheading) && (
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-tight">
              {siteContent.heroHeadingLine1 && <>{siteContent.heroHeadingLine1}<br /></>}
              {siteContent.heroHeadingLine2 && <>{siteContent.heroHeadingLine2}<br /></>}
              {siteContent.heroSubheading && (
                <span className="text-[#C5A059] font-serif italic font-normal">{siteContent.heroSubheading}</span>
              )}
            </h1>
          )}

          {/* Accent Line */}
          {(siteContent.heroHeadingLine1 || siteContent.heroHeadingLine2 || siteContent.heroSubheading) && (
            <div className="w-16 h-[1.5px] bg-[#C5A059]" />
          )}

          {/* Tagline Subtitle - Preserves exact casing typed by admin */}
          {siteContent.tagline && (
            <div className="space-y-1 font-sans text-xs sm:text-sm tracking-[0.15em] text-white/90 font-medium">
              <p>{siteContent.tagline}</p>
            </div>
          )}

          {/* Action Link */}
          <div className="pt-4 flex items-center gap-6">
            <button
              onClick={onExploreProjects}
              className="group inline-flex items-center space-x-3 text-xs tracking-[0.25em] uppercase font-semibold text-white hover:text-[#C5A059] transition-colors pb-1.5 border-b border-white/60 hover:border-[#C5A059] cursor-pointer"
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#C5A059]" />
            </button>
          </div>

        </div>
      </div>

      {/* Slider Controls Overlay (Visible when multiple images exist) */}
      {bannerImages.length > 1 && (
        <div className="absolute right-6 sm:right-12 bottom-24 z-40 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 border border-white/15 rounded-full">
          <button
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="p-1 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-white/80">
            <span className="text-[#C5A059] font-bold">0{currentSlideIndex + 1}</span>
            <span>/</span>
            <span>0{bannerImages.length}</span>
          </div>

          <button
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="p-1 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Bar overlay */}
      <div className="relative z-30 w-full border-t border-white/15 bg-black/30 backdrop-blur-xs">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-white/80">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            SCROLL TO DISCOVER
          </span>
          <span>{siteContent.studioLocation || 'NAIROBI · KENYA'}</span>
        </div>
      </div>

    </section>
  );
};

