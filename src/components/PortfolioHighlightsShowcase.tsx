import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Sparkles, Loader2 } from 'lucide-react';
import { Project } from '../types';
import { getOptimizedImageUrl } from '../api/client';

interface PortfolioHighlightsShowcaseProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
  isLoading?: boolean;
}

export const PortfolioHighlightsShowcase: React.FC<PortfolioHighlightsShowcaseProps> = ({
  projects,
  onSelectProject,
  onViewAllProjects,
  isLoading = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Smooth continuous automatic horizontal movement
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 5) {
          // Smoothly wrap around to start
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Incrementally glide forward
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  // Track scroll position for progress bar
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const showcaseProjects = useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    return featured.length > 0 ? featured : projects;
  }, [projects]);

  if (isLoading && showcaseProjects.length === 0) {
    return (
      <section className="py-16 sm:py-24 border-b border-[#D8D2C7] bg-[#F4F1EC]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 py-12">
          <Loader2 className="w-5 h-5 text-[#8A6A3D] animate-spin" />
          <span className="text-xs tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-mono">Loading portfolio...</span>
        </div>
      </section>
    );
  }

  if (!showcaseProjects || showcaseProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 border-b border-[#D8D2C7] bg-[#F4F1EC] relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Interactive Moving Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#D8D2C7] pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold block">
                SELECTED PORTFOLIO HIGHLIGHTS
              </span>
              <span className="inline-flex items-center gap-1 bg-[#8A6A3D]/10 text-[#8A6A3D] border border-[#8A6A3D]/30 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#8A6A3D] animate-ping' : 'bg-[#1C1C1C]/40'}`} />
                <span>{isPlaying ? 'ACTIVE MOVING SHOWCASE' : 'PAUSED'}</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1C] font-light tracking-tight">
              Architecture & Interiors
            </h2>
            <p className="text-xs text-[#1C1C1C]/70 mt-1 max-w-xl">
              Curated residential and commercial spaces. Hover over any project to inspect its architectural study.
            </p>
          </div>

          {/* Action and Navigation Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play/Pause Motion Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-2 border text-[10px] tracking-[0.15em] uppercase font-medium transition-colors cursor-pointer ${
                isPlaying 
                  ? 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/10' 
                  : 'border-[#D8D2C7] text-[#1C1C1C] bg-[#E6E1DB]/60 hover:border-[#1C1C1C]'
              }`}
              title={isPlaying ? 'Pause auto-moving showcase' : 'Resume auto-moving showcase'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'PAUSE MOTION' : 'PLAY MOTION'}</span>
            </button>

            {/* Prev / Next Glide Arrows */}
            <div className="flex items-center border border-[#D8D2C7] bg-[#E6E1DB]/50">
              <button
                onClick={handlePrev}
                className="p-2 text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors cursor-pointer border-r border-[#D8D2C7]"
                aria-label="Previous portfolio project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors cursor-pointer"
                aria-label="Next portfolio project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View All Projects Button */}
            <button
              onClick={onViewAllProjects}
              className="bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <span>VIEW ALL ({showcaseProjects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Moving Scroll Container with Project Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex space-x-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {showcaseProjects.map((project, idx) => {
            return (
              <div
                key={project.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(project);
                }}
                className="flex-shrink-0 w-[82vw] sm:w-[350px] lg:w-[390px] bg-[#E6E1DB]/40 border border-[#D8D2C7] group cursor-pointer transition-all duration-300 hover:border-[#8A6A3D] hover:shadow-xl flex flex-col justify-between snap-start"
              >
                {/* Top Image Box */}
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#D8D2C7]">
                    <img
                      src={getOptimizedImageUrl(
                        project.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
                        project.metadata,
                        'card'
                      )}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                    />
                    
                    {/* Typology Badge */}
                    <div className="absolute top-3 left-3 bg-[#1C1C1C]/90 text-white px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase font-medium backdrop-blur-xs">
                      {project.typology}
                    </div>

                    {/* Area Badge */}
                    {project.area && (
                      <div className="absolute bottom-3 left-3 bg-[#F4F1EC]/90 text-[#1C1C1C] px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-mono border border-[#D8D2C7]">
                        {project.area}
                      </div>
                    )}

                    {/* Number index badge */}
                    <div className="absolute top-3 right-3 bg-[#8A6A3D] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* Card Content & House Name Prominence */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-[#8A6A3D] font-mono mb-1.5">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>

                    {/* Prominent House Name */}
                    <h3 className="font-serif text-2xl text-[#1C1C1C] group-hover:text-[#8A6A3D] transition-colors leading-tight font-normal">
                      {project.title}
                    </h3>

                    {project.subtitle && (
                      <p className="text-[11px] tracking-[0.1em] text-[#1C1C1C]/60 uppercase font-medium mt-1">
                        {project.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-[#1C1C1C]/75 mt-3 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Disciplines Chips */}
                    {project.services && project.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#D8D2C7]/60">
                        {project.services.map((srv, i) => (
                          <span
                            key={i}
                            className="bg-[#F4F1EC] text-[#1C1C1C]/80 border border-[#D8D2C7] px-2 py-0.5 text-[9px] tracking-[0.1em] uppercase"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 bg-[#F4F1EC] border-t border-[#D8D2C7] flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="flex-1 flex items-center justify-between py-2.5 px-4 bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] text-[10px] tracking-[0.18em] uppercase font-semibold transition-colors cursor-pointer"
                  >
                    <span>VIEW SPECS & DOSSIER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous Motion Progress Bar & Status Footer */}
        <div className="mt-4 pt-4 border-t border-[#D8D2C7]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.15em] uppercase text-[#1C1C1C]/60 font-mono">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-[#8A6A3D] font-bold">SHOWCASE TRACK:</span>
            <div className="w-32 sm:w-48 h-1 bg-[#D8D2C7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8A6A3D] transition-all duration-300"
                style={{ width: `${Math.max(10, scrollProgress)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-[#1C1C1C]/80">
              <Sparkles className="w-3 h-3 text-[#8A6A3D]" />
              <span>EXPLORE FULL ARCHITECTURAL SCHEMATICS & PALETTES</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
