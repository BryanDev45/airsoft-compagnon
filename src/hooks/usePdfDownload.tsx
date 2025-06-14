
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GameParticipant } from '@/types/game';
import { toast } from '@/components/ui/use-toast';

export const usePdfDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadParticipantsList = async (
    gameTitle: string,
    gameDate: string,
    participants: GameParticipant[]
  ) => {
    try {
      setIsGenerating(true);
      
      const doc = new jsPDF();
      
      // En-tête du document
      doc.setFontSize(20);
      doc.text('Liste des Participants', 20, 20);
      
      doc.setFontSize(14);
      doc.text(`Partie: ${gameTitle}`, 20, 35);
      doc.text(`Date: ${gameDate}`, 20, 45);
      doc.text(`Nombre de participants: ${participants.length}`, 20, 55);
      
      // Préparation des données pour le tableau
      const tableData = participants.map((participant, index) => [
        index + 1,
        participant.profile?.username || 'Utilisateur inconnu',
        participant.profile?.phone_number || participant.profile?.email || 'N/A',
        participant.profile?.team || 'Aucune équipe',
        participant.role || 'Participant',
        participant.status || 'Confirmé'
      ]);
      
      // Génération du tableau
      autoTable(doc, {
        head: [['#', 'Nom d\'utilisateur', 'Contact', 'Équipe', 'Rôle', 'Statut']],
        body: tableData,
        startY: 70,
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [220, 38, 38], // Rouge airsoft
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
      
      // Ajout d'un pied de page
      const finalY = (doc as any).lastAutoTable.finalY || 70;
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 20, finalY + 20);
      
      // Téléchargement du fichier
      const fileName = `participants_${gameTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${gameDate.replace(/\//g, '-')}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "PDF généré",
        description: "La liste des participants a été téléchargée avec succès."
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    downloadParticipantsList,
    isGenerating
  };
};
