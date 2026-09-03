import React, { useState, useEffect } from 'react';
import { Header, PageId } from './components/Header';
import { UnveilingHero } from './components/UnveilingHero';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PortfolioHighlightsShowcase } from './components/PortfolioHighlightsShowcase';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { PhilosophySection } from './components/PhilosophySection';
import { JournalSection } from './components/JournalSection';
import { ContactPage } from './components/ContactPage';
import { ArticleModal } from './components/ArticleModal';
import { ContactDrawerModal } from './components/ContactDrawerModal';
import { Footer } from './components/Footer';
import { Project, JournalArticle } from './types';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { StudioDataProvider, useStudioData } from './context/StudioDataContext';

function AppContent() {
  const [activePage, setActivePage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase() as PageId;
      const validPages: PageId[] = ['home', 'projects', 'philosophy', 'services', 'journal', 'contact'];
      if (validPages.includes(pathname)) {
        return pathname;
      }
      // Clean legacy hash if present and normalize to clean path
      if (window.location.hash) {
        const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase() as PageId;
        if (validPages.includes(hash)) {
          const cleanPath = hash === 'home' ? '/' : `/${hash}`;
          window.history.replaceState({ page: hash }, '', cleanPath);
          return hash;
        }
      }
    }
    return 'home';
  });

  const { projects, philosophy, siteContent, refreshData, isLoading } = useStudioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);
  const [contactDrawerOpen, setContactDrawerOpen] = useState<boolean>(false);

  // Debug: Log when selected project changes
  useEffect(() => {
    console.log('[App] selectedProject changed:', selectedProject?.title);
  }, [selectedProject]);

  // Sync with browser popstate (back/forward buttons) and clean URL pathname
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase() as PageId;
      const validPages: PageId[] = ['projects', 'philosophy', 'services', 'journal', 'contact'];
      if (validPages.includes(pathname)) {
        setActivePage(pathname);
      } else {
        setActivePage('home');
      }
    };

    // Clean any remaining hash on initial load
    if (window.location.hash) {
      const cleanPath = window.location.pathname || '/';
      window.history.replaceState({}, '', cleanPath);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate cleanly with HTML5 pushState (no hash)
  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#8A6A3D] selection:text-white">
      
      {/* Navigation Header */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenContact={() => setContactDrawerOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* INDEPENDENT PAGE 1: HOME */}
        {activePage === 'home' && (
          <div className="animate-fade-in space-y-0">
            {/* Primary Full-Bleed Architectural Portal Hero */}
            <HeroSection
              onExploreProjects={() => handleNavigate('projects')}
            />

            {/* Moving Selected Portfolio Highlights Showcase with Direct PDF Download */}
            <PortfolioHighlightsShowcase
              projects={projects}
              isLoading={isLoading}
              onSelectProject={(project) => setSelectedProject(project)}
              onViewAllProjects={() => handleNavigate('projects')}
            />

            {/* Home Philosophy Snippet */}
            <section className="py-16 bg-[#E6E1DB]/50 border-b border-[#D8D2C7]">
              <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block">
                      OUR PHILOSOPHY
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-light leading-tight">
                      {siteContent.aboutTitle || 'Architecture Rooted in Humanity & Landscape.'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed">
                      {siteContent.aboutParagraph1 || 'Ubuntu Haus Studio believes space is not merely shelter—it is an invitation to belong. Our design methodology balances contextual reverence, tactile materiality, and spatial clarity.'}
                    </p>
                    <button
                      onClick={() => handleNavigate('philosophy')}
                      className="inline-flex items-center space-x-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#1C1C1C] hover:text-[#8A6A3D] border-b border-[#1C1C1C] hover:border-[#8A6A3D] pb-1 pt-2 transition-all cursor-pointer"
                    >
                      <span>READ OUR MANIFESTO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#F4F1EC] p-6 border border-[#D8D2C7]">
                      <span className="font-serif text-3xl text-[#8A6A3D] block font-light">01</span>
                      <h3 className="font-serif text-lg text-[#1C1C1C] mt-2 mb-2">{siteContent.pillar1Title || 'Contextual Harmony'}</h3>
                      <p className="text-[11px] text-[#1C1C1C]/70 leading-relaxed">{siteContent.pillar1Description || 'We draw inspiration from the land, its people, traditions, and climate.'}</p>
                    </div>
                    <div className="bg-[#F4F1EC] p-6 border border-[#D8D2C7]">
                      <span className="font-serif text-3xl text-[#8A6A3D] block font-light">02</span>
                      <h3 className="font-serif text-lg text-[#1C1C1C] mt-2 mb-2">{siteContent.pillar2Title || 'Human Sanctuary'}</h3>
                      <p className="text-[11px] text-[#1C1C1C]/70 leading-relaxed">{siteContent.pillar2Description || 'More than buildings, we create spaces that foster connection and well-being.'}</p>
                    </div>
                    <div className="bg-[#F4F1EC] p-6 border border-[#D8D2C7]">
                      <span className="font-serif text-3xl text-[#8A6A3D] block font-light">03</span>
                      <h3 className="font-serif text-lg text-[#1C1C1C] mt-2 mb-2">{siteContent.pillar3Title || 'Material Integrity'}</h3>
                      <p className="text-[11px] text-[#1C1C1C]/70 leading-relaxed">{siteContent.pillar3Description || 'We celebrate raw stone, terra cotta, bronze joinery, and sustainable wood.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Home Services & CTA */}
            <section className="py-16 bg-[#1C1C1C] text-white">
              <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8A6A3D] block">
                  START A DIALOGUE
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light max-w-2xl mx-auto leading-tight">
                  Ready to translate vision into enduring architectural space?
                </h2>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="bg-[#8A6A3D] hover:bg-[#6e532d] text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>REQUEST CONSULTATION</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('philosophy')}
                    className="border border-white/30 text-white hover:bg-white hover:text-[#1C1C1C] px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-colors cursor-pointer"
                  >
                    EXPLORE PHILOSOPHY
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* INDEPENDENT PAGE 2: PROJECTS */}
        {activePage === 'projects' && (
          <div className="animate-fade-in">
            <ProjectsSection
              onSelectProject={(project) => setSelectedProject(project)}
            />
          </div>
        )}

        {/* INDEPENDENT PAGE 3: PHILOSOPHY */}
        {activePage === 'philosophy' && (
          <div className="animate-fade-in">
            <PhilosophySection
              onOpenContact={() => handleNavigate('contact')}
            />
          </div>
        )}

        {/* INDEPENDENT PAGE 4: SERVICES */}
        {activePage === 'services' && (
          <div className="animate-fade-in">
            <ServicesSection
              onOpenContact={() => handleNavigate('contact')}
            />
            <ProcessSection
              onOpenContact={() => handleNavigate('contact')}
            />
          </div>
        )}


        {/* INDEPENDENT PAGE 5: JOURNAL */}
        {activePage === 'journal' && (
          <div className="animate-fade-in">
            <JournalSection
              onSelectArticle={(article) => setSelectedArticle(article)}
            />
          </div>
        )}

        {/* INDEPENDENT PAGE 6: CONTACT */}
        {activePage === 'contact' && (
          <div className="animate-fade-in">
            <ContactPage />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => handleNavigate('contact')}
      />

      {/* Modals & Overlay Drawers */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => handleNavigate('contact')}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ContactDrawerModal
        isOpen={contactDrawerOpen}
        onClose={() => setContactDrawerOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <StudioDataProvider>
      <AppContent />
    </StudioDataProvider>
  );
}
