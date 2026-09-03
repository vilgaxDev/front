import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, Maximize2, Layers, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'concept' | 'materiality' | 'gallery'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const openedAtRef = useRef(0);

  // Ensure gallery is always an array
  const galleryImages = project?.gallery || [];
  const hasGallery = galleryImages.length > 0;

  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setLightboxZoom(1);
        } else {
          onClose();
        }
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
          setLightboxZoom(1);
        }
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
          setLightboxZoom(1);
        }
        if (e.key === '+' || e.key === '=') {
          setLightboxZoom((prev) => Math.min(prev + 0.25, 3));
        }
        if (e.key === '-' || e.key === '_') {
          setLightboxZoom((prev) => Math.max(prev - 0.25, 0.5));
        }
      }
    };
    if (project) {
      openedAtRef.current = Date.now();
      document.body.style.overflow = isLightboxOpen ? 'hidden' : 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, isLightboxOpen, galleryImages.length]);

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    // Ignore the same click that opened the modal (bubbles after React re-render)
    if (Date.now() - openedAtRef.current < 300) return;
    onClose();
  };

  if (!project) return null;

  return (
    <div
      onMouseDown={handleBackdropMouseDown}
      className="fixed inset-0 z-[100002] bg-[#1C1C1C]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto overscroll-contain animate-fade-in cursor-pointer"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="bg-[#F4F1EC] text-[#1C1C1C] border border-[#D8D2C7] w-full max-w-6xl my-auto overflow-hidden shadow-2xl relative max-h-[95dvh] flex flex-col cursor-default"
      >
        
        {/* Top Header Bar - Sticky */}
        <div className="sticky top-0 z-20 bg-[#F4F1EC] border-b border-[#D8D2C7] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden pr-2">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] font-semibold whitespace-nowrap">
              PROJECT SPECIFICATION
            </span>
            <span className="text-[#D8D2C7] hidden sm:inline">|</span>
            <span className="font-serif text-base sm:text-lg text-[#1C1C1C] font-normal truncate">
              {project.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#1C1C1C] hover:text-[#8A6A3D] transition-colors hover:rotate-90 transform duration-200 cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Left Hero & Specs (Image #5 style layout) */}
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D2C7] flex flex-col justify-between bg-[#F4F1EC]">
            <div>
              <button
                onClick={onClose}
                className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 hover:text-[#8A6A3D] mb-4 sm:mb-6 inline-block font-medium cursor-pointer"
              >
                ← BACK TO PROJECTS
              </button>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#1C1C1C] font-normal leading-tight mb-2">
                {project.title}
              </h2>

              <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8A6A3D] font-semibold mb-4 sm:mb-6">
                {project.subtitle}
              </p>

              {project.description && (
                <p className="text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed mb-6 sm:mb-8">
                  {project.description}
                </p>
              )}

              {/* Specs Table (Matching Image #5) */}
              <div className="border border-[#D8D2C7] bg-[#E6E1DB]/50 text-xs divide-y divide-[#D8D2C7] mb-6">
                {project.location && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">LOCATION</span>
                  <span className="font-medium text-[#1C1C1C] text-right">{project.location}</span>
                </div>
                )}
                {project.year && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">YEAR</span>
                  <span className="font-medium text-[#1C1C1C]">{project.year}</span>
                </div>
                )}
                {project.status && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">STATUS</span>
                  <span className="font-medium text-[#8A6A3D]">{project.status}</span>
                </div>
                )}
                {project.typology && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">TYPOLOGY</span>
                  <span className="font-medium text-[#1C1C1C]">{project.typology}</span>
                </div>
                )}
                {project.area && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">AREA</span>
                  <span className="font-medium text-[#1C1C1C]">{project.area}</span>
                </div>
                )}
                {project.services && project.services.length > 0 && (
                <div className="flex justify-between p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 font-medium">SERVICES</span>
                  <span className="font-medium text-[#1C1C1C] text-right text-[11px] sm:text-xs">{project.services.join(', ')}</span>
                </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#D8D2C7]">
              <button
                onClick={() => { onClose(); onOpenContact(); }}
                className="w-full flex items-center justify-center space-x-2 text-xs tracking-[0.2em] uppercase font-semibold bg-[#1C1C1C] text-white py-3.5 px-4 hover:bg-[#8A6A3D] transition-colors cursor-pointer"
              >
                <span>INQUIRE ABOUT THIS PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image Gallery (Cols 6-12) */}
          <div className="lg:col-span-7 bg-[#E6E1DB]/30 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Main Active Image display */}
              <div className="relative aspect-[16/10] overflow-hidden border border-[#D8D2C7] mb-4 group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
                <img
                  src={galleryImages[activeImageIndex] || project.heroImage}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {hasGallery && (
                  <>
                    <div className="absolute bottom-3 right-3 bg-[#1C1C1C]/80 text-white text-[10px] tracking-[0.15em] px-2.5 py-1 uppercase">
                      VIEW {activeImageIndex + 1} OF {galleryImages.length}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {hasGallery && (
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-[4/3] border overflow-hidden transition-all ${
                        activeImageIndex === idx ? 'border-[#8A6A3D] ring-1 ring-[#8A6A3D]' : 'border-[#D8D2C7] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Material & Concept Narrative */}
            {project.materialityNarrative && (
            <div className="mt-8 p-5 bg-[#F4F1EC] border border-[#D8D2C7]">
              <h4 className="font-serif text-lg text-[#1C1C1C] font-normal mb-1">
                Materiality & Architectural Narrative
              </h4>
              <p className="text-xs text-[#1C1C1C]/75 leading-relaxed">
                {project.materialityNarrative}
              </p>
            </div>
            )}
          </div>

        </div>

      </div>

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100003] bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#8A6A3D] transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
            }}
            className="absolute left-4 text-white hover:text-[#8A6A3D] transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 text-white hover:text-[#8A6A3D] transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-[90vw] max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[activeImageIndex] || project.heroImage}
              alt={project.title}
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
              style={{ transform: `scale(${lightboxZoom})` }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs tracking-[0.15em] px-3 py-1.5">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 p-2 rounded-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxZoom((prev) => Math.max(prev - 0.25, 0.5));
              }}
              className="text-white hover:text-[#8A6A3D] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white text-xs font-mono w-12 text-center">
              {Math.round(lightboxZoom * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxZoom((prev) => Math.min(prev + 0.25, 3));
              }}
              className="text-white hover:text-[#8A6A3D] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxZoom(1);
              }}
              className="text-white hover:text-[#8A6A3D] transition-colors ml-2"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
