
import { useState } from 'react';
import jsPDF from 'jspdf';
import { GameData } from '@/types/game';
import { Profile } from '@/types/profile';
import { toast } from '@/hooks/use-toast';
import { 
  addPDFHeader, 
  addPDFFooter, 
  shouldAddNewPage, 
  addNewPageWithHeader, 
  addInfoBox, 
  formatDateFR, 
  DEFAULT_PDF_COLORS,
  type PDFHeaderOptions 
} from '@/utils/pdfHelpers';

export const useInvoiceDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadInvoice = async (
    gameData: GameData,
    userProfile: Profile | null
  ) => {
    console.log('🧾 INVOICE DEBUG: Starting invoice generation', { gameData, userProfile });
    
    // Vérifications de base
    if (!gameData) {
      console.error('🧾 INVOICE ERROR: No game data provided');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Données de la partie manquantes"
      });
      return;
    }

    if (!userProfile) {
      console.error('🧾 INVOICE ERROR: No user profile provided');
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: "Profil utilisateur manquant"
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log('🧾 INVOICE DEBUG: State set to generating, creating PDF...');
      
      const doc = new jsPDF();
      console.log('🧾 INVOICE DEBUG: jsPDF instance created successfully');
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      console.log('🧾 INVOICE DEBUG: Page dimensions', { pageWidth, pageHeight });
      
      // Variables pour les couleurs et styles
      const colors = DEFAULT_PDF_COLORS;
      
      // **HEADER SECTION**
      console.log('🧾 INVOICE DEBUG: Starting header generation...');
      const headerOptions: PDFHeaderOptions = {
        title: 'FACTURE DE RÉSERVATION',
        subtitle: 'Confirmation d\'inscription - Partie d\'Airsoft',
        logoPath: '/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png',
        logoSize: { width: 32, height: 30, x: 15, y: 8 }
      };
      
      addPDFHeader(doc, headerOptions, colors);
      console.log('🧾 INVOICE DEBUG: Header added successfully');
      
      // **INFORMATIONS FACTURE ET CLIENT**
      const invoiceNumber = `INV-${gameData.id.substring(0, 8).toUpperCase()}`;
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      // Informations facture (droite)
      const invoiceBoxHeight = addInfoBox(doc, 120, 47, 70, 35, 'INFORMATIONS FACTURE', [
        `N°: ${invoiceNumber}`,
        `Date: ${currentDate}`
      ], colors);
      
      // Informations client (gauche)
      const customerName = userProfile?.firstname && userProfile?.lastname 
        ? `${userProfile.firstname} ${userProfile.lastname}`
        : userProfile?.username || 'Participant';
      
      const customerInfo = [customerName];
      if (userProfile?.email) customerInfo.push(userProfile.email);
      if (userProfile?.location) customerInfo.push(userProfile.location);
      
      const customerBoxHeight = addInfoBox(doc, 20, 47, 85, 35, 'FACTURÉ À', customerInfo, colors);
      
      // Calculer la position suivante en fonction de la plus grande boîte
      const nextY = 47 + Math.max(invoiceBoxHeight, customerBoxHeight) + 15;
      
      // **DÉTAILS DE LA PARTIE**
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('DÉTAILS DE LA PARTIE', 20, nextY);
      
      // Ligne de séparation
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(0.5);
      doc.line(20, nextY + 5, pageWidth - 20, nextY + 5);
      
      // Contenu des détails
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      
      const gameDetails = [
        `Titre: ${gameData.title}`,
        `Date: ${formatDateFR(gameData.date)}`,
        `Lieu: ${gameData.address}`,
        `Ville: ${gameData.city} ${gameData.zip_code}`,
        `Type: ${gameData.game_type}`
      ];
      
      if (gameData.start_time && gameData.end_time) {
        gameDetails.push(`Horaires: ${gameData.start_time} - ${gameData.end_time}`);
      }
      
      let yPos = nextY + 15;
      gameDetails.forEach((detail) => {
        const [label, ...valueParts] = detail.split(': ');
        const value = valueParts.join(': ');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.secondary);
        doc.text(`${label}:`, 25, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(value, 60, yPos);
        yPos += 10;
      });
      
      // **SECTION FACTURATION** - Gestion automatique des pages
      let currentY = yPos + 15;
      
      // Vérifier si on a besoin d'une nouvelle page
      if (shouldAddNewPage(doc, currentY, 120)) {
        doc.addPage();
        currentY = 20; // Début simple sans en-tête répété
      }
      
      const tableStartY = currentY;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('FACTURATION', 20, tableStartY);
      
      // Ligne de séparation
      doc.setDrawColor(...colors.primary);
      doc.line(20, tableStartY + 5, pageWidth - 20, tableStartY + 5);
      
      // En-tête du tableau
      doc.setFillColor(...colors.lightGray);
      doc.rect(20, tableStartY + 15, pageWidth - 40, 15, 'F');
      doc.setDrawColor(...colors.secondary);
      doc.rect(20, tableStartY + 15, pageWidth - 40, 15, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('DESCRIPTION', 25, tableStartY + 25);
      doc.text('PRIX UNITAIRE', 120, tableStartY + 25);
      doc.text('QUANTITÉ', 150, tableStartY + 25);
      doc.text('TOTAL', 175, tableStartY + 25);
      
      // Ligne du produit
      doc.rect(20, tableStartY + 30, pageWidth - 40, 15, 'S');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Participation à la partie d\'airsoft', 25, tableStartY + 40);
      
      const price = gameData.price || 0;
      doc.text(`${price}€`, 120, tableStartY + 40);
      doc.text('1', 150, tableStartY + 40);
      doc.text(`${price}€`, 175, tableStartY + 40);
      
      // Total
      doc.setFillColor(...colors.primary);
      doc.rect(120, tableStartY + 45, 70, 18, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL À PAYER:', 125, tableStartY + 55);
      doc.setFontSize(14);
      doc.text(`${price}€`, 185, tableStartY + 55, { align: 'right' });
      
      // **INFORMATIONS ADDITIONNELLES**
      let infoStartY = tableStartY + 80;
      
      // Vérifier si on a besoin d'une nouvelle page pour les informations
      if (shouldAddNewPage(doc, infoStartY, 60)) {
        const newHeaderOptions: PDFHeaderOptions = {
          title: 'FACTURE DE RÉSERVATION',
          subtitle: 'Informations importantes',
          logoPath: '/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png',
          logoSize: { width: 24, height: 22, x: 15, y: 5 }
        };
        infoStartY = addNewPageWithHeader(doc, newHeaderOptions, colors);
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('INFORMATIONS IMPORTANTES', 20, infoStartY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...colors.secondary);
      
      const conditions = [
        '• Cette facture confirme votre inscription à la partie d\'airsoft',
        '• En cas d\'annulation, veuillez contacter l\'organisateur',
        '• Veuillez présenter cette facture le jour de la partie',
        '• Pour toute question, contactez l\'organisateur via la plateforme'
      ];
      
      let conditionY = infoStartY + 12;
      conditions.forEach(condition => {
        doc.text(condition, 25, conditionY);
        conditionY += 8;
      });
      
      // **PIED DE PAGE**
      addPDFFooter(doc, {
        includeTimestamp: true,
        leftText: `Document généré le ${new Date().toLocaleString('fr-FR')}`,
        rightText: 'Airsoft Companion - airsoft-companion.com'
      }, colors);
      
      // Téléchargement du fichier
      console.log('🧾 INVOICE DEBUG: PDF generation completed, starting download...');
      const fileName = `Facture_${gameData.title.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceNumber}.pdf`;
      console.log('🧾 INVOICE DEBUG: Generated filename:', fileName);
      
      try {
        doc.save(fileName);
        console.log('🧾 INVOICE SUCCESS: PDF download initiated successfully');
        
        // Petit délai pour vérifier que le téléchargement s'est bien lancé
        setTimeout(() => {
          console.log('🧾 INVOICE DEBUG: Download should be completed by now');
        }, 1000);
        
        toast({
          title: "Facture téléchargée",
          description: "Votre facture de réservation a été téléchargée avec succès."
        });
      } catch (downloadError) {
        console.error('🧾 INVOICE ERROR: Failed to save PDF', downloadError);
        throw downloadError;
      }
      
    } catch (error) {
      console.error('🧾 INVOICE ERROR: Failed to generate invoice', error);
      console.error('🧾 INVOICE ERROR: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      
      // Diagnostic détaillé
      console.log('🧾 INVOICE DEBUG: Browser info:', {
        userAgent: navigator.userAgent,
        jsPDFImported: typeof jsPDF !== 'undefined',
        gameDataValid: !!gameData,
        userProfileValid: !!userProfile,
        isGeneratingState: isGenerating
      });
      
      toast({
        variant: "destructive",
        title: "Erreur de génération",
        description: error instanceof Error 
          ? `Erreur technique: ${error.message}` 
          : "Impossible de générer la facture. Vérifiez votre navigateur et réessayez."
      });
    } finally {
      console.log('🧾 INVOICE DEBUG: Resetting generating state');
      setIsGenerating(false);
    }
  };

  return {
    downloadInvoice,
    isGenerating
  };
};
