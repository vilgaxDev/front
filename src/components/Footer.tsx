import React from 'react';
import { PhoneCall } from 'lucide-react';
import { PageId } from './Header';
import { useStudioData } from '../context/StudioDataContext';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  const { siteContent } = useStudioData();

  const handleNavClick = (e: React.MouseEvent, page: PageId) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="bg-[#1C1C1C] text-white border-t border-[#1C1C1C] pt-16 pb-12">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          
          {/* Brand & Monogram (Cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <a href="/" className="flex items-center space-x-3 cursor-pointer" onClick={(e) => handleNavClick(e, 'home')}>
              <div className="w-8 h-9 flex flex-col justify-between py-1 px-1.5 border border-[#8A6A3D]">
                <div className="w-full flex items-end justify-between h-full">
                  <div className="w-[2px] h-[60%] bg-[#8A6A3D]"></div>
                  <div className="w-[2px] h-[100%] bg-[#8A6A3D]"></div>
                  <div className="w-[2px] h-[80%] bg-[#8A6A3D]"></div>
                  <div className="w-[2px] h-[40%] bg-[#8A6A3D]"></div>
                </div>
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold tracking-[0.25em] text-white uppercase">
                  UBUNTU HAUS STUDIO
                </h3>
                <p className="font-sans text-[9px] tracking-[0.2em] text-[#8A6A3D] uppercase font-medium">
                  ARCHITECTURE · INTERIORS
                </p>
              </div>
            </a>

            <p className="font-serif text-lg text-white/80 max-w-md leading-relaxed">
              {siteContent.aboutParagraph1 || 'Designing spaces that foster belonging, inspire purpose and stand the test of time.'}
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-white bg-white/10 px-4 py-2 hover:bg-[#8A6A3D] hover:text-white transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#8A6A3D]" />
                <span>DIRECT INQUIRY</span>
              </a>
            </div>
          </div>

          {/* Quick Links (Cols 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block mb-2">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs text-white/70 uppercase tracking-[0.18em]">
              <li><a href="/" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">Home Overview</a></li>
              <li><a href="/projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">Selected Projects</a></li>
              <li><a href="/philosophy" onClick={(e) => handleNavClick(e, 'philosophy')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">About Studio</a></li>
              <li><a href="/services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">Services & Process</a></li>
              <li><a href="/journal" onClick={(e) => handleNavClick(e, 'journal')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">Journal & Insights</a></li>
              <li><a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-[#8A6A3D] transition-colors cursor-pointer">Contact Studio</a></li>
            </ul>
          </div>

          {/* Contact Summary (Cols 9-12) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block mb-2">
              STUDIO HEADQUARTERS
            </span>
            <p className="text-xs text-white/70 uppercase tracking-[0.15em]">
              {siteContent.studioLocation || 'RIVERSIDE PARK, CHIROMO ROAD, NAIROBI, KENYA'}
            </p>
            <p className="text-xs text-white/70 uppercase tracking-[0.15em] pt-2">
              EMAIL: {siteContent.directEmail || 'HELLO@UBUNTUHAUS.CO.KE'} <br />
              TEL: {siteContent.phonePrimary || '+254 700 123 456'}
            </p>
          </div>

        </div>

        {/* Bottom Rights & Taglines */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-[0.2em] uppercase text-white/50 space-y-4 sm:space-y-0">
          <div>
            <span>TIMELESS ARCHITECTURE. CONSIDERED INTERIORS. ENDURING IMPACT.</span>
          </div>

          <div>
            <span>© 2026 UBUNTU HAUS STUDIO. ALL RIGHTS RESERVED.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
