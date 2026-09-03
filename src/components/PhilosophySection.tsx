import React from 'react';
import { Quote, ArrowRight, PhoneCall, RefreshCw } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';

interface PhilosophySectionProps {
  onOpenContact: () => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ onOpenContact }) => {
  const { philosophy, director, siteContent, isRefreshing, refreshData } = useStudioData();
  const { manifesto, pillars = [] } = philosophy;

  return (
    <div className="bg-[#F4F1EC] min-h-screen">
      {/* Dedicated Page Hero Header */}
      <div className="bg-[#1C1C1C] text-white border-b border-[#D8D2C7]/30 py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold mb-4">
            <span>HOME</span>
            <span>/</span>
            <span className="text-white">ABOUT & PHILOSOPHY</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight mb-4">
                {siteContent.aboutTitle || "Architecture Rooted in Humanity."} <br />
                <span className="text-[#8A6A3D] italic font-normal">Spaces Made to Endure.</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-2xl">
                {siteContent.aboutParagraph1 || "Ubuntu Haus Studio is an architecture and spatial design practice founded on the African ethos of Ubuntu: 'I am because we are.' We believe spaces should nurture human connection and honor the land."}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-8 text-white/80">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] block font-semibold">STUDIO FOUNDATION</span>
                <p className="font-serif text-xl text-white">Nairobi, Kenya</p>
                <p className="text-xs text-white/60">Pan-African Architectural Ethos</p>
              </div>
              <button
                onClick={() => refreshData()}
                title="Refresh philosophy dataset from endpoint"
                className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
               
              </button>
            </div>
          </div>
        </div>
      </div>

      <section id="philosophy" className="py-16 sm:py-20 border-b border-[#D8D2C7]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TOP ROW: Manifesto & Quote */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 border-b border-[#D8D2C7] pb-16">
            
            {/* Left Manifesto Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold mb-3 block">
                  OUR MANIFESTO
                </span>

                <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1C1C] font-normal leading-[1.1] mb-6">
                  {siteContent.manifestoHeadline || manifesto?.headline || "We believe every place has a story waiting to be uncovered."}
                </h2>

                <p className="text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed max-w-xl mb-6 font-serif italic">
                  {siteContent.manifestoSubheadline || manifesto?.subheadline || "Our role is not to impose architecture onto an environment, but to reveal it through light, tactile material, climate responsiveness, and uncompromised craftsmanship."}
                </p>

                <p className="text-xs text-[#1C1C1C]/75 leading-relaxed max-w-xl mb-4">
                  {siteContent.aboutParagraph1 || "From residential sanctuaries nestled into the volcanic ridges of the Great Rift Valley to cultural institutes in urban Nairobi, our architecture is a continuous dialogue between African vernacular heritage and refined contemporary living."}
                </p>
                {siteContent.aboutParagraph2 && (
                  <p className="text-xs text-[#1C1C1C]/75 leading-relaxed max-w-xl mb-8">
                    {siteContent.aboutParagraph2}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={onOpenContact}
                  className="group inline-flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] hover:text-[#8A6A3D] transition-colors pb-1 border-b border-[#1C1C1C] hover:border-[#8A6A3D] cursor-pointer"
                >
                  <span>DISCUSS YOUR VISION WITH OUR TEAM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Architectural Portal Photo & Quote Card */}
            <div className="lg:col-span-6 relative aspect-[16/11] overflow-hidden border border-[#D8D2C7] group shadow-lg bg-[#D8D2C7]">
              <img
                src={siteContent.aboutHeroImage || "/director_portrait.jpeg"}
                alt="Ubuntu Haus Studio Architecture Portal"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#1C1C1C]/45"></div>

              {/* Floating Quote Box */}
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between text-white">
                <Quote className="w-8 h-8 text-[#8A6A3D] opacity-90" />

                <blockquote className="max-w-md space-y-3">
                  <p className="font-serif text-2xl sm:text-3xl font-light leading-snug tracking-wide italic text-white">
                    "{siteContent.manifestoQuote || manifesto?.quote || 'We shape our buildings, thereafter they shape us.'}"
                  </p>
                  <footer className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D]">
                    — {siteContent.manifestoQuoteAuthor || manifesto?.quoteAuthor || 'WINSTON CHURCHILL'}
                  </footer>
                </blockquote>
              </div>
            </div>

          </div>

          {/* MIDDLE ROW: 3 Distinct Pillars Grid */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block mb-1">
                OUR THREE FOUNDATIONAL PILLARS
              </span>
              <h3 className="font-serif text-3xl text-[#1C1C1C] font-light">
                The Principles Guiding Every Sketch & Detail
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  subtitle: siteContent.pillar1Subtitle || pillars[0]?.subtitle || 'ROOTED IN PLACE, GUIDED BY PURPOSE',
                  title: siteContent.pillar1Title || pillars[0]?.title || 'Contextual Harmony',
                  description: siteContent.pillar1Description || pillars[0]?.description || 'We draw inspiration from the land, its people, traditions, and climate. Our work is a continuous dialogue between heritage and contemporary living.'
                },
                {
                  number: '02',
                  subtitle: siteContent.pillar2Subtitle || pillars[1]?.subtitle || 'DESIGNING FOR BELONGING',
                  title: siteContent.pillar2Title || pillars[1]?.title || 'Human Sanctuary',
                  description: siteContent.pillar2Description || pillars[1]?.description || 'More than buildings, we create spaces that foster connection, well-being, and a sense of identity. Spaces that bring people together.'
                },
                {
                  number: '03',
                  subtitle: siteContent.pillar3Subtitle || pillars[2]?.subtitle || 'CRAFTSMANSHIP & LEGACY',
                  title: siteContent.pillar3Title || pillars[2]?.title || 'Material Integrity',
                  description: siteContent.pillar3Description || pillars[2]?.description || 'We celebrate raw stone, terra cotta, bronze joinery, and sustainable wood. By prioritizing uncompromised craftsmanship, our architecture matures gracefully.'
                }
              ].map((pillar, idx) => (
                <div
                  key={pillar.number}
                  className={`p-8 border flex flex-col justify-between transition-all hover:shadow-md ${
                    idx === 1
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xl'
                      : 'bg-[#E6E1DB]/60 text-[#1C1C1C] border-[#D8D2C7] hover:border-[#8A6A3D]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] mb-3 block">
                      {pillar.subtitle}
                    </span>
                    <h3 className={`font-serif text-2xl font-normal mb-3 ${idx === 1 ? 'text-white' : 'text-[#1C1C1C]'}`}>
                      {pillar.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${idx === 1 ? 'text-white/80' : 'text-[#1C1C1C]/75'}`}>
                      {pillar.description}
                    </p>
                  </div>
                  <div className={`mt-8 pt-4 border-t text-[10px] tracking-[0.18em] uppercase font-mono ${
                    idx === 1 ? 'border-white/10 text-[#8A6A3D]' : 'border-[#D8D2C7] text-[#1C1C1C]/50'
                  }`}>
                    PILLAR {pillar.number} · PRINCIPLE
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEADERSHIP & DIRECTOR PROFILE */}
          <div className="bg-[#E6E1DB]/40 border border-[#D8D2C7] p-8 sm:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-4">
                <div className="relative aspect-[3/4] overflow-hidden border border-[#D8D2C7] bg-[#D8D2C7]">
                  <img
                    src={(siteContent.directorImage && !siteContent.directorImage.includes('unsplash.com')) ? siteContent.directorImage : '/director_portrait.jpeg'}
                    alt={siteContent.directorName || director.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#1C1C1C]/90 text-white p-3 text-center">
                    <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D] block">
                      {siteContent.directorTitle || director.title}
                    </span>
                    <p className="font-serif text-sm text-white mt-0.5">{siteContent.directorName || director.name}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block">
                  STUDIO LEADERSHIP
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light">
                  A Letter from the Principal
                </h3>
                <p className="font-serif text-base sm:text-lg text-[#1C1C1C]/90 italic leading-relaxed">
                  "{siteContent.directorBio || director.bio}"
                </p>
                <p className="text-xs sm:text-sm text-[#1C1C1C]/75 leading-relaxed">
                  {siteContent.directorExtendedBio || director.extendedBio}
                </p>
                
                <div className="pt-4 border-t border-[#D8D2C7] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-serif italic text-2xl text-[#1C1C1C] block font-light">
                      {director.signatureText || siteContent.directorName || director.name}
                    </span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] font-mono">
                      DIRECTOR · UBUNTU HAUS STUDIO
                    </span>
                  </div>

                  <button
                    onClick={onOpenContact}
                    className="bg-[#1C1C1C] text-white hover:bg-[#8A6A3D] transition-colors px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>CONTACT MOKUA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
