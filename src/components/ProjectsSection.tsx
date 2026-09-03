import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, Search, RefreshCw } from 'lucide-react';
import { Project } from '../types';
import { useStudioData } from '../context/StudioDataContext';
import { getOptimizedImageUrl } from '../api/client';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  customProjects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onSelectProject, customProjects }) => {
  const { projects: contextProjects, isLoading, isRefreshing, refreshData, siteContent } = useStudioData();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());

  const projects = customProjects || contextProjects;

  // Get projects hero content from site content or use defaults
  const projectsHeroTitle = siteContent?.projectsHeroTitle || 'Selected Works.';
  const projectsHeroSubtitle = siteContent?.projectsHeroSubtitle || 'Architecture & Interiors.';
  const projectsHeroDescription = siteContent?.projectsHeroDescription || 'A curated archive of residential sanctuaries, commercial landmarks, and bespoke interior environments crafted across Nairobi and East Africa.';
  const projectPageMainTitle = siteContent?.projectPageMainTitle || 'Our Portfolio';
  const projectPageParagraph1 = siteContent?.projectPageParagraph1 || '';

  const handleImageLoad = (projectId: string) => {
    setImagesLoaded(prev => {
      if (prev.has(projectId)) return prev;
      return new Set(prev).add(projectId);
    });
  };

  // Dynamically compute all categories from project dataset
  const rawCategories = projects.map(p => p.typology || (p as any).category).filter(Boolean);
  const uniqueDynamicCategories = Array.from(new Set(rawCategories));
  
  // Combine standard and custom categories into a clean list
  const defaultCategories = ['Private Residence', 'Commercial', 'Interiors', 'Landscape'];
  const allCategoryNames = Array.from(new Set([...defaultCategories, ...uniqueDynamicCategories]));
  const categories = ['ALL', ...allCategoryNames];

  const filteredProjects = projects.filter((project) => {
    const projectCat = (project.typology || (project as any).category || '').toLowerCase();
    const matchesCategory =
      activeFilter === 'ALL' ||
      projectCat === activeFilter.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#F4F1EC] min-h-screen">
      {/* Dedicated Page Hero Header */}
      <div className="bg-[#1C1C1C] text-white border-b border-[#D8D2C7]/30 py-16 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold mb-4">
            <span>HOME</span>
            <span>/</span>
            <span className="text-white">PROJECTS & ARCHITECTURAL WORKS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl text-white font-light leading-tight mb-4">
                {projectsHeroTitle} <br />
                <span className="text-[#8A6A3D] italic font-normal">{projectsHeroSubtitle}</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-2xl">
                {projectsHeroDescription}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-8 text-white/80">
              <div>
                <span className="font-serif text-3xl text-white font-light">{projects.length}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D]">Curated Works</span>
              </div>
              <div className="h-8 w-[1px] bg-white/20" />
              <div>
                <span className="font-serif text-3xl text-white font-light">{categories.length - 1}</span>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D]">Typologies</span>
              </div>
              <div className="h-8 w-[1px] bg-white/20" />
              <button
                onClick={() => refreshData()}
                title="Sync latest projects from API"
                className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Page Main Title Section */}
      <div className="bg-[#E6E1DB]/40 border-b border-[#D8D2C7] py-12 sm:py-16">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold block mb-3">
              OUR PORTFOLIO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1C1C] font-light mb-4">
              {projectPageMainTitle}
            </h2>
            {projectPageParagraph1 && (
              <p className="text-sm sm:text-base text-[#1C1C1C]/75 leading-relaxed max-w-3xl mx-auto">
                {projectPageParagraph1}
              </p>
            )}
          </div>
        </div>
      </div>

      <section id="projects" className="py-16 sm:py-20 border-b border-[#D8D2C7]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar & Search & Counter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 sm:mb-12 border-b border-[#D8D2C7] pb-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase font-medium">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 sm:px-4 py-2 border transition-all cursor-pointer text-xs ${
                    activeFilter === cat
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] font-semibold'
                      : 'bg-[#E6E1DB]/60 text-[#1C1C1C]/75 border-[#D8D2C7] hover:border-[#8A6A3D] hover:text-[#1C1C1C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1C]/50" />
                <input
                  type="text"
                  placeholder="Filter by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-[#D8D2C7] text-xs text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 focus:outline-none focus:border-[#8A6A3D]"
                />
              </div>
              <div className="text-[11px] font-mono tracking-wider text-[#1C1C1C]/60 uppercase hidden sm:block shrink-0">
                {filteredProjects.length} / {projects.length}
              </div>
            </div>
          </div>

          {/* Loading state indicator */}
          {isLoading && projects.length === 0 ? (
            <div className="flex items-center justify-center py-20 space-x-3">
              <RefreshCw className="w-4 h-4 text-[#8A6A3D] animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest text-[#1C1C1C]/60">Loading...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 text-center bg-[#E6E1DB]/40 border border-[#D8D2C7] p-8">
              <p className="font-serif text-xl text-[#1C1C1C] mb-2">No projects match the selected criteria.</p>
              <p className="text-xs text-[#1C1C1C]/60 mb-4">Try clearing your search query or selecting a different typology.</p>
              <button
                onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }}
                className="px-4 py-2 bg-[#1C1C1C] text-white text-xs tracking-widest uppercase hover:bg-[#8A6A3D] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Projects Grid - 3 cards per row on large/desktop screens */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(project);
                  }}
                  className="group cursor-pointer bg-[#F4F1EC] border border-[#D8D2C7] hover:border-[#8A6A3D] transition-all duration-300 flex flex-col justify-between hover:shadow-xl"
                >
                  <div>
                    {/* Project Hero Image */}
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-[#D8D2C7] bg-[#D8D2C7]">
                      <img
                        src={getOptimizedImageUrl(project.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', project.metadata, 'card')}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        width="800"
                        height="500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onLoad={() => handleImageLoad(project.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                        style={{ opacity: imagesLoaded.has(project.id) ? 1 : 0, transition: 'opacity 0.4s ease', aspectRatio: '16/10' }}
                      />
                      <div className="absolute top-3 left-3 bg-[#1C1C1C]/90 text-white text-[9px] tracking-[0.2em] px-2.5 py-1 uppercase font-medium backdrop-blur-xs">
                        {project.typology}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 text-[#1C1C1C] text-[10px] tracking-[0.15em] px-2.5 py-0.5 uppercase font-semibold border border-[#D8D2C7]">
                        {project.year}
                      </div>
                    </div>

                    {/* Project Info Block */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-xl sm:text-2xl text-[#1C1C1C] font-normal group-hover:text-[#8A6A3D] transition-colors leading-tight">
                            {project.title}
                          </h3>
                          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8A6A3D] font-semibold mt-1">
                            {project.subtitle}
                          </p>
                        </div>

                        <div className="p-2 border border-[#D8D2C7] text-[#1C1C1C] group-hover:border-[#8A6A3D] group-hover:text-[#8A6A3D] group-hover:bg-[#8A6A3D]/10 transition-colors shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="font-sans text-xs text-[#1C1C1C]/75 leading-relaxed mt-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Services highlights tag */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-[#D8D2C7]/60">
                        {(project.services || []).map((serv, i) => (
                          <span key={i} className="text-[8.5px] tracking-wider uppercase font-mono px-2 py-0.5 bg-[#E6E1DB] text-[#1C1C1C]/80 border border-[#D8D2C7]">
                            {serv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Meta Bar & Open Modal Specs Action */}
                  <div className="px-5 sm:px-6 py-3.5 bg-[#E6E1DB]/60 border-t border-[#D8D2C7] flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-[0.18em] uppercase text-[#1C1C1C]/70">
                    <span className="flex items-center gap-1.5 font-mono text-[9.5px]">
                      <MapPin className="w-3 h-3 text-[#8A6A3D]" />
                      {project.location}
                    </span>

                    <span className="font-semibold text-[#8A6A3D] group-hover:underline flex items-center gap-1 text-[9.5px] tracking-widest">
                      VIEW SPECS & DOSSIER <ArrowRight className="w-3.5 h-3.5 inline group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
