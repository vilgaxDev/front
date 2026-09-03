import React from 'react';
import { CmsPage, CmsSection } from '../types';
import { ArrowRight, Play, Info, Users, Award, Quote } from 'lucide-react';

interface CmsPageRendererProps {
  page: CmsPage;
}

export const CmsPageRenderer: React.FC<CmsPageRendererProps> = ({ page }) => {
  const renderSection = (section: CmsSection, index: number) => {
    const isEven = index % 2 === 0;

    switch (section.section_type) {
      case 'hero':
        return (
          <section
            key={section.id}
            className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: section.media_url ? `url(${section.media_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              {section.hero_badge && (
                <span className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] bg-white/90 px-4 py-2 mb-6">
                  {section.hero_badge}
                </span>
              )}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-light leading-tight mb-6">
                {section.heading}
              </h1>
              {section.subheading && (
                <p className="text-lg sm:text-xl text-white/90 font-light max-w-2xl mx-auto mb-8">
                  {section.subheading}
                </p>
              )}
              {section.button_label && section.button_url && (
                <button
                  onClick={() => window.location.href = section.button_url}
                  className="inline-flex items-center space-x-2 bg-[#8A6A3D] hover:bg-[#6e532d] text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-colors cursor-pointer"
                >
                  <span>{section.button_label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        );

      case 'narrative':
        return (
          <section key={section.id} className={`py-16 lg:py-24 ${isEven ? 'bg-[#F4F1EC]' : 'bg-white'}`}>
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                <div className={`lg:col-span-5 ${isEven ? 'order-1' : 'order-2'}`}>
                  {section.heading && (
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block mb-4">
                      {section.heading}
                    </span>
                  )}
                  {section.subheading && (
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light leading-tight mb-6">
                      {section.subheading}
                    </h2>
                  )}
                  {section.body_text && (
                    <div
                      className="text-sm sm:text-base text-[#1C1C1C]/80 leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.body_text }}
                    />
                  )}
                  {section.button_label && section.button_url && (
                    <button
                      onClick={() => window.location.href = section.button_url}
                      className="inline-flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] hover:text-[#8A6A3D] border-b border-[#1C1C1C] hover:border-[#8A6A3D] pb-1 pt-4 transition-all cursor-pointer mt-6"
                    >
                      <span>{section.button_label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {section.media_url && (
                  <div className={`lg:col-span-7 ${isEven ? 'order-2' : 'order-1'}`}>
                    <img
                      src={section.media_url}
                      alt={section.heading || section.subheading}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'media':
        return (
          <section key={section.id} className="py-16 lg:py-24 bg-[#1C1C1C]">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
              {section.heading && (
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-light text-center mb-12">
                  {section.heading}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.media_url && (
                  <img
                    src={section.media_url}
                    alt={section.heading}
                    className="w-full h-auto rounded-lg"
                  />
                )}
                {section.secondary_media_url && (
                  <img
                    src={section.secondary_media_url}
                    alt={section.heading}
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
              {section.body_text && (
                <p className="text-white/70 text-center mt-8 max-w-2xl mx-auto">
                  {section.body_text}
                </p>
              )}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={section.id} className="py-20 bg-[#8A6A3D] text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              {section.heading && (
                <h2 className="font-serif text-3xl sm:text-4xl font-light mb-6">
                  {section.heading}
                </h2>
              )}
              {section.body_text && (
                <p className="text-lg mb-8 text-white/90">
                  {section.body_text}
                </p>
              )}
              {section.button_label && section.button_url && (
                <button
                  onClick={() => window.location.href = section.button_url}
                  className="inline-flex items-center space-x-2 bg-white text-[#8A6A3D] px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#F4F1EC] transition-colors cursor-pointer"
                >
                  <span>{section.button_label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        );

      case 'stats':
        const stats = section.config_json?.stats || [];
        return (
          <section key={section.id} className="py-16 bg-[#E6E1DB]/50">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
              {section.heading && (
                <h2 className="font-serif text-3xl text-[#1C1C1C] font-light text-center mb-12">
                  {section.heading}
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat: any, idx: number) => (
                  <div key={idx} className="text-center">
                    <div className="font-serif text-4xl sm:text-5xl text-[#8A6A3D] font-light mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#1C1C1C]/70">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'team':
        const team = section.config_json?.team || [];
        return (
          <section key={section.id} className="py-16 lg:py-24 bg-white">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
              {section.heading && (
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light text-center mb-12">
                  {section.heading}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member: any, idx: number) => (
                  <div key={idx} className="text-center">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h3 className="font-serif text-lg text-[#1C1C1C] mb-1">{member.name}</h3>
                    <p className="text-xs text-[#8A6A3D] uppercase tracking-wider mb-2">{member.title}</p>
                    {member.bio && (
                      <p className="text-sm text-[#1C1C1C]/70">{member.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        const testimonials = section.config_json?.testimonials || [];
        return (
          <section key={section.id} className="py-16 lg:py-24 bg-[#F4F1EC]">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
              {section.heading && (
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light text-center mb-12">
                  {section.heading}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any, idx: number) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                    <Quote className="w-8 h-8 text-[#8A6A3D] mb-4" />
                    <p className="text-sm text-[#1C1C1C]/80 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="text-xs font-semibold text-[#1C1C1C]">
                      {testimonial.author}
                    </div>
                    {testimonial.role && (
                      <div className="text-[10px] text-[#1C1C1C]/60">
                        {testimonial.role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={section.id} className="py-16">
            <div className="max-w-[1500px] mx-auto px-4">
              {section.heading && <h2 className="font-serif text-2xl mb-4">{section.heading}</h2>}
              {section.body_text && (
                <div dangerouslySetInnerHTML={{ __html: section.body_text }} />
              )}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      {/* Page Hero */}
      {page.hero_image && (
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${page.hero_image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            {page.hero_badge && (
              <span className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] bg-white/90 px-4 py-2 mb-6">
                {page.hero_badge}
              </span>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-light leading-tight mb-4">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="text-lg sm:text-xl text-white/90 font-light max-w-2xl mx-auto">
                {page.subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Render Sections */}
      {page.sections && page.sections.length > 0 ? (
        page.sections
          .filter(section => section.is_visible)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((section, index) => renderSection(section, index))
      ) : (
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl text-[#1C1C1C] font-light mb-6">{page.title}</h1>
            {page.content_html && (
              <div
                className="text-[#1C1C1C]/80 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content_html }}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};
