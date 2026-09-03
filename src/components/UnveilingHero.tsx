import React, { useState } from 'react';
import { Volume2, VolumeX, MapPin, Mail, Phone, Instagram, Copy, Check, ArrowRight, Building2, Sparkles, RefreshCw } from 'lucide-react';
import { studioAudio } from '../utils/audio';
import { useStudioData } from '../context/StudioDataContext';

interface UnveilingHeroProps {
  onOpenContactModal: () => void;
  onNavigateToProjects: () => void;
}

export const UnveilingHero: React.FC<UnveilingHeroProps> = ({ onOpenContactModal, onNavigateToProjects }) => {
  const { director, projects, siteContent, isRefreshing, refreshData } = useStudioData();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleAudio = () => {
    const status = studioAudio.toggle();
    setAudioPlaying(status);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('HELLO@UBUNTUHAUS.CO.KE');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="bg-[#F4F1EC] border-b border-[#D8D2C7] text-[#1C1C1C] relative">
      
      {/* Top Banner Row */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-[#D8D2C7]/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] tracking-[0.2em] uppercase font-medium">
        <div className="flex items-center space-x-2 bg-[#1C1C1C] text-white px-3 py-1.5 text-[9.5px] sm:text-[10px]">
          <Sparkles className="w-3 h-3 text-[#8A6A3D] shrink-0" />
          <span className="truncate">UBUNTU HAUS STUDIO · EST. 2018</span>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* Audio Ambient Generator Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center space-x-2 px-3 py-1.5 border text-[10px] sm:text-[11px] transition-all cursor-pointer ${
              audioPlaying 
                ? 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/10' 
                : 'border-[#D8D2C7] text-[#1C1C1C]/70 hover:border-[#1C1C1C]'
            }`}
            title="Click to toggle relaxing background studio soundscape"
          >
            {audioPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#8A6A3D] shrink-0" /> : <VolumeX className="w-3.5 h-3.5 shrink-0" />}
            <span className="whitespace-nowrap">{audioPlaying ? 'PAUSE ATMOSPHERIC AUDIO' : 'ATMOSPHERIC AUDIO'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Grid Layout */}
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT COLUMN: Main Heading, Description, Key Studio Metrics & Consultation Action (Cols 1-6) */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-r border-[#D8D2C7]">
          <div>
            {/* Cormorant Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1C1C1C] leading-[1.08] mb-6">
              {siteContent.heroHeadingLine1 || 'ARCHITECTURE & SPATIAL DESIGN PRACTICE'} <br />
              {siteContent.heroHeadingLine2 || 'PORTFOLIO OF SPATIAL DISTINCTION'} <br />
              <span className="text-[#8A6A3D] italic font-normal">{siteContent.heroSubheading || 'Designing Belonging. Building Legacy.'}</span>
            </h1>

            {/* Paragraphs */}
            <div className="space-y-3 font-sans text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed max-w-xl mb-8">
              <p className="font-medium text-[#1C1C1C]">
                {siteContent.aboutParagraph1 || 'Ubuntu Haus Studio exists to design spaces that foster belonging, inspire purpose and stand the test of time.'}
              </p>
              <p className="text-[#1C1C1C]/70">
                {siteContent.aboutParagraph2 || 'We believe in a collaborative process, thoughtful design and meticulous attention to detail from concept to completion.'}
              </p>
            </div>
          </div>

          {/* STUDIO METRICS & CAPABILITIES BLOCK */}
          <div className="border-t border-[#D8D2C7] pt-6 mt-2">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C]/80 mb-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8A6A3D] inline-block" />
                STUDIO OVERVIEW & DISCIPLINES
              </span>
              <span className="text-[#8A6A3D] tracking-[0.15em]">
                NAIROBI · KENYA
              </span>
            </div>

            {/* 4 Refined Architectural Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
              <div className="bg-[#E6E1DB]/60 border border-[#D8D2C7] p-3 sm:p-5 text-center transition-all hover:border-[#8A6A3D]">
                <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] block leading-none">
                  {projects.length > 0 ? `${projects.length}+` : '24+'}
                </span>
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 mt-2 block">
                  PROJECTS
                </span>
              </div>

              <div className="bg-[#E6E1DB]/60 border border-[#D8D2C7] p-3 sm:p-5 text-center transition-all hover:border-[#8A6A3D]">
                <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] block leading-none">
                  08
                </span>
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 mt-2 block">
                  YEARS
                </span>
              </div>

              <div className="bg-[#E6E1DB]/60 border border-[#D8D2C7] p-3 sm:p-5 text-center transition-all hover:border-[#8A6A3D]">
                <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] block leading-none">
                  04
                </span>
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 mt-2 block">
                  SECTORS
                </span>
              </div>

              <div className="bg-[#E6E1DB]/60 border border-[#D8D2C7] p-3 sm:p-5 text-center transition-all hover:border-[#8A6A3D]">
                <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#8A6A3D] block leading-none">
                  100%
                </span>
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#1C1C1C]/60 mt-2 block">
                  BESPOKE
                </span>
              </div>
            </div>

            {/* Quick Spec Links */}
            <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#1C1C1C]/70 pt-2 gap-2">
              <span className="flex items-center space-x-1.5 text-[#1C1C1C] font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#8A6A3D]" />
                <span>RESIDENTIAL · COMMERCIAL · INTERIORS · LANDSCAPE</span>
              </span>
            </div>
          </div>

          {/* STUDIO CONSULTATION & DIRECT INQUIRY */}
          <div className="border-t border-[#D8D2C7] pt-6 mt-6">
            <div className="flex items-center justify-between mb-3 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1C1C1C]">
              <span>COMMISSION A PROJECT / INQUIRE</span>
              <button
                onClick={onNavigateToProjects}
                className="text-[#8A6A3D] hover:underline flex items-center space-x-1 tracking-[0.15em] cursor-pointer"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenContactModal}
                className="bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex-1 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>REQUEST CONSULTATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToProjects}
                className="border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#E6E1DB] px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors cursor-pointer"
              >
                VIEW PORTFOLIO
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Director Block (Cols 7-9) */}
        <div className="lg:col-span-3 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-r border-[#D8D2C7] bg-[#F4F1EC]">
          <div>
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-medium text-[#1C1C1C]/70 mb-4 block">
              DIRECTOR
            </span>

            {/* Director Monochrome Portrait */}
            <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-[#D8D2C7] group bg-[#D8D2C7]">
              {siteContent.directorImage ? (
                <img
                  src={siteContent.directorImage}
                  alt={siteContent.directorName || director.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D8D2C7]/50">
                  <span className="text-xs tracking-widest uppercase">No Director Image Set</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/40 to-transparent opacity-60"></div>
            </div>

            {/* Director Details */}
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#1C1C1C] font-normal mb-1">
              {siteContent.directorName || director.name}
            </h2>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] font-semibold mb-4">
              {siteContent.directorTitle || director.title}
            </p>

            <div className="space-y-3 font-sans text-xs text-[#1C1C1C]/80 leading-relaxed">
              <p>{siteContent.directorBio || director.bio}</p>
              {director.extendedBio && <p className="text-[#1C1C1C]/70">{director.extendedBio}</p>}
            </div>
          </div>

          {/* Signature */}
          <div className="pt-6 border-t border-[#D8D2C7]/60 mt-6">
            <span className="font-serif italic text-2xl text-[#8A6A3D] block font-light">
              {director.signatureText || siteContent.directorName || director.name}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#1C1C1C]/50 mt-1 block font-mono">
              PRINCIPAL ARCHITECT & FOUNDER
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Charcoal Black Get In Touch Panel (Cols 10-12) */}
        <div className="lg:col-span-3 bg-[#1C1C1C] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h3 className="font-sans text-[11px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] pb-2 border-b border-white/10 mb-6">
                GET IN TOUCH
              </h3>
            </div>

            {/* Contact Details List */}
            <div className="space-y-6 text-xs">
              
              {/* Location */}
              <div className="flex items-start space-x-3 group">
                <div className="p-2 border border-white/10 text-[#8A6A3D] group-hover:border-[#8A6A3D] transition-colors mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 block font-medium">
                    LOCATION
                  </span>
                  <span className="font-sans tracking-[0.15em] uppercase text-white font-medium block mt-0.5">
                    NAIROBI, KENYA
                  </span>
                  <span className="text-[10px] text-white/60 block mt-0.5">
                    {siteContent.studioLocation || 'Riverside Park, Chiromo Rd'}
                  </span>
                </div>
              </div>

              {/* Direct Email with 1-click copy */}
              <div className="flex items-start space-x-3 group">
                <div className="p-2 border border-white/10 text-[#8A6A3D] group-hover:border-[#8A6A3D] transition-colors mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 block font-medium">
                    DIRECT EMAIL
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-sans tracking-[0.12em] uppercase text-white text-[11px] font-medium truncate">
                      {siteContent.directEmail || 'HELLO@UBUNTUHAUS.CO.KE'}
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      className="text-white/40 hover:text-[#8A6A3D] ml-1 p-1 cursor-pointer"
                      title="Copy Email Address"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {copiedEmail && (
                    <span className="text-[9px] text-[#8A6A3D] font-medium block mt-0.5 animate-fade-in">
                      Email copied to clipboard!
                    </span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 group">
                <div className="p-2 border border-white/10 text-[#8A6A3D] group-hover:border-[#8A6A3D] transition-colors mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 block font-medium">
                    PHONE
                  </span>
                  <span className="font-sans tracking-[0.15em] text-white font-medium block mt-0.5">
                    {siteContent.phonePrimary || '+254 700 123 456'}
                  </span>
                  <span className="text-[10px] text-white/60 block mt-0.5">
                    {siteContent.officeHours || 'Mon - Fri: 8:00 AM - 5:00 PM EAT'}
                  </span>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-3 group">
                <div className="p-2 border border-white/10 text-[#8A6A3D] group-hover:border-[#8A6A3D] transition-colors mt-0.5">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 block font-medium">
                    INSTAGRAM
                  </span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans tracking-[0.15em] uppercase text-white hover:text-[#8A6A3D] transition-colors block mt-0.5"
                  >
                    {siteContent.instagramHandle || '@UBUNTUHAUS.STUDIO'} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Charcoal Section Bottom Tagline */}
          <div className="pt-8 border-t border-white/10 mt-8">
            <h4 className="font-serif text-lg text-white font-normal leading-tight tracking-wide">
              DESIGNING BELONGING.
            </h4>
            <h4 className="font-serif text-lg text-[#8A6A3D] font-normal leading-tight tracking-wide">
              BUILDING LEGACY.
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};
