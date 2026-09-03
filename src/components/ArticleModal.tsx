import React, { useEffect } from 'react';
import { X, Clock, Calendar, User, ArrowLeft } from 'lucide-react';
import { JournalArticle } from '../types';

interface ArticleModalProps {
  article: JournalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (article) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100002] bg-[#1C1C1C]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto overscroll-contain animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F4F1EC] text-[#1C1C1C] border border-[#D8D2C7] w-full max-w-4xl my-auto overflow-hidden shadow-2xl relative max-h-[95dvh] flex flex-col cursor-default"
      >
        
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20 bg-[#F4F1EC] border-b border-[#D8D2C7] px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-[#1C1C1C] hover:text-[#8A6A3D] transition-colors cursor-pointer mr-3"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A6A3D]" />
              <span>BACK TO JOURNAL</span>
            </button>
            <span className="text-[#D8D2C7] hidden sm:inline">|</span>
            <span className="text-[11px] sm:text-xs uppercase font-medium tracking-wider text-[#1C1C1C]/70 truncate max-w-[180px] sm:max-w-none">
              {article.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase px-3 py-1.5 bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] transition-colors cursor-pointer"
            aria-label="Close article"
          >
            <X className="w-4 h-4" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-8 lg:p-10 overflow-y-auto space-y-6 sm:space-y-8 flex-1">
          
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D] block mb-2">
              {article.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1C1C] font-normal leading-tight mb-4">
              {article.title}
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#1C1C1C]/70 mb-6">
              {article.subtitle}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] tracking-[0.18em] uppercase text-[#1C1C1C]/60 py-3 border-y border-[#D8D2C7]">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8A6A3D]" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8A6A3D]" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8A6A3D]" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] overflow-hidden border border-[#D8D2C7]">
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Text Content */}
          <div className="prose max-w-none text-xs sm:text-sm text-[#1C1C1C]/85 leading-relaxed space-y-4">
            <p className="font-medium text-[#1C1C1C] text-sm sm:text-base border-l-2 border-[#8A6A3D] pl-4 italic">
              "{article.excerpt}"
            </p>
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Footer Share & Back Button */}
          <div className="pt-6 border-t border-[#D8D2C7] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-semibold text-white bg-[#1C1C1C] hover:bg-[#8A6A3D] px-4 py-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A6A3D]" />
              <span>RETURN TO JOURNAL ARTICLES</span>
            </button>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] font-medium">
              UBUNTU HAUS ESSAYS · NAIROBI
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
