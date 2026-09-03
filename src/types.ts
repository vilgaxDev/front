export interface Project {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
  status: string;
  typology: 'Private Residence' | 'Commercial' | 'Interiors' | 'Landscape' | 'Master Planning';
  area: string;
  services?: string[];
  description: string;
  materialityNarrative?: string;
  heroImage: string;
  gallery: string[];
  featured?: boolean;
}

export interface JournalArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  heroImage?: string;
  metadata?: any;
  content: string;
  excerpt: string;
  featured?: boolean;
}

export interface BrandColor {
  name: string;
  hex: string;
  cmyk: string;
  description: string;
  sampleType: 'light' | 'dark' | 'accent';
}

export interface TeamMember {
  name: string;
  title: string;
  role?: string;
  bio: string;
  extendedBio: string;
  image: string;
  signatureText?: string;
}

export interface StudioService {
  title: string;
  description: string;
  iconName: string;
  image?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  iconName: string;
  description: string;
}

export interface PhilosophyPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface UploadedAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  formattedSize?: string;
}

export interface ProjectInquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  projectLocation: string;
  typology: string;
  estimatedBudget: string;
  timeline: string;
  projectScope: string;
  message: string;
  attachments?: UploadedAttachment[];
  status: 'Received' | 'In Review' | 'Architect Assigned' | 'Consultation Scheduled';
  assignedArchitect?: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface StudioMetaData {
  name: string;
  tagline: string;
  location: string;
  foundingYear: string;
  director: TeamMember;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  socials: {
    instagram: string;
    linkedin: string;
    pinterest: string;
  };
}

export interface SiteContent {
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroSubheading?: string;
  tagline?: string;
  heroBannerImage?: string;
  heroBannerImages?: string[];
  studioLocation?: string;
  directEmail?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  instagramHandle?: string;
  officeHours?: string;
  countdownDate?: string;
  countdownTitle?: string;
  audioEnabled?: boolean;
  aboutTitle?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutHeroImage?: string;
  manifestoHeadline?: string;
  manifestoSubheadline?: string;
  manifestoQuote?: string;
  manifestoQuoteAuthor?: string;
  pillar1Title?: string;
  pillar1Subtitle?: string;
  pillar1Description?: string;
  pillar2Title?: string;
  pillar2Subtitle?: string;
  pillar2Description?: string;
  pillar3Title?: string;
  pillar3Subtitle?: string;
  pillar3Description?: string;
  directorName?: string;
  directorTitle?: string;
  directorBio?: string;
  directorExtendedBio?: string;
  directorImage?: string;
}

export interface CmsSection {
  id: string;
  page_id: string;
  section_key: string;
  section_type: 'narrative' | 'hero' | 'media' | 'gallery' | 'cta' | 'stats' | 'team' | 'testimonials';
  heading?: string;
  subheading?: string;
  body_text?: string;
  media_url?: string;
  secondary_media_url?: string;
  hero_badge?: string;
  button_label?: string;
  button_url?: string;
  config_json?: any;
  sort_order: number;
  is_visible: boolean;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  nav_label: string;
  template: 'standard' | 'landing' | 'full-width' | 'minimal';
  meta_title?: string;
  meta_description?: string;
  hero_image?: string;
  hero_badge?: string;
  content_html?: string;
  content_json?: any;
  is_published: boolean;
  is_in_navigation: boolean;
  sort_order: number;
  sections?: CmsSection[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
