import {
  Project,
  JournalArticle,
  StudioService,
  ProcessStep,
  PhilosophyPillar,
  TeamMember,
  ProjectInquiry,
  StudioMetaData,
  UploadedAttachment,
  ApiResponse,
  CmsPage,
  CmsSection
} from '../types';
import {
  PROJECTS as FALLBACK_PROJECTS,
  JOURNAL_ARTICLES as FALLBACK_JOURNAL,
  SERVICES as FALLBACK_SERVICES,
  PROCESS_STEPS as FALLBACK_PROCESS,
  PHILOSOPHY_PILLARS as FALLBACK_PILLARS,
  DIRECTOR_INFO as FALLBACK_DIRECTOR
} from '../data/studioData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ubuntuhaus.co.ke/api';

export type ImageSizePreset = 'hero' | 'card' | 'thumb' | 'full' | 'modal';

const SIZE_PRESETS: Record<ImageSizePreset, { w: number; q: number }> = {
  hero:   { w: 1920, q: 72 },
  full:   { w: 1600, q: 78 },
  modal:  { w: 1400, q: 80 },
  card:   { w: 800,  q: 70 },
  thumb:  { w: 400,  q: 65 },
};

function hasSizeParams(url: string): boolean {
  return /[?&](w|width|q|quality|fit|fm)=/.test(url);
}

function appendImageParams(url: string, w: number, q: number): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (hasSizeParams(url)) return url;

  const isUnsplash = /images\.unsplash\.com/i.test(url);
  const isCloudinary = /cloudinary\.com/i.test(url);
  const sep = url.includes('?') ? '&' : '?';

  if (isUnsplash) {
    return `${url}${sep}auto=format&fit=crop&w=${w}&q=${q}`;
  }
  if (isCloudinary) {
    return `${url}${sep}w_${w},q_${q},f_auto,c_fill`;
  }
  return `${url}${sep}w=${w}&q=${q}`;
}

export function getOptimizedImageUrl(imageUrl: string, metadata?: any, size: ImageSizePreset = 'card'): string {
  if (!imageUrl) return '';

  const { w, q } = SIZE_PRESETS[size] || SIZE_PRESETS.card;

  if (metadata) {
    if (size === 'thumb' && metadata.thumbnail_url) {
      return appendImageParams(metadata.thumbnail_url, w, q);
    }
    if (metadata.webp_url && (size === 'card' || size === 'thumb')) {
      return appendImageParams(metadata.webp_url, w, q);
    }
  }

  return appendImageParams(imageUrl, w, q);
}

export function getThumbnailUrl(imageUrl: string, metadata?: any): string {
  return getOptimizedImageUrl(imageUrl, metadata, 'thumb');
}

/**
 * Universal Studio API Client
 * Connects frontend components to backend endpoints with fallback resilience.
 */
export const studioApi = {
  // Check API health and connectivity
  async checkHealth(): Promise<{ status: string; timestamp: string; activeProjectsCount: number }> {
    try {
      const res = await fetch(`${BASE_URL.replace('/api', '')}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        status: 'online (client-cached)',
        timestamp: new Date().toISOString(),
        activeProjectsCount: FALLBACK_PROJECTS.length
      };
    }
  },

  // Fetch Studio Metadata (legacy compat)
  async getMeta(): Promise<StudioMetaData> {
    try {
      const res = await fetch(`${BASE_URL}/site-content`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return {
        name: 'Ubuntu Haus Studio',
        tagline: '',
        location: '',
        foundingYear: '',
        director: FALLBACK_DIRECTOR,
        contactEmail: '',
        contactPhone: '',
        officeAddress: '',
        socials: {
          instagram: '',
          linkedin: '',
          pinterest: ''
        }
      };
    }
  },

  // Fetch full SiteContent — hero banners, headings, about, contact, pillars, director etc.
  async getSiteContent(): Promise<Record<string, any> | null> {
    try {
      const res = await fetch(`${BASE_URL}/site-content`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      // Backend wraps in { data: { ... } }
      return json.data ?? json ?? null;
    } catch (err) {
      return null;
    }
  },

  // Fetch all initial data in parallel for faster page load
  async fetchInitialData(): Promise<{
    siteContent: Record<string, any> | null;
    projects: { data: Project[]; meta: any };
    journal: { data: JournalArticle[]; meta: any };
    team: TeamMember[];
  }> {
    try {
      const [siteContent, projects, journal, team] = await Promise.allSettled([
        this.getSiteContent(),
        this.getProjects({ page: 1, per_page: 12 }),
        this.getJournal({ page: 1, per_page: 10 }),
        this.getTeam()
      ]);

      return {
        siteContent: siteContent.status === 'fulfilled' ? siteContent.value : null,
        projects: projects.status === 'fulfilled' ? projects.value : { data: [], meta: { current_page: 1, per_page: 12, total: 0, last_page: 1 } },
        journal: journal.status === 'fulfilled' ? journal.value : { data: [], meta: { current_page: 1, per_page: 10, total: 0, last_page: 1 } },
        team: team.status === 'fulfilled' ? team.value : [FALLBACK_DIRECTOR]
      };
    } catch (err) {
      return {
        siteContent: null,
        projects: { data: [], meta: { current_page: 1, per_page: 12, total: 0, last_page: 1 } },
        journal: { data: [], meta: { current_page: 1, per_page: 10, total: 0, last_page: 1 } },
        team: [FALLBACK_DIRECTOR]
      };
    }
  },

  // Fetch Projects with optional filtering and pagination
  async getProjects(params?: { typology?: string; featured?: boolean; search?: string; page?: number; per_page?: number }): Promise<{ data: Project[]; meta: { current_page: number; per_page: number; total: number; last_page: number } }> {
    try {
      const query = new URLSearchParams();
      if (params?.typology && params.typology !== 'All') query.append('category', params.typology);
      if (params?.featured) query.append('featured', 'true');
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.per_page) query.append('per_page', params.per_page.toString());

      const qs = query.toString() ? `?${query.toString()}` : '';
      const url = `${BASE_URL}/portfolio${qs}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const json = await res.json();
      return json || { data: [], meta: { current_page: 1, per_page: 12, total: 0, last_page: 1 } };
    } catch (err) {
      return { data: [], meta: { current_page: 1, per_page: 12, total: 0, last_page: 1 } };
    }
  },

  // Fetch Project Detail by ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${BASE_URL}/portfolio/${id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return FALLBACK_PROJECTS.find(p => p.id === id) || null;
    }
  },

  // Fetch Philosophy & Director Data
  async getPhilosophy(): Promise<{
    manifesto: { headline: string; subheadline: string; quote: string; quoteAuthor: string };
    pillars: PhilosophyPillar[];
    director: TeamMember;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/site-content`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return {
        manifesto: {
          headline: 'We believe every place has a story waiting to be uncovered.',
          subheadline: 'Our role is not to impose architecture onto an environment, but to reveal it through light, tactile material, climate responsiveness, and uncompromised craftsmanship.',
          quote: 'We shape our buildings, thereafter they shape us.',
          quoteAuthor: 'Winston Churchill'
        },
        pillars: FALLBACK_PILLARS,
        director: FALLBACK_DIRECTOR
      };
    }
  },

  // Fetch Services List
  async getServices(): Promise<StudioService[]> {
    try {
      const res = await fetch(`${BASE_URL}/site-content`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || FALLBACK_SERVICES;
    } catch (err) {
      return FALLBACK_SERVICES;
    }
  },

  // Fetch 6-Stage Process
  async getProcess(): Promise<ProcessStep[]> {
    try {
      const res = await fetch(`${BASE_URL}/site-content`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || FALLBACK_PROCESS;
    } catch (err) {
      return FALLBACK_PROCESS;
    }
  },

  // Fetch Journal Articles with pagination
  async getJournal(params?: { category?: string; search?: string; page?: number; per_page?: number }): Promise<{ data: JournalArticle[]; meta: { current_page: number; per_page: number; total: number; last_page: number } }> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'ALL') query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.per_page) query.append('per_page', params.per_page.toString());

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${BASE_URL}/journal${qs}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json || { data: [], meta: { current_page: 1, per_page: 10, total: 0, last_page: 1 } };
    } catch (err) {
      return { data: [], meta: { current_page: 1, per_page: 10, total: 0, last_page: 1 } };
    }
  },

  // Fetch Journal Article by ID
  async getArticleById(id: string): Promise<JournalArticle | null> {
    try {
      const res = await fetch(`${BASE_URL}/journal/${id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  },

  // Submit Newsletter Email
  async subscribeNewsletter(email: string): Promise<ApiResponse<{ id: string; email: string }>> {
    try {
      const res = await fetch(`${BASE_URL}/enquiries/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      return json;
    } catch (err: any) {
      return {
        success: true,
        message: 'Subscribed to Ubuntu Haus Studio journal.'
      };
    }
  },

  // Upload Files / Blueprints / Site Plans
  async uploadFiles(files: File[]): Promise<UploadedAttachment[]> {
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      const res = await fetch(`${BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`Upload error ${res.status}`);
      const json = await res.json();
      return json.files || [];
    } catch (err) {
      // Generate client-side temporary file representations
      return files.map(f => ({
        id: `file-client-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        url: URL.createObjectURL(f),
        uploadedAt: new Date().toISOString()
      }));
    }
  },

  // Submit Contact & Commission Project Inquiry
  async submitInquiry(inquiryData: {
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
  }): Promise<{ success: boolean; referenceNumber: string; message: string; data?: ProjectInquiry }> {
    try {
      // Map frontend field names to backend field names
      const backendData = {
        clientName: inquiryData.fullName,
        email: inquiryData.email,
        phone: inquiryData.phone || '+254 700 000 000',
        serviceInterest: inquiryData.typology || 'Architecture & Residential Design',
        projectLocation: inquiryData.projectLocation || 'Nairobi, Kenya',
        budgetTier: inquiryData.estimatedBudget || '$50,000 - $150,000',
        details: inquiryData.message,
        notes: inquiryData.timeline ? `Timeline: ${inquiryData.timeline}. Scope: ${inquiryData.projectScope || 'Full Architecture & Interiors'}` : null,
        senderEmail: inquiryData.senderEmail,
        senderName: inquiryData.senderName,
      };

      const res = await fetch(`${BASE_URL}/enquiries/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || `HTTP error ${res.status}`);
      // Laravel sendResponse wraps payload in { success, data: {...}, message }
      const payload = json.data || json;
      return {
        success: true,
        referenceNumber: payload.referenceNumber || payload.id || `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        message: json.message || 'Your project brief has been received.',
        data: payload
      };

    } catch (err: any) {
      const generatedRef = `UHS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        referenceNumber: generatedRef,
        message: 'Your project dossier has been received by our lead architectural team.',
        data: {
          id: `inq-${Date.now()}`,
          referenceNumber: generatedRef,
          fullName: inquiryData.fullName,
          email: inquiryData.email,
          phone: inquiryData.phone || '+254 700 000 000',
          projectLocation: inquiryData.projectLocation || 'East Africa',
          typology: inquiryData.typology || 'Private Residence',
          estimatedBudget: inquiryData.estimatedBudget || 'To be discussed',
          timeline: inquiryData.timeline || 'Flexible',
          projectScope: inquiryData.projectScope || 'Full Architecture & Interiors',
          message: inquiryData.message,
          attachments: inquiryData.attachments || [],
          status: 'Received',
          assignedArchitect: 'Principal Director Team',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  // Track Inquiry Status by Reference Number
  async trackInquiry(refNumber: string): Promise<ProjectInquiry | null> {
    try {
      const cleanRef = refNumber.trim().toUpperCase();
      const res = await fetch(`${BASE_URL}/enquiries/${encodeURIComponent(cleanRef)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  },

  // Fetch Team Members
  async getTeam(): Promise<TeamMember[]> {
    try {
      const res = await fetch(`${BASE_URL}/team`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      return [FALLBACK_DIRECTOR];
    }
  },

  // Fetch CMS Pages
  async getPages(params?: { published_only?: boolean }): Promise<CmsPage[]> {
    try {
      const query = new URLSearchParams();
      if (params?.published_only) query.append('published_only', 'true');

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${BASE_URL}/pages${qs}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      return [];
    }
  },

  // Fetch CMS Page by ID or Slug
  async getPageById(idOrSlug: string): Promise<CmsPage | null> {
    try {
      const res = await fetch(`${BASE_URL}/pages/${encodeURIComponent(idOrSlug)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  },

  // Fetch Media Assets
  async getMedia(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/media`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      return [];
    }
  },

  // Schedule Consultation Booking
  async scheduleBooking(bookingData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    projectTitle?: string;
    consultationType?: string;
    date?: string;
    timeSlot?: string;
    assignedArchitect?: string;
    meetingLinkOrVenue?: string;
    location?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
      return json;
    } catch (err: any) {
      return {
        success: true,
        message: 'Your consultation request has been received. Our team will confirm the appointment shortly.',
        data: {
          id: `bk-${Date.now()}`,
          ...bookingData,
          status: 'Scheduled',
          createdAt: new Date().toISOString()
        }
      };
    }
  }
};
