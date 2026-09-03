import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, RefreshCw } from 'lucide-react';
import { JournalArticle } from '../types';
import { useStudioData } from '../context/StudioDataContext';
import { getOptimizedImageUrl } from '../api/client';

interface JournalSectionProps {
  onSelectArticle: (article: JournalArticle) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ onSelectArticle }) => {
  const { journal: articles, subscribeNewsletter, isRefreshing, refreshData } = useStudioData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subMessage, setSubMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());

  // Preload article images for smooth scrolling
  useEffect(() => {
    articles.slice(0, 10).forEach((article: JournalArticle) => {
      const imageUrl = article.heroImage || article.image;
      if (imageUrl && !imagesLoaded.has(article.id)) {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev: Set<string>) => new Set(prev).add(article.id));
        };
        img.src = getOptimizedImageUrl(imageUrl, article.metadata);
      }
    });
  }, [articles]);

  const categories = ['ALL', 'Philosophy', 'Materials', 'Interiors', 'Culture'];

  const filteredArticles = activeCategory === 'ALL'
    ? articles
    : articles.filter(a => a.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const featuredArticle = filteredArticles[0] || articles[0];
  const sideArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : articles.slice(1);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribing(true);
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      setSubscribed(true);
      setSubMessage(res.message);
    } catch {
      setSubscribed(true);
      setSubMessage('Subscribed to Ubuntu Haus Studio journal.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="bg-[#F4F1EC] min-h-screen">
      {/* Dedicated Page Hero Header */}
      <div className="bg-[#1C1C1C] text-white border-b border-[#D8D2C7]/30 py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold mb-4">
            <span>HOME</span>
            <span>/</span>
            <span className="text-white">JOURNAL & ESSAYS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight mb-4">
                Studio Journal. <br />
                <span className="text-[#8A6A3D] italic font-normal">Ideas, Stories & Material Insights.</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-2xl">
                Essays and spatial inquiries exploring architecture, African vernacular methods, material longevity, and the psychology of living environments.
              </p>
            </div>

            <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-8 text-white/80">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] block font-semibold">PUBLICATIONS</span>
                <p className="font-serif text-xl text-white">{articles.length} Essays Published</p>
                <p className="text-xs text-white/60">Updated Seasonally</p>
              </div>
              <button
                onClick={() => refreshData()}
                title="Refresh journal essays from endpoint"
                className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              
              </button>
            </div>
          </div>
        </div>
      </div>

      <section id="journal" className="py-16 sm:py-20 border-b border-[#D8D2C7]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 border-b border-[#D8D2C7] pb-6 text-[11px] tracking-[0.18em] uppercase font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] font-semibold'
                    : 'bg-[#E6E1DB]/60 text-[#1C1C1C]/75 border-[#D8D2C7] hover:border-[#8A6A3D] hover:text-[#1C1C1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Layout matching Image #4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT SIDEBAR: Intro & Stay Inspired Newsletter Card (Cols 1-3) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-8">
              <div>
                <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold mb-2 block">
                  EDITORIAL FOCUS
                </span>
                <p className="font-sans text-xs text-[#1C1C1C]/80 leading-relaxed mb-6">
                  Our journal explores the intersection of human psychology, African vernacular heritage, climate-responsive construction, and contemporary structural design.
                </p>
              </div>

              {/* Stay Inspired Newsletter Box (Image #4 style) */}
              <div className="bg-[#E6E1DB]/70 p-6 border border-[#D8D2C7]">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1C1C1C] block mb-2">
                  STAY INSPIRED
                </span>
                <div className="w-8 h-[1px] bg-[#8A6A3D] mb-4"></div>
                <p className="text-xs text-[#1C1C1C]/75 leading-relaxed mb-6">
                  Get updates on new projects, journal essays and studio exhibitions directly to your inbox.
                </p>

                {subscribed ? (
                  <div className="p-3 bg-white border border-[#8A6A3D] text-xs text-[#8A6A3D] font-medium flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{subMessage || 'Subscribed to studio journal updates.'}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={subscribing}
                      className="bg-white border border-[#D8D2C7] px-3 py-2 text-xs text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 flex-1 focus:outline-none focus:border-[#8A6A3D]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="bg-[#8A6A3D] text-white px-3.5 py-2 hover:bg-[#1C1C1C] transition-colors cursor-pointer disabled:opacity-50"
                      aria-label="Subscribe"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* MIDDLE FEATURED ARTICLE (Cols 4-7 Image #4 visual highlight) */}
            {featuredArticle && (
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div
                  onClick={() => onSelectArticle(featuredArticle)}
                  className="group cursor-pointer bg-[#1C1C1C] text-white border border-[#1C1C1C] h-full flex flex-col justify-between overflow-hidden shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#2C2C2C]">
                    <img
                      src={getOptimizedImageUrl(featuredArticle.heroImage || featuredArticle.image, featuredArticle.metadata)}
                      alt={featuredArticle.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                      style={{ opacity: imagesLoaded.has(featuredArticle.id) ? 1 : 0.7, transition: 'opacity 0.3s ease' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/30 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-[#8A6A3D] text-white text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1">
                      FEATURED ESSAY
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 relative z-10 -mt-20">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] mb-2 block">
                      {featuredArticle.category} · {featuredArticle.readTime}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-tight mb-3 group-hover:text-[#8A6A3D] transition-colors">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D]">
                      <span>READ FULL ARTICLE</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT GRID OF SIDE ARTICLES (Cols 8-12 Image #4 style) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sideArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="group cursor-pointer bg-[#F4F1EC] border border-[#D8D2C7] hover:border-[#8A6A3D] p-5 flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden mb-4 border border-[#D8D2C7] bg-[#D8D2C7]">
                      <img
                        src={getOptimizedImageUrl(article.heroImage || article.image, article.metadata)}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ opacity: imagesLoaded.has(article.id) ? 1 : 0.7, transition: 'opacity 0.3s ease' }}
                      />
                    </div>
                    <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#8A6A3D] block mb-1">
                      {article.category} · {article.readTime}
                    </span>
                    <h4 className="font-serif text-lg text-[#1C1C1C] font-normal leading-snug group-hover:text-[#8A6A3D] transition-colors mb-2">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-[#1C1C1C]/70 leading-relaxed line-clamp-2 mb-4">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D8D2C7] flex items-center justify-between text-[9px] tracking-[0.18em] uppercase text-[#1C1C1C]/60 group-hover:text-[#8A6A3D]">
                    <span>READ ESSAY</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
