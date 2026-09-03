import { jsPDF } from 'jspdf';
import { Project } from '../types';

/**
 * Optimizes an image URL for fast, crisp PDF embedding (reduces unnecessary 4k payload)
 */
const optimizeImageUrl = (url: string, width = 1000): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    // Replace width and quality parameters for fast loading
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}`;
  }
  return url;
};

/**
 * Generates an architectural blueprint placeholder if an image fails to load
 */
const createArchitecturalPlaceholder = (title: string, width = 800, height = 500): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    ctx.fillStyle = '#232323';
    ctx.fillRect(0, 0, width, height);

    // Architectural Grid lines
    ctx.strokeStyle = '#353535';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#8A6A3D';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Typography
    ctx.fillStyle = '#8A6A3D';
    ctx.font = 'bold 16px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UBUNTU HAUS STUDIO · ARCHITECTURAL PERSPECTIVE', width / 2, height / 2 - 20);

    ctx.fillStyle = '#F4F1EC';
    ctx.font = 'bold 24px "Times New Roman", serif';
    ctx.fillText(title.toUpperCase(), width / 2, height / 2 + 15);

    ctx.fillStyle = '#A0A0A0';
    ctx.font = 'italic 14px "Montserrat", sans-serif';
    ctx.fillText('Official Architectural Render & Specification Model', width / 2, height / 2 + 42);

    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (e) {
    return '';
  }
};

/**
 * Loads an image from a URL and converts it into a base64 Data URL
 * Features robust CORS fallback, timeout protection, and automated fallback rendering.
 */
const loadImageAsBase64 = (url: string, projectTitle: string, width = 1000): Promise<{ dataUrl: string; width: number; height: number } | null> => {
  return new Promise((resolve) => {
    if (!url) {
      const fallback = createArchitecturalPlaceholder(projectTitle);
      resolve(fallback ? { dataUrl: fallback, width: 800, height: 500 } : null);
      return;
    }

    const targetUrl = optimizeImageUrl(url, width);
    let resolved = false;

    // Timeout fallback after 3.5 seconds to prevent hanging
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const fallback = createArchitecturalPlaceholder(projectTitle);
        resolve(fallback ? { dataUrl: fallback, width: 800, height: 500 } : null);
      }
    }, 3500);

    const finish = (result: { dataUrl: string; width: number; height: number } | null) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(result);
      }
    };

    // Strategy 1: HTML Image object with crossOrigin
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const naturalW = img.naturalWidth || img.width || 800;
        const naturalH = img.naturalHeight || img.height || 500;
        canvas.width = naturalW;
        canvas.height = naturalH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available');
        }
        ctx.drawImage(img, 0, 0, naturalW, naturalH);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        finish({ dataUrl, width: naturalW, height: naturalH });
      } catch (err) {
        // Strategy 2: Fetch Blob fallback
        fetch(targetUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              finish({
                dataUrl: reader.result as string,
                width: 800,
                height: 500,
              });
            };
            reader.onerror = () => {
              const fb = createArchitecturalPlaceholder(projectTitle);
              finish(fb ? { dataUrl: fb, width: 800, height: 500 } : null);
            };
            reader.readAsDataURL(blob);
          })
          .catch(() => {
            const fb = createArchitecturalPlaceholder(projectTitle);
            finish(fb ? { dataUrl: fb, width: 800, height: 500 } : null);
          });
      }
    };

    img.onerror = () => {
      // Fallback fetch
      fetch(targetUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            finish({
              dataUrl: reader.result as string,
              width: 800,
              height: 500,
            });
          };
          reader.onerror = () => {
            const fb = createArchitecturalPlaceholder(projectTitle);
            finish(fb ? { dataUrl: fb, width: 800, height: 500 } : null);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          const fb = createArchitecturalPlaceholder(projectTitle);
          finish(fb ? { dataUrl: fb, width: 800, height: 500 } : null);
        });
    };

    img.src = targetUrl;
  });
};

/**
 * Generates an Architectural Specification Dossier PDF for a given project/house
 * Loads the photo FIRST, strictly contains all graphics and typography inside margins,
 * and outputs a 2-page publication-grade PDF with the house's name.
 */
export const generateProjectPdf = async (project: Project): Promise<void> => {
  // 1. ASYNCHRONOUSLY PRE-LOAD ALL PHOTOS FIRST
  const [heroImgData, gallery1Data, gallery2Data] = await Promise.all([
    loadImageAsBase64(project.heroImage, project.title, 1200),
    project.gallery && project.gallery[0]
      ? loadImageAsBase64(project.gallery[0], `${project.title} Interior`, 800)
      : null,
    project.gallery && project.gallery[1]
      ? loadImageAsBase64(project.gallery[1], `${project.title} Detail`, 800)
      : null,
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210; // A4 standard mm
  const pageHeight = 297; // A4 standard mm
  const margin = 16; // 16mm margin
  const contentWidth = pageWidth - margin * 2; // 178mm
  const innerRight = pageWidth - margin; // 194mm
  const bottomLimit = pageHeight - margin - 8; // 273mm max content baseline

  // Helper for drawing the signature architectural border
  const drawPageFrame = (pageNumber: number, totalPages: number) => {
    // Background tone
    doc.setFillColor(244, 241, 236); // #F4F1EC (Bone)
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer double borders (strictly contained within page)
    doc.setDrawColor(216, 210, 199); // #D8D2C7
    doc.setLineWidth(0.6);
    doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

    doc.setDrawColor(138, 106, 61); // #8A6A3D
    doc.setLineWidth(0.3);
    doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2);

    // Running Top Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(138, 106, 61);
    doc.text('UBUNTU HAUS STUDIO', margin, margin + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('ARCHITECTURAL DOSSIER', margin + 42, margin + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`REF: UHS-${project.id.toUpperCase()} · ${project.year}`, innerRight, margin + 4, { align: 'right' });

    // Top Divider line
    doc.setDrawColor(216, 210, 199);
    doc.setLineWidth(0.4);
    doc.line(margin, margin + 7, innerRight, margin + 7);

    // Running Bottom Footer
    doc.setDrawColor(216, 210, 199);
    doc.setLineWidth(0.4);
    doc.line(margin, bottomLimit, innerRight, bottomLimit);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`Ubuntu Haus Studio  ·  ${project.title}  ·  Nairobi, Kenya`, margin, bottomLimit + 4.5);
    doc.text(`Page ${pageNumber} of ${totalPages}  ·  All Rights Reserved ©`, innerRight, bottomLimit + 4.5, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: PRIMARY ARCHITECTURAL DOSSIER
  // ==========================================
  drawPageFrame(1, 2);

  let cursorY = margin + 14;

  // 1. HOUSE NAME & SUBTITLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(138, 106, 61);
  doc.text('SELECTED ARCHITECTURAL WORK', margin, cursorY);

  cursorY += 6.5;
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(28, 28, 28);
  doc.text(project.title.toUpperCase(), margin, cursorY);

  cursorY += 5.5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 100, 100);
  const subtitleText = project.subtitle || `${project.typology} in ${project.location}`;
  doc.text(subtitleText, margin, cursorY);

  cursorY += 6;

  // 2. HERO PHOTO (LOADED FIRST & STRICTLY CONFINED INSIDE BORDERS)
  const heroHeight = 66; // 66mm height
  const heroWidth = contentWidth; // 178mm width (strictly inside margins)

  if (heroImgData) {
    try {
      // Dark under-layer frame
      doc.setFillColor(28, 28, 28);
      doc.rect(margin, cursorY, heroWidth, heroHeight, 'F');

      // Embed loaded hero image
      doc.addImage(heroImgData.dataUrl, 'JPEG', margin, cursorY, heroWidth, heroHeight);

      // Fine architectural border frame around image
      doc.setDrawColor(138, 106, 61);
      doc.setLineWidth(0.4);
      doc.rect(margin, cursorY, heroWidth, heroHeight);

      // Caption Overlay Tag at bottom left
      doc.setFillColor(28, 28, 28);
      doc.rect(margin + 3, cursorY + heroHeight - 6, 75, 4.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(244, 241, 236);
      doc.text(`PRIMARY ARCHITECTURAL VIEW  ·  ${project.title.toUpperCase()}`, margin + 5, cursorY + heroHeight - 2.8);

      cursorY += heroHeight + 6;
    } catch (e) {
      cursorY += 4;
    }
  }

  // 3. ARCHITECTURAL SPECIFICATIONS GRID (STRICTLY CONTAINED)
  const specBoxH = 28;
  doc.setFillColor(230, 225, 219); // Sand (#E6E1DB)
  doc.rect(margin, cursorY, contentWidth, specBoxH, 'F');
  doc.setDrawColor(216, 210, 199);
  doc.setLineWidth(0.4);
  doc.rect(margin, cursorY, contentWidth, specBoxH);

  // 3-Column layout inside box
  const c1 = margin + 5;
  const c2 = margin + contentWidth / 3 + 2;
  const c3 = margin + (contentWidth / 3) * 2 + 2;

  let row1Y = cursorY + 5.5;
  let row2Y = cursorY + 16.5;

  const drawSpec = (x: number, y: number, label: string, val: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(138, 106, 61);
    doc.text(label.toUpperCase(), x, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(28, 28, 28);
    doc.text(val, x, y + 3.8);
  };

  drawSpec(c1, row1Y, 'House / Project', project.title);
  drawSpec(c2, row1Y, 'Typology', project.typology);
  drawSpec(c3, row1Y, 'Location', project.location);

  drawSpec(c1, row2Y, 'Built Area', project.area || 'Custom Scale');
  drawSpec(c2, row2Y, 'Year Completed', project.year);
  drawSpec(c3, row2Y, 'Status', project.status);

  cursorY += specBoxH + 6;

  // 4. ARCHITECTURAL CONCEPT & DESIGN STATEMENT
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(138, 106, 61);
  doc.text('ARCHITECTURAL STATEMENT & CONCEPT', margin, cursorY);

  cursorY += 4.5;
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  const descText =
    project.description ||
    'This residence exemplifies Ubuntu Haus Studio’s commitment to contextual harmony, honest materiality, and spatial designs crafted for deep human belonging.';
  
  // Constrain to maximum 3 lines so it never overflows past bottom margin
  const descLines = doc.splitTextToSize(descText, contentWidth).slice(0, 3);
  doc.text(descLines, margin, cursorY);

  cursorY += descLines.length * 4.2 + 5;

  // 5. SERVICES & DISCIPLINES RENDERED (TIGHT & NEAT)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(138, 106, 61);
  doc.text('DISCIPLINES & SERVICES RENDERED', margin, cursorY);

  cursorY += 4.2;
  const servicesList =
    project.services && project.services.length > 0
      ? project.services
      : ['Architecture', 'Interior Design', 'Site Planning'];

  servicesList.slice(0, 3).forEach((serv) => {
    doc.setFillColor(138, 106, 61);
    doc.circle(margin + 2, cursorY - 1, 0.8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(serv, margin + 5.5, cursorY);
    cursorY += 4;
  });

  // ==========================================
  // PAGE 2: VISUAL GALLERY & MATERIALITY
  // ==========================================
  doc.addPage('a4', 'portrait');
  drawPageFrame(2, 2);

  let p2Y = margin + 14;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(138, 106, 61);
  doc.text('VISUAL PERSPECTIVES & SPATIAL GALLERY', margin, p2Y);

  p2Y += 5.5;

  // 1. DUAL GALLERY PERSPECTIVES (STRICTLY CONTAINED)
  const gWidth = (contentWidth - 6) / 2; // 86mm each
  const gHeight = 54; // 54mm height

  if (gallery1Data && gallery2Data) {
    try {
      // Perspective A
      doc.addImage(gallery1Data.dataUrl, 'JPEG', margin, p2Y, gWidth, gHeight);
      doc.setDrawColor(138, 106, 61);
      doc.setLineWidth(0.4);
      doc.rect(margin, p2Y, gWidth, gHeight);

      doc.setFillColor(28, 28, 28);
      doc.rect(margin + 2, p2Y + gHeight - 5.5, gWidth - 4, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(244, 241, 236);
      doc.text('PERSPECTIVE A  ·  INTERIOR ATMOSPHERE', margin + 4, p2Y + gHeight - 2.8);

      // Perspective B
      const g2X = margin + gWidth + 6;
      doc.addImage(gallery2Data.dataUrl, 'JPEG', g2X, p2Y, gWidth, gHeight);
      doc.setDrawColor(138, 106, 61);
      doc.setLineWidth(0.4);
      doc.rect(g2X, p2Y, gWidth, gHeight);

      doc.setFillColor(28, 28, 28);
      doc.rect(g2X + 2, p2Y + gHeight - 5.5, gWidth - 4, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(244, 241, 236);
      doc.text('PERSPECTIVE B  ·  MATERIAL HARMONY', g2X + 4, p2Y + gHeight - 2.8);

      p2Y += gHeight + 7;
    } catch (e) {
      p2Y += 6;
    }
  } else if (gallery1Data || heroImgData) {
    const single = gallery1Data || heroImgData;
    if (single) {
      try {
        doc.addImage(single.dataUrl, 'JPEG', margin, p2Y, contentWidth, 54);
        doc.setDrawColor(138, 106, 61);
        doc.setLineWidth(0.4);
        doc.rect(margin, p2Y, contentWidth, 54);
        p2Y += 60;
      } catch (e) {
        p2Y += 6;
      }
    }
  }

  // 2. MATERIALITY & PALETTE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(138, 106, 61);
  doc.text('TACTILE MATERIALITY & PALETTE IDENTITY', margin, p2Y);

  p2Y += 4.5;

  const paletteBoxes = [
    { name: 'Charcoal', hex: '#1C1C1C', rgb: [28, 28, 28] },
    { name: 'Bronze', hex: '#8A6A3D', rgb: [138, 106, 61] },
    { name: 'Taupe', hex: '#D8D2C7', rgb: [216, 210, 199] },
    { name: 'Sand', hex: '#E6E1DB', rgb: [230, 225, 219] },
    { name: 'Bone', hex: '#F4F1EC', rgb: [244, 241, 236] },
  ];

  const pBoxWidth = (contentWidth - (paletteBoxes.length - 1) * 3) / paletteBoxes.length;
  paletteBoxes.forEach((item, index) => {
    const boxX = margin + index * (pBoxWidth + 3);
    doc.setFillColor(item.rgb[0], item.rgb[1], item.rgb[2]);
    doc.rect(boxX, p2Y, pBoxWidth, 8, 'F');
    doc.setDrawColor(216, 210, 199);
    doc.setLineWidth(0.3);
    doc.rect(boxX, p2Y, pBoxWidth, 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(28, 28, 28);
    doc.text(item.name, boxX + pBoxWidth / 2, p2Y + 11.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 100, 100);
    doc.text(item.hex, boxX + pBoxWidth / 2, p2Y + 14.5, { align: 'center' });
  });

  p2Y += 21;

  // 3. ENVIRONMENTAL INTEGRATION NOTE (STRICTLY CONTAINED)
  doc.setFillColor(230, 225, 219);
  doc.rect(margin, p2Y, contentWidth, 20, 'F');
  doc.setDrawColor(216, 210, 199);
  doc.setLineWidth(0.3);
  doc.rect(margin, p2Y, contentWidth, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(138, 106, 61);
  doc.text('ENVIRONMENTAL INTEGRATION & PASSIVE CLIMATIC DESIGN', margin + 4, p2Y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  const sustainText =
    'This project integrates cross-ventilation corridors, deep solar overhangs, locally quarried stone, and low-embodied carbon timber to ensure optimal thermal performance in the East African climate.';
  const sustainLines = doc.splitTextToSize(sustainText, contentWidth - 8).slice(0, 2);
  doc.text(sustainLines, margin + 4, p2Y + 9.5);

  // 4. SIGNATURE & STUDIO CONTACT BLOCK (STRICTLY ABOVE BOTTOM MARGIN)
  const sigY = bottomLimit - 24;

  doc.setDrawColor(216, 210, 199);
  doc.setLineWidth(0.4);
  doc.line(margin, sigY, innerRight, sigY);

  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(138, 106, 61);
  doc.text('Mokua Ocharo', margin, sigY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(28, 28, 28);
  doc.text('Director & Principal Architect  ·  Ubuntu Haus Studio', margin, sigY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 90);
  doc.text('Nairobi, Kenya  ·  hello@ubuntuhaus.co.ke  ·  +254 700 123 456', margin, sigY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(138, 106, 61);
  doc.text('OFFICIAL ARCHITECTURAL DOSSIER', innerRight, sigY + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, innerRight, sigY + 12, { align: 'right' });
  doc.text('Confidential Client Copy', innerRight, sigY + 16, { align: 'right' });

  // 5. DOWNLOAD FILE WITH HOUSE NAME
  const sanitizedTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, '-');
  const filename = `Ubuntu-Haus-${sanitizedTitle}-Dossier.pdf`;

  doc.save(filename);
};
