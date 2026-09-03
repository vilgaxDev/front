import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";

// Create storage directory for uploaded files if it doesn't exist
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer configuration for file uploads (drawings, site plans, briefs, renders, PDFs)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 35 * 1024 * 1024 // 35MB max file size for architectural drawings & CAD exports
  }
});

// Initial Studio Datasets
const initialDirector = {
  name: "MOKUA OCHARO",
  title: "DIRECTOR & PRINCIPAL ARCHITECT",
  bio: "Architect with a passion for creating meaningful environments that respond to people, place and purpose.",
  extendedBio: "Mokua leads the studio with a vision for timeless design and enduring impact.",
  image: "/director_portrait.jpeg",
  signatureText: "Mokua Ocharo"
};

const initialPhilosophyPillars = [
  {
    number: "01",
    title: "Contextual Harmony",
    subtitle: "ROOTED IN PLACE, GUIDED BY PURPOSE",
    description: "We draw inspiration from the land, its people, traditions, and climate."
  },
  {
    number: "02",
    title: "Human Sanctuary",
    subtitle: "DESIGNING FOR BELONGING",
    description: "More than buildings, we create spaces that foster connection and well-being."
  },
  {
    number: "03",
    title: "Material Integrity",
    subtitle: "CRAFTSMANSHIP & LEGACY",
    description: "We celebrate raw stone, terra cotta, bronze joinery, and sustainable wood."
  }
];

const initialProjects: any[] = [];
const initialJournalArticles: any[] = [];

const initialServices = [
  {
    title: "ARCHITECTURE",
    description: "Bespoke architectural design that responds to context, people and purpose.",
    iconName: "Building2"
  },
  {
    title: "INTERIORS",
    description: "Timeless interiors that blend materiality, function and atmosphere.",
    iconName: "Armchair"
  },
  {
    title: "MASTER PLANNING",
    description: "Strategic planning for communities that are sustainable and future ready.",
    iconName: "Compass"
  },
  {
    title: "LANDSCAPE DESIGN",
    description: "Outdoor spaces that connect people with nature and enhance well-being.",
    iconName: "Trees"
  },
  {
    title: "DESIGN ADVISORY",
    description: "Expert guidance at every stage to help bring your vision to life.",
    iconName: "Sliders"
  }
];

const initialProcessSteps = [
  {
    number: "01",
    title: "LISTEN",
    iconName: "Ear",
    description: "We listen deeply to understand your needs, context and aspirations."
  },
  {
    number: "02",
    title: "IMAGINE",
    iconName: "Pencil",
    description: "We explore ideas and create concepts that inspire and add value."
  },
  {
    number: "03",
    title: "DESIGN",
    iconName: "Box",
    description: "We craft refined designs that balance beauty, function and sustainability."
  },
  {
    number: "04",
    title: "REFINE",
    iconName: "Ruler",
    description: "We develop and detail every aspect with care and precision."
  },
  {
    number: "05",
    title: "BUILD",
    iconName: "Hammer",
    description: "We collaborate closely to bring the design to life with quality and integrity."
  },
  {
    number: "06",
    title: "LIVE",
    iconName: "Home",
    description: "We create spaces that enrich lives and stand the test of time."
  }
];

// Persistent In-Memory Data Store (persists for runtime)
let projectsDB = [...initialProjects];
let journalDB = [...initialJournalArticles];
let subscribersDB: Array<{ id: string; email: string; subscribedAt: string }> = [
  { id: "sub-1", email: "client.archive@gmail.com", subscribedAt: new Date().toISOString() }
];

let inquiriesDB: Array<{
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
  attachments?: Array<{ id: string; name: string; size: number; type: string; url: string; uploadedAt: string }>;
  status: "Received" | "In Review" | "Architect Assigned" | "Consultation Scheduled";
  assignedArchitect?: string;
  createdAt: string;
}> = [
  {
    id: "inq-1001",
    referenceNumber: "UHS-2026-8812",
    fullName: "Wanjiku Nderitu",
    email: "wanjiku.n@eastafricanestates.com",
    phone: "+254 712 345 678",
    projectLocation: "Tigoni, Limuru",
    typology: "Private Residence",
    estimatedBudget: "$750k - $1.5M",
    timeline: "3-6 Months",
    projectScope: "Full Architectural & Interior Design",
    message: "Seeking a contextual hillside residence capturing tea farm views with sustainable geothermal heating.",
    attachments: [],
    status: "Architect Assigned",
    assignedArchitect: "Mokua Ocharo (Principal)",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let uploadedFilesDB: Array<{
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}> = [];

async function startServer() {
  const app = express();
  const PORT = 3001;

  // JSON & URL-encoded body parser with generous limits for file base64 data
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Static uploads directory serving
  app.use("/uploads", express.static(UPLOADS_DIR));

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // 1. Health & Server Info
  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      status: "online",
      studio: "Ubuntu Haus Studio",
      location: "Nairobi, Kenya",
      timestamp: new Date().toISOString(),
      activeProjectsCount: projectsDB.length,
      publishedArticlesCount: journalDB.length,
      receivedInquiriesCount: inquiriesDB.length
    });
  });

  // 2. Studio Meta & Profile Information
  app.get("/api/meta", (_req, res) => {
    res.json({
      success: true,
      data: {
        name: "Ubuntu Haus Studio",
        tagline: "Architecture & Spatial Design Practice",
        location: "Nairobi, Kenya",
        foundingYear: "2018",
        director: initialDirector,
        contactEmail: "info@ubuntuhaus.com",
        contactPhone: "+254 700 000 000",
        officeAddress: "Riverside Drive, Nairobi, Kenya",
        socials: {
          instagram: "https://instagram.com/ubuntuhaus",
          linkedin: "https://linkedin.com/company/ubuntu-haus",
          pinterest: "https://pinterest.com/ubuntuhaus"
        }
      }
    });
  });

  // 3. Projects Endpoints (List, Filter & Individual Detail)
  app.get("/api/projects", (req, res) => {
    const { typology, featured, search } = req.query;
    let results = [...projectsDB];

    if (typology && typeof typology === "string" && typology !== "All") {
      results = results.filter(
        (p) => p.typology.toLowerCase() === typology.toLowerCase()
      );
    }

    if (featured === "true") {
      results = results.filter((p) => p.featured);
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: results.length,
      data: results
    });
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = projectsDB.find((p) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    res.json({ success: true, data: project });
  });

  // Create new project endpoint (for expanding portfolio)
  app.post("/api/projects", (req, res) => {
    const newProject = {
      id: req.body.id || `project-${Date.now()}`,
      title: req.body.title || "Untitled Architectural Project",
      subtitle: req.body.subtitle || "BESPOKE SPACE",
      location: req.body.location || "Nairobi, Kenya",
      year: req.body.year || new Date().getFullYear().toString(),
      status: req.body.status || "In Concept",
      typology: req.body.typology || "Private Residence",
      area: req.body.area || "450 m²",
      services: req.body.services || ["Architecture", "Interiors"],
      description: req.body.description || "Bespoke spatial design.",
      heroImage: req.body.heroImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
      gallery: req.body.gallery || [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
      ],
      featured: req.body.featured || false
    };
    projectsDB.unshift(newProject);
    res.status(201).json({ success: true, data: newProject, message: "Project created successfully" });
  });

  // 4. Philosophy & Pillars Endpoint
  app.get("/api/philosophy", (_req, res) => {
    res.json({
      success: true,
      data: {
        manifesto: {
          headline: "We believe every place has a story waiting to be uncovered.",
          subheadline: "Our role is not to impose architecture onto an environment, but to reveal it through light, tactile material, climate responsiveness, and uncompromised craftsmanship.",
          quote: "We shape our buildings, thereafter they shape us.",
          quoteAuthor: "Winston Churchill"
        },
        pillars: initialPhilosophyPillars,
        director: initialDirector
      }
    });
  });

  // 5. Services & Process Methodology Endpoint
  app.get("/api/services", (_req, res) => {
    res.json({
      success: true,
      total: initialServices.length,
      data: initialServices
    });
  });

  app.get("/api/process", (_req, res) => {
    res.json({
      success: true,
      total: initialProcessSteps.length,
      data: initialProcessSteps
    });
  });

  // 6. Journal Articles Endpoints
  app.get("/api/journal", (req, res) => {
    const { category, search } = req.query;
    let results = [...journalDB];

    if (category && typeof category === "string" && category !== "ALL") {
      results = results.filter(
        (a) => a.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: results.length,
      data: results
    });
  });

  app.get("/api/journal/:id", (req, res) => {
    const article = journalDB.find((a) => a.id === req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: "Article not found" });
    }
    res.json({ success: true, data: article });
  });

  // 7. Newsletter Subscription Endpoint
  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email address is required" });
    }

    const existing = subscribersDB.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({
        success: true,
        message: "You are already subscribed to studio updates and journal essays."
      });
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: email.trim(),
      subscribedAt: new Date().toISOString()
    };
    subscribersDB.push(newSub);

    res.json({
      success: true,
      message: "Thank you for subscribing to Ubuntu Haus Studio journal.",
      data: newSub
    });
  });

  // 8. Contact & Commission Inquiry Submission Endpoint
  app.post("/api/contact", (req, res) => {
    const {
      fullName,
      email,
      phone,
      projectLocation,
      typology,
      estimatedBudget,
      timeline,
      projectScope,
      message,
      attachments
    } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, and project message are required."
      });
    }

    // Generate unique inquiry reference code (e.g., UHS-2026-XXXX)
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `UHS-${new Date().getFullYear()}-${randomHex}`;

    const newInquiry = {
      id: `inq-${Date.now()}`,
      referenceNumber,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone || "Not specified",
      projectLocation: projectLocation || "East Africa",
      typology: typology || "Private Residence",
      estimatedBudget: estimatedBudget || "To be discussed",
      timeline: timeline || "Flexible",
      projectScope: projectScope || "Full Architectural & Interior Delivery",
      message: message.trim(),
      attachments: attachments || [],
      status: "Received" as const,
      assignedArchitect: "Principal Director Team",
      createdAt: new Date().toISOString()
    };

    inquiriesDB.unshift(newInquiry);

    res.status(201).json({
      success: true,
      message: "Your project dossier has been received by our lead architectural team.",
      referenceNumber: newInquiry.referenceNumber,
      data: newInquiry
    });
  });

  // 9. Check Status of an Inquiry by Reference Number
  app.get("/api/inquiries/:ref", (req, res) => {
    const ref = req.params.ref.toUpperCase();
    const inquiry = inquiriesDB.find(
      (inq) => inq.referenceNumber.toUpperCase() === ref || inq.id === ref
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: `No architectural dossier found for reference ${ref}. Please check the reference code.`
      });
    }

    res.json({
      success: true,
      data: inquiry
    });
  });

  // 10. List Inquiries (for studio review/management)
  app.get("/api/inquiries", (_req, res) => {
    res.json({
      success: true,
      total: inquiriesDB.length,
      data: inquiriesDB
    });
  });

  // 11. File / Blueprint / Site Plan / Document Upload Endpoint
  // Supports multipart file upload (via multer) AND base64 JSON payload
  app.post("/api/upload", upload.array("files", 10) as any, (req: any, res: any) => {
    try {
      const uploadedResults = [];

      // If multipart files were uploaded via multer:
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files as Express.Multer.File[]) {
          const item = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString()
          };
          uploadedFilesDB.push(item);
          uploadedResults.push(item);
        }
      } 
      // If client submitted base64 or JSON file objects:
      else if (req.body.files && Array.isArray(req.body.files)) {
        for (const fileObj of req.body.files) {
          const item = {
            id: fileObj.id || `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: fileObj.name || "Architectural_Document.pdf",
            size: fileObj.size || 1024 * 150,
            type: fileObj.type || "application/pdf",
            url: fileObj.url || `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200`,
            uploadedAt: new Date().toISOString()
          };
          uploadedFilesDB.push(item);
          uploadedResults.push(item);
        }
      } else if (req.body.name) {
        const item = {
          id: req.body.id || `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: req.body.name,
          size: req.body.size || 1024 * 100,
          type: req.body.type || "image/jpeg",
          url: req.body.url || `/uploads/${req.body.name}`,
          uploadedAt: new Date().toISOString()
        };
        uploadedFilesDB.push(item);
        uploadedResults.push(item);
      }

      res.status(200).json({
        success: true,
        message: `${uploadedResults.length} architectural document(s) uploaded successfully.`,
        files: uploadedResults
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to process uploaded file: " + (err.message || "Unknown error")
      });
    }
  });

  // ==========================================
  // Vite Middleware Integration (Dev & Prod)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ubuntu Haus Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
