import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Project,
  JournalArticle,
  StudioService,
  ProcessStep,
  PhilosophyPillar,
  TeamMember,
  ProjectInquiry,
  StudioMetaData,
  SiteContent,
  UploadedAttachment,
  CmsPage
} from '../types';
import { studioApi } from '../api/client';
import {
  PROJECTS as INITIAL_PROJECTS,
  JOURNAL_ARTICLES as INITIAL_JOURNAL,
  SERVICES as INITIAL_SERVICES,
  PROCESS_STEPS as INITIAL_PROCESS,
  PHILOSOPHY_PILLARS as INITIAL_PILLARS,
  DIRECTOR_INFO as INITIAL_DIRECTOR
} from '../data/studioData';

interface PhilosophyData {
  manifesto: { headline: string; subheadline: string; quote: string; quoteAuthor: string };
  pillars: PhilosophyPillar[];
  director: TeamMember;
}

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroHeadingLine1: '',
  heroHeadingLine2: '',
  heroSubheading: '',
  tagline: '',
  heroBannerImage: '',
  heroBannerImages: [],
  studioLocation: '',
  directEmail: '',
  phonePrimary: '',
  phoneSecondary: '',
  instagramHandle: '',
  officeHours: '',
  aboutTitle: '',
  aboutParagraph1: '',
  aboutParagraph2: '',
  directorName: '',
  directorTitle: '',
  directorBio: '',
};

interface StudioDataContextType {
  projects: Project[];
  journal: JournalArticle[];
  services: StudioService[];
  processSteps: ProcessStep[];
  philosophy: PhilosophyData;
  director: TeamMember;
  meta: StudioMetaData | null;
  siteContent: SiteContent;
  cmsPages: CmsPage[];
  isLoading: boolean;
  isRefreshing: boolean;
  apiConnected: boolean;
  refreshData: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<UploadedAttachment[]>;
  submitInquiry: (data: {
    fullName: string;
    email: string;
    phone?: string;
    projectLocation?: string;
    typology?: string;
    estimatedBudget?: string;
    timeline?: string;
    projectScope?: string;
    message: string;
    attachments?: UploadedAttachment[];
    senderEmail?: string;
    senderName?: string;
  }) => Promise<{ success: boolean; referenceNumber: string; message: string; data?: ProjectInquiry }>;
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  trackInquiry: (refNumber: string) => Promise<ProjectInquiry | null>;
}

const StudioDataContext = createContext<StudioDataContextType | undefined>(undefined);

const CACHE_KEY = 'uhs_studio_cache_v1';
const CACHE_TTL_MS = 90 * 1000;

interface CachePayload {
  projects: Project[];
  journal: JournalArticle[];
  siteContent: Partial<SiteContent>;
  director: TeamMember;
  cmsPages: CmsPage[];
  timestamp: number;
}

function readCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed || typeof parsed !== 'object' || !parsed.timestamp) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(payload: CachePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota exceeded or disabled — silently ignore
  }
}

export const StudioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [journal, setJournal] = useState<JournalArticle[]>([]);
  const [services, setServices] = useState<StudioService[]>(INITIAL_SERVICES);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(INITIAL_PROCESS);
  const [philosophy, setPhilosophy] = useState<PhilosophyData>({
    manifesto: {
      headline: 'We believe every place has a story waiting to be uncovered.',
      subheadline: 'Our role is not to impose architecture onto an environment, but to reveal it through light, tactile material, climate responsiveness, and uncompromised craftsmanship.',
      quote: 'We shape our buildings, thereafter they shape us.',
      quoteAuthor: 'Winston Churchill'
    },
    pillars: INITIAL_PILLARS,
    director: INITIAL_DIRECTOR
  });
  const [director, setDirector] = useState<TeamMember>(INITIAL_DIRECTOR);
  const [meta, setMeta] = useState<StudioMetaData | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const applyCachedFallback = () => {
    const cached = readCache();
    if (!cached) return false;
    if (cached.projects?.length) setProjects(cached.projects);
    if (cached.journal?.length) setJournal(cached.journal);
    if (cached.siteContent && Object.keys(cached.siteContent).length > 0) {
      setSiteContent({ ...DEFAULT_SITE_CONTENT, ...cached.siteContent });
    }
    if (cached.director) setDirector(cached.director);
    if (cached.cmsPages?.length) setCmsPages(cached.cmsPages);
    return true;
  };

  const fetchAllData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const initialData = await studioApi.fetchInitialData();
      const { siteContent: fetchedContent, projects: fetchedProjects, journal: fetchedJournal, team: fetchedTeam } = initialData;

      const projectsRaw: any = fetchedProjects;
      const projectsArray = (projectsRaw?.data && Array.isArray(projectsRaw.data))
        ? projectsRaw.data
        : (projectsRaw?.data?.data && Array.isArray(projectsRaw.data.data))
          ? projectsRaw.data.data
          : [];
      setProjects(projectsArray);

      const journalRaw: any = fetchedJournal;
      const journalArray = (journalRaw?.data && Array.isArray(journalRaw.data))
        ? journalRaw.data
        : (journalRaw?.data?.data && Array.isArray(journalRaw.data.data))
          ? journalRaw.data.data
          : [];
      setJournal(journalArray);

      let nextSiteContent = { ...DEFAULT_SITE_CONTENT };
      if (fetchedContent && typeof fetchedContent === 'object') {
        const cleanContent: Record<string, any> = {};
        for (const [key, value] of Object.entries(fetchedContent)) {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value) && value.length === 0) continue;
            cleanContent[key] = value;
          }
        }
        nextSiteContent = { ...DEFAULT_SITE_CONTENT, ...cleanContent };
        setSiteContent(nextSiteContent);

        // Update services from siteContent if available
        if (cleanContent.services && Array.isArray(cleanContent.services)) {
          setServices(cleanContent.services);
        }
      } else {
        setSiteContent(DEFAULT_SITE_CONTENT);
      }

      let nextDirector = INITIAL_DIRECTOR;
      if (fetchedContent?.directorName || fetchedContent?.directorImage) {
        nextDirector = {
          ...INITIAL_DIRECTOR,
          name: fetchedContent.directorName || INITIAL_DIRECTOR.name,
          title: fetchedContent.directorTitle || INITIAL_DIRECTOR.title,
          bio: fetchedContent.directorBio || INITIAL_DIRECTOR.bio,
          image: fetchedContent.directorImage || INITIAL_DIRECTOR.image,
        };
      }

      if (fetchedTeam && Array.isArray(fetchedTeam) && fetchedTeam.length > 0) {
        const directorFromTeam = fetchedTeam.find((member: TeamMember) => {
          const haystack = `${member.role || ''} ${member.title || ''}`.toLowerCase();
          return haystack.includes('director');
        });
        if (directorFromTeam) {
          nextDirector = directorFromTeam;
        }
      }
      setDirector(nextDirector);

      const fetchedPages = await studioApi.getPages({ published_only: true }).catch(() => null);
      const pagesArray = fetchedPages && Array.isArray(fetchedPages) ? fetchedPages : [];
      setCmsPages(pagesArray);

      writeCache({
        projects: projectsArray,
        journal: journalArray,
        siteContent: nextSiteContent,
        director: nextDirector,
        cmsPages: pagesArray,
        timestamp: Date.now(),
      });

      setApiConnected(true);
      setLastUpdated(Date.now());
    } catch (err) {
      setApiConnected(false);
      if (!applyCachedFallback()) {
        setProjects(INITIAL_PROJECTS);
        setJournal(INITIAL_JOURNAL);
        setDirector(INITIAL_DIRECTOR);
        setSiteContent(DEFAULT_SITE_CONTENT);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh data every 5 minutes for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-refresh if tab is visible (performance optimization)
      if (!document.hidden) {
        fetchAllData(false);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Watch for admin-save cache-bust signal across tabs + visibility
  useEffect(() => {
    let lastBust: string | null = null;
    try {
      lastBust = localStorage.getItem('uhs_studio_cache_bust_v');
    } catch { /* noop */ }

    const bustCacheAndReload = () => {
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch { /* noop */ }
      fetchAllData(false);
    };

    const checkBust = () => {
      try {
        const current = localStorage.getItem('uhs_studio_cache_bust_v');
        if (current && lastBust !== null && current !== lastBust) {
          lastBust = current;
          bustCacheAndReload();
        } else if (lastBust === null && current) {
          lastBust = current;
        }
      } catch { /* noop */ }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'uhs_studio_cache_bust_v' || e.key === CACHE_KEY) {
        bustCacheAndReload();
      }
    };
    window.addEventListener('storage', onStorage);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkBust();
        if (Date.now() - lastUpdated > 2 * 60 * 1000) {
          fetchAllData(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = setInterval(checkBust, 15000);

    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [fetchAllData, lastUpdated]);

  useEffect(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch { /* noop */ }
    fetchAllData(true);
  }, [fetchAllData]);

  const refreshData = async () => {
    await fetchAllData(false);
  };

  const uploadFiles = async (files: File[]): Promise<UploadedAttachment[]> => {
    return await studioApi.uploadFiles(files);
  };

  const submitInquiry = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    projectLocation?: string;
    typology?: string;
    estimatedBudget?: string;
    timeline?: string;
    projectScope?: string;
    message: string;
    attachments?: UploadedAttachment[];
  }) => {
    const res = await studioApi.submitInquiry(data);
    return res;
  };

  const subscribeNewsletter = async (email: string) => {
    const res = await studioApi.subscribeNewsletter(email);
    return {
      success: res.success,
      message: res.message || 'Subscribed successfully.'
    };
  };

  const trackInquiry = async (refNumber: string) => {
    return await studioApi.trackInquiry(refNumber);
  };

  return (
    <StudioDataContext.Provider
      value={{
        projects,
        journal,
        services,
        processSteps,
        philosophy,
        director,
        meta,
        siteContent,
        cmsPages,
        isLoading,
        isRefreshing,
        apiConnected,
        refreshData,
        uploadFiles,
        submitInquiry,
        subscribeNewsletter,
        trackInquiry
      }}
    >
      {children}
    </StudioDataContext.Provider>
  );
};

export const useStudioData = () => {
  const context = useContext(StudioDataContext);
  if (!context) {
    throw new Error('useStudioData must be used within a StudioDataProvider');
  }
  return context;
};
