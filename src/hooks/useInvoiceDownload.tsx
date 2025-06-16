
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
      
      // En-tête de la facture
      doc.setFontSize(20);
      doc.text('FACTURE DE RÉSERVATION', 20, 20);
      
      // Informations de la facture
      const invoiceNumber = `INV-${gameData.id.substring(0, 8).toUpperCase()}`;
      const currentDate = new Date().toLocaleDateString('fr-FR');
      
      doc.setFontSize(12);
      doc.text(`Numéro de facture: ${invoiceNumber}`, 20, 40);
      doc.text(`Date d'émission: ${currentDate}`, 20, 50);
      
      // Informations du client
      doc.setFontSize(14);
      doc.text('FACTURÉ À:', 20, 70);
      doc.setFontSize(12);
      const customerName = userProfile?.firstname && userProfile?.lastname 
        ? `${userProfile.firstname} ${userProfile.lastname}`
        : userProfile?.username || 'Participant';
      doc.text(customerName, 20, 85);
      if (userProfile?.email) {
        doc.text(userProfile.email, 20, 95);
      }
      
      // Informations de la partie
      doc.setFontSize(14);
      doc.text('DÉTAILS DE LA PARTIE:', 20, 115);
      doc.setFontSize(12);
      doc.text(`Titre: ${gameData.title}`, 20, 130);
      doc.text(`Date: ${new Date(gameData.date).toLocaleDateString('fr-FR')}`, 20, 140);
      doc.text(`Lieu: ${gameData.address}, ${gameData.city} ${gameData.zip_code}`, 20, 150);
      doc.text(`Type: ${gameData.game_type}`, 20, 160);
      
      // Horaires
      if (gameData.start_time && gameData.end_time) {
        doc.text(`Horaires: ${gameData.start_time} - ${gameData.end_time}`, 20, 170);
      }
      
      // Prix
      doc.setFontSize(14);
      doc.text('FACTURATION:', 20, 190);
      doc.setFontSize(12);
      const price = gameData.price || 0;
      doc.text(`Participation à la partie: ${price}€`, 20, 205);
      
      // Ligne de séparation
      doc.line(20, 215, 190, 215);
      
      // Total
      doc.setFontSize(14);
      doc.text(`TOTAL: ${price}€`, 20, 230);
      
      // Conditions
      doc.setFontSize(10);
      doc.text('Cette facture confirme votre inscription à la partie d\'airsoft.', 20, 250);
      doc.text('En cas d\'annulation, veuillez contacter l\'organisateur.', 20, 260);
      
      // Pied de page
      doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 20, 280);
      
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
