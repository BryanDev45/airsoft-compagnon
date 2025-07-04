import jsPDF from 'jspdf';

export type PDFColors = {
  primary: [number, number, number];
  secondary: [number, number, number];
  lightGray: [number, number, number];
};

export const DEFAULT_PDF_COLORS: PDFColors = {
  primary: [220, 38, 38], // Rouge airsoft
  secondary: [107, 114, 128], // Gris
  lightGray: [249, 250, 251]
};

export interface PDFHeaderOptions {
  title: string;
  subtitle: string;
  height?: number;
  logoPath?: string;
  logoSize?: { width: number; height: number; x: number; y: number };
}

export interface PDFFooterOptions {
  leftText?: string;
  rightText?: string;
  centerText?: string;
  includeTimestamp?: boolean;
}

/**
 * Ajoute un en-tête avec dégradé à un document PDF
 */
export const addPDFHeader = (
  doc: jsPDF, 
  options: PDFHeaderOptions, 
  colors: PDFColors = DEFAULT_PDF_COLORS
): void => {
  const pageWidth = doc.internal.pageSize.width;
  const headerHeight = options.height || 42;
  
  // Dégradé horizontal pour l'en-tête
  for (let x = 0; x < pageWidth; x++) {
    const ratio = x / pageWidth;
    const r = Math.round(75 + (17 - 75) * ratio);
    const g = Math.round(85 + (24 - 85) * ratio);
    const b = Math.round(99 + (39 - 99) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(x, 0, 1, headerHeight, 'F');
  }
  
  // Logo si fourni
  if (options.logoPath && options.logoSize) {
    try {
      doc.addImage(
        options.logoPath, 
        'PNG', 
        options.logoSize.x, 
        options.logoSize.y, 
        options.logoSize.width, 
        options.logoSize.height
      );
    } catch (error) {
      console.warn('PDF: Logo introuvable', error);
    }
  }
  
  // Titre principal en blanc
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, pageWidth / 2, headerHeight / 2 - 5, { align: 'center' });
  
  // Sous-titre
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(options.subtitle, pageWidth / 2, headerHeight / 2 + 7, { align: 'center' });
  
  // Ligne décorative
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  const lineY = headerHeight - 5;
  doc.line(60, lineY, pageWidth - 60, lineY);
  
  // Retour au noir pour le reste
  doc.setTextColor(0, 0, 0);
};

/**
 * Ajoute un pied de page professionnel à un document PDF
 */
export const addPDFFooter = (
  doc: jsPDF, 
  options: PDFFooterOptions = {}, 
  colors: PDFColors = DEFAULT_PDF_COLORS
): void => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 30;
  
  // Ligne de séparation
  doc.setDrawColor(...colors.secondary);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  // Texte du pied de page
  doc.setFontSize(9);
  doc.setTextColor(...colors.secondary);
  
  const leftText = options.leftText || 
    (options.includeTimestamp ? 
      `Document généré le ${new Date().toLocaleString('fr-FR')}` : 
      '');
  const rightText = options.rightText || 'Airsoft Companion - airsoft-companion.com';
  
  if (leftText) {
    doc.text(leftText, 20, footerY + 10);
  }
  
  if (options.centerText) {
    doc.text(options.centerText, pageWidth / 2, footerY + 10, { align: 'center' });
  }
  
  if (rightText) {
    doc.text(rightText, pageWidth - 20, footerY + 10, { align: 'right' });
  }
};

/**
 * Calcule si une nouvelle page est nécessaire
 */
export const shouldAddNewPage = (
  doc: jsPDF, 
  currentY: number, 
  requiredSpace: number = 80
): boolean => {
  const pageHeight = doc.internal.pageSize.height;
  return currentY + requiredSpace > pageHeight - 50; // 50px de marge pour le footer
};

/**
 * Ajoute une nouvelle page avec en-tête
 */
export const addNewPageWithHeader = (
  doc: jsPDF, 
  headerOptions: PDFHeaderOptions, 
  colors: PDFColors = DEFAULT_PDF_COLORS
): number => {
  doc.addPage();
  
  // En-tête plus compact pour les pages suivantes
  const compactHeaderOptions = {
    ...headerOptions,
    height: 30,
    logoSize: headerOptions.logoSize ? {
      ...headerOptions.logoSize,
      width: headerOptions.logoSize.width * 0.75,
      height: headerOptions.logoSize.height * 0.75,
      y: 5
    } : undefined
  };
  
  addPDFHeader(doc, compactHeaderOptions, colors);
  
  return (compactHeaderOptions.height || 30) + 15; // Retourne la position Y après l'en-tête
};

/**
 * Crée une boîte d'information stylisée
 */
export const addInfoBox = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  content: string[],
  colors: PDFColors = DEFAULT_PDF_COLORS
): void => {
  // Boîte de fond
  doc.setFillColor(...colors.lightGray);
  doc.rect(x, y, width, height, 'F');
  doc.setDrawColor(...colors.secondary);
  doc.rect(x, y, width, height, 'S');
  
  // Titre
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.secondary);
  doc.text(title, x + 5, y + 12);
  
  // Contenu
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  let contentY = y + 22;
  content.forEach((line) => {
    doc.text(line, x + 5, contentY);
    contentY += 7;
  });
};

/**
 * Formate une date en français
 */
export const formatDateFR = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};