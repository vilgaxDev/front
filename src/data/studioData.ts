import { Project, JournalArticle, BrandColor, TeamMember, ProcessStep, StudioService } from '../types';
import directorPortrait from '../../assets/director_portrait.jpeg';

export const BRAND_COLORS: BrandColor[] = [
  {
    name: 'Charcoal',
    hex: '#1C1C1C',
    cmyk: 'CMYK 75/66/67/90',
    description: 'Deep architectural obsidian charcoal used for dark panels, contrast headers, and solid contact blocks.',
    sampleType: 'dark'
  },
  {
    name: 'Bronze',
    hex: '#8A6A3D',
    cmyk: 'CMYK 29/52/85/18',
    description: 'Warm metallic bronze accent representing East African earth, brass joinery details, and highlight typography.',
    sampleType: 'accent'
  },
  {
    name: 'Taupe',
    hex: '#D8D2C7',
    cmyk: 'CMYK 12/10/15/0',
    description: 'Refined warm limestone taupe used for subtle borders, section dividers, and structural grid lines.',
    sampleType: 'light'
  },
  {
    name: 'Sand',
    hex: '#E6E1DB',
    cmyk: 'CMYK 10/8/15/0',
    description: 'Soft warm sand beige for card containers, countdown unit blocks, and secondary backgrounds.',
    sampleType: 'light'
  },
  {
    name: 'Bone',
    hex: '#F4F1EC',
    cmyk: 'CMYK 4/4/6/0',
    description: 'Primary canvas background color providing an tactile, unbleached linen quality to the visual interface.',
    sampleType: 'light'
  },
  {
    name: 'White',
    hex: '#FFFFFF',
    cmyk: 'CMYK 0/0/0/0',
    description: 'Pure white highlight tone used for clean project proposal paper cards and crisp elevated elements.',
    sampleType: 'light'
  }
];

export const DIRECTOR_INFO: TeamMember = {
  name: 'MOKUA OCHARO',
  title: 'DIRECTOR & PRINCIPAL ARCHITECT',
  bio: 'Architect with a passion for creating meaningful environments that respond to people, place and purpose.',
  extendedBio: 'Mokua leads the studio with a vision for timeless design and enduring impact. With over 14 years of practice across East Africa and international studios, his work centers on materiality, natural light integration, and vernacular African architecture elevated through modern engineering.',
  image: '/director_portrait.jpeg',
  signatureText: 'Mokua Ocharo'
};

export const PHILOSOPHY_PILLARS = [
  {
    number: '01',
    title: 'Contextual Harmony',
    subtitle: 'ROOTED IN PLACE, GUIDED BY PURPOSE',
    description: 'We draw inspiration from the land, its people, traditions, and climate. Our work is a continuous dialogue between heritage and contemporary living.'
  },
  {
    number: '02',
    title: 'Human Sanctuary',
    subtitle: 'DESIGNING FOR BELONGING',
    description: 'More than buildings, we create spaces that foster connection, well-being, and a sense of identity. Spaces that bring people together.'
  },
  {
    number: '03',
    title: 'Material Integrity',
    subtitle: 'CRAFTSMANSHIP & LEGACY',
    description: 'We celebrate raw stone, terra cotta, bronze joinery, and sustainable wood. By prioritizing uncompromised craftsmanship, our architecture matures gracefully.'
  }
];

export const PROJECTS: Project[] = [];

export const JOURNAL_ARTICLES: JournalArticle[] = [];

export const SERVICES: StudioService[] = [
  {
    title: 'ARCHITECTURE',
    description: 'Bespoke architectural design that responds to context, people and purpose.',
    iconName: 'Building2'
  },
  {
    title: 'INTERIORS',
    description: 'Timeless interiors that blend materiality, function and atmosphere.',
    iconName: 'Armchair'
  },
  {
    title: 'MASTER PLANNING',
    description: 'Strategic planning for communities that are sustainable and future ready.',
    iconName: 'Compass'
  },
  {
    title: 'LANDSCAPE DESIGN',
    description: 'Outdoor spaces that connect people with nature and enhance well-being.',
    iconName: 'Trees'
  },
  {
    title: 'DESIGN ADVISORY',
    description: 'Expert guidance at every stage to help bring your vision to life.',
    iconName: 'Sliders'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'LISTEN',
    iconName: 'Ear',
    description: 'We listen deeply to understand your needs, context and aspirations.'
  },
  {
    number: '02',
    title: 'IMAGINE',
    iconName: 'Pencil',
    description: 'We explore ideas and create concepts that inspire and add value.'
  },
  {
    number: '03',
    title: 'DESIGN',
    iconName: 'Box',
    description: 'We craft refined designs that balance beauty, function and sustainability.'
  },
  {
    number: '04',
    title: 'REFINE',
    iconName: 'Ruler',
    description: 'We develop and detail every aspect with care and precision.'
  },
  {
    number: '05',
    title: 'BUILD',
    iconName: 'Hammer',
    description: 'We collaborate closely to bring the design to life with quality and integrity.'
  },
  {
    number: '06',
    title: 'LIVE',
    iconName: 'Home',
    description: 'We create spaces that enrich lives and stand the test of time.'
  }
];
