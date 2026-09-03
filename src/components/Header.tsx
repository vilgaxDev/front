import React, { useState } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';

import { useStudioData } from '../context/StudioDataContext';

export type PageId = 'home' | 'projects' | 'philosophy' | 'services' | 'journal' | 'contact' | string;

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate, onOpenContact }) => {
  const { cmsPages = [] } = useStudioData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; id: PageId; path: string }[] = [
    { label: 'HOME', id: 'home', path: '/' },
    { label: 'PROJECTS', id: 'projects', path: '/projects' },
    { label: 'ABOUT', id: 'philosophy', path: '/philosophy' },
    { label: 'SERVICES', id: 'services', path: '/services' },
    { label: 'JOURNAL', id: 'journal', path: '/journal' },
    { label: 'CONTACT', id: 'contact', path: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, id: PageId) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-[100000] backdrop-blur-md border-b border-[#D8D2C7]/60 transition-all ${
        activePage === 'home' ? 'bg-transparent border-transparent' : 'bg-[#F4F1EC]/95'
      }`}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-3 sm:gap-4 group text-left focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-9 sm:w-10 sm:h-11 flex flex-col justify-between py-1 px-1.5 border border-[#1C1C1C] transition-all group-hover:border-[#8A6A3D]">
            <div className="w-full flex items-end justify-between h-full">
              <div className="w-[2px] h-[60%] bg-[#1C1C1C] group-hover:bg-[#8A6A3D] transition-colors"></div>
              <div className="w-[2px] h-[100%] bg-[#1C1C1C] group-hover:bg-[#8A6A3D] transition-colors"></div>
              <div className="w-[2px] h-[80%] bg-[#1C1C1C] group-hover:bg-[#8A6A3D] transition-colors"></div>
              <div className="w-[2px] h-[40%] bg-[#1C1C1C] group-hover:bg-[#8A6A3D] transition-colors"></div>
            </div>
          </div>
          <div>
            <h1 className="font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-[#1C1C1C] uppercase leading-tight">
              UBUNTU HAUS STUDIO
            </h1>
            <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] text-[#8A6A3D] uppercase font-medium mt-0.5">
              ARCHITECTURE · INTERIORS
            </p>
          </div>
        </a>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[11px] font-medium tracking-[0.2em] text-[#1C1C1C] uppercase">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`hover:text-[#8A6A3D] transition-colors relative py-1 focus:outline-none cursor-pointer ${
                activePage === item.id ? 'text-[#8A6A3D] font-bold after:w-full' : ''
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#8A6A3D] ${
                activePage === item.id ? 'after:w-full' : 'after:w-0 hover:after:w-full'
              } after:transition-all`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="/contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="hidden sm:flex items-center space-x-2 text-[11px] tracking-[0.18em] uppercase font-medium px-4 py-2 bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#8A6A3D]" />
            <span>GET IN TOUCH</span>
          </a>

          {/* Prominent Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-all text-[11px] tracking-[0.18em] font-semibold uppercase"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-4 h-4" />
                <span>CLOSE</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4" />
                <span>MENU</span>
              </>
            )}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile Slide-Out Side Drawer - Moved outside header */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100001] lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity z-[100001]"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-Out Side Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-[#F4F1EC] h-full shadow-2xl z-[100002] flex flex-col justify-between p-6 overflow-y-auto border-l border-[#D8D2C7] animate-slide-left">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#D8D2C7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-7 flex flex-col justify-between py-1 px-1 border border-[#1C1C1C]">
                    <div className="w-full flex items-end justify-between h-full">
                      <div className="w-[2px] h-[60%] bg-[#1C1C1C]"></div>
                      <div className="w-[2px] h-[100%] bg-[#1C1C1C]"></div>
                      <div className="w-[2px] h-[80%] bg-[#1C1C1C]"></div>
                      <div className="w-[2px] h-[40%] bg-[#1C1C1C]"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#1C1C1C] uppercase">
                      UBUNTU HAUS
                    </h2>
                    <p className="font-sans text-[8px] tracking-[0.15em] text-[#8A6A3D] uppercase font-medium">
                      ARCHITECTURE · INTERIORS
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 border border-[#D8D2C7] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="py-6 flex flex-col space-y-2">
              
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`w-full text-left text-xs font-semibold tracking-[0.2em] uppercase transition-all min-h-[44px] px-3 py-3 rounded-none border-b border-[#D8D2C7]/50 flex items-center justify-between cursor-pointer ${
                      activePage === item.id
                        ? 'bg-[#1C1C1C] text-white border-l-4 border-l-[#8A6A3D]'
                        : 'text-[#1C1C1C] hover:bg-[#E6E1DB] hover:text-[#8A6A3D]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activePage === item.id ? (
                      <span className="text-[10px] text-[#8A6A3D] font-mono font-normal">ACTIVE</span>
                    ) : (
                      <span className="text-gray-400 font-serif text-sm">→</span>
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Drawer Bottom Actions & Contacts */}
            <div className="pt-4 border-t border-[#D8D2C7] space-y-3">
              <a
                href="/contact"
                onClick={(e) => { handleNavClick(e, 'contact'); }}
                className="flex items-center justify-center space-x-2 text-[11px] tracking-[0.18em] uppercase py-3 bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] transition-all w-full font-semibold min-h-[44px] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#8A6A3D]" />
                <span>COMMISSION A PROJECT</span>
              </a>

              <div className="pt-2 text-[9px] text-[#1C1C1C]/60 text-center font-mono uppercase tracking-wider">
                NAIROBI, KENYA · HELLO@UBUNTUHAUS.CO.KE
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
