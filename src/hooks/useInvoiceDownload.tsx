
import { useState } from 'react';
import jsPDF from 'jspdf';
import { GameData } from '@/types/game';
import { Profile } from '@/types/profile';
import { toast } from '@/hooks/use-toast';

export const useInvoiceDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadInvoice = async (
    gameData: GameData,
    userProfile: Profile | null
  ) => {
    try {
      setIsGenerating(true);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Variables pour les couleurs et styles
      const primaryColor: [number, number, number] = [220, 38, 38]; // Rouge airsoft
      const secondaryColor: [number, number, number] = [107, 114, 128]; // Gris
      const lightGray: [number, number, number] = [249, 250, 251];
      
      // **HEADER SECTION**
      // Dégradé gris pour l'en-tête (simulé avec plusieurs rectangles)
      doc.setFillColor(75, 85, 99); // gray-600
      doc.rect(0, 0, pageWidth, 42, 'F');
      doc.setFillColor(17, 24, 39); // gray-900
      doc.rect(0, 35, pageWidth, 7, 'F');
      
      // Logo mieux positionné sans cadre
      try {
        doc.addImage('/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png', 'PNG', 15, 10, 28, 22);
      } catch (error) {
        console.warn('Logo non trouvé pour le PDF');
      }
      
      // Titre principal en blanc
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURE DE RÉSERVATION', pageWidth / 2, 20, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Confirmation d\'inscription - Partie d\'Airsoft', pageWidth / 2, 32, { align: 'center' });
      
      // Ligne décorative
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.line(60, 37, pageWidth - 60, 37);
      
      // Retour au noir pour le reste
      doc.setTextColor(0, 0, 0);
      
      // **INFORMATIONS FACTURE**
      const invoiceNumber = `INV-${gameData.id.substring(0, 8).toUpperCase()}`;
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      // Boîte d'informations facture (droite)
      doc.setFillColor(...lightGray);
      doc.rect(120, 47, 70, 35, 'F');
      doc.setDrawColor(...secondaryColor);
      doc.rect(120, 47, 70, 35, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text('N° FACTURE', 125, 55);
      doc.text('DATE D\'ÉMISSION', 125, 70);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(invoiceNumber, 125, 62);
      doc.text(currentDate, 125, 77);
      
      // **INFORMATIONS CLIENT**
      doc.setFillColor(...lightGray);
      doc.rect(20, 47, 85, 35, 'F');
      doc.setDrawColor(...secondaryColor);
      doc.rect(20, 47, 85, 35, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text('FACTURÉ À', 25, 55);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      const customerName = userProfile?.firstname && userProfile?.lastname 
        ? `${userProfile.firstname} ${userProfile.lastname}`
        : userProfile?.username || 'Participant';
      doc.text(customerName, 25, 64);
      
      if (userProfile?.email) {
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text(userProfile.email, 25, 72);
      }
      
      if (userProfile?.location) {
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text(userProfile.location, 25, 79);
      }
      
      // **DÉTAILS DE LA PARTIE**
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('DÉTAILS DE LA PARTIE', 20, 102);
      
      // Ligne de séparation
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 107, pageWidth - 20, 107);
      
      // Contenu des détails
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      
      const details = [
        { label: 'Titre:', value: gameData.title },
        { label: 'Date:', value: new Date(gameData.date).toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) },
        { label: 'Lieu:', value: `${gameData.address}` },
        { label: 'Ville:', value: `${gameData.city} ${gameData.zip_code}` },
        { label: 'Type:', value: gameData.game_type },
      ];
      
      if (gameData.start_time && gameData.end_time) {
        details.push({ 
          label: 'Horaires:', 
          value: `${gameData.start_time} - ${gameData.end_time}` 
        });
      }
      
      let yPos = 117;
      details.forEach((detail) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text(detail.label, 25, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(detail.value, 60, yPos);
        yPos += 10;
      });
      
      // **SECTION FACTURATION**
      const tableStartY = yPos + 10;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('FACTURATION', 20, tableStartY);
      
      // Ligne de séparation
      doc.setDrawColor(...primaryColor);
      doc.line(20, tableStartY + 5, pageWidth - 20, tableStartY + 5);
      
      // En-tête du tableau
      doc.setFillColor(...lightGray);
      doc.rect(20, tableStartY + 15, pageWidth - 40, 15, 'F');
      doc.setDrawColor(...secondaryColor);
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
      
      // Total - Correction de l'affichage
      doc.setFillColor(...primaryColor);
      doc.rect(130, tableStartY + 45, 60, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL À PAYER:', 135, tableStartY + 55);
      doc.setFontSize(14);
      doc.text(`${price}€`, 170, tableStartY + 55);
      
      // **INFORMATIONS ADDITIONNELLES**
      const footerStartY = tableStartY + 80;
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('INFORMATIONS IMPORTANTES', 20, footerStartY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      
      const conditions = [
        '• Cette facture confirme votre inscription à la partie d\'airsoft',
        '• En cas d\'annulation, veuillez contacter l\'organisateur',
        '• Veuillez présenter cette facture le jour de la partie',
        '• Pour toute question, contactez l\'organisateur via la plateforme'
      ];
      
      let conditionY = footerStartY + 10;
      conditions.forEach(condition => {
        doc.text(condition, 25, conditionY);
        conditionY += 8;
      });
      
      // **PIED DE PAGE**
      doc.setDrawColor(...secondaryColor);
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
      
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      doc.text(`Document généré automatiquement le ${new Date().toLocaleString('fr-FR')}`, 20, pageHeight - 20);
      doc.text('Airsoft Companion - airsoft-companion.com', pageWidth - 20, pageHeight - 20, { align: 'right' });
      
      // Téléchargement du fichier
      const fileName = `Facture_${gameData.title.replace(/[^a-zA-Z0-9]/g, '_')}_${invoiceNumber}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Facture téléchargée",
        description: "Votre facture de réservation a été téléchargée avec succès."
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer la facture. Veuillez réessayer."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    downloadInvoice,
    isGenerating
  };
};
