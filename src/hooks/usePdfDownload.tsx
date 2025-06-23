
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
      const tableData = participants.map((participant, index) => {
        const profile = participant.profile;
        
        // Debugging: log all participant data
        console.log(`Participant ${index + 1} complete data:`, {
          participant: participant,
          profile: profile,
          profileKeys: profile ? Object.keys(profile) : null
        });
        
        // Pseudonyme (username en priorité absolue)
        let displayName = 'Utilisateur inconnu';
        if (profile?.username) {
          displayName = profile.username;
        } else if (profile?.firstname || profile?.lastname) {
          const firstName = profile.firstname || '';
          const lastName = profile.lastname || '';
          displayName = `${firstName} ${lastName}`.trim() || 'Utilisateur inconnu';
        }
        
        // Contact (priorité au téléphone, sinon email)
        const contact = profile?.phone_number || profile?.email || 'Non renseigné';
        
        // Équipe - vérifier plusieurs sources
        let team = 'Aucune équipe';
        if (profile?.team) {
          team = profile.team;
        } else if (profile?.team_id) {
          team = `Équipe ID: ${profile.team_id}`;
        }
        
        console.log('Participant processing result:', {
          index: index + 1,
          username: profile?.username,
          firstname: profile?.firstname,
          lastname: profile?.lastname,
          phone: profile?.phone_number,
          email: profile?.email,
          team_field: profile?.team,
          team_id_field: profile?.team_id,
          final_displayName: displayName,
          final_contact: contact,
          final_team: team
        });
        
        return [
          index + 1,
          displayName,
          contact,
          team,
          participant.role || 'Participant',
          participant.status || 'Confirmé'
        ];
      });
      
      // Génération du tableau
      autoTable(doc, {
        head: [['#', 'Pseudonyme', 'Contact', 'Équipe', 'Rôle', 'Statut']],
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
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 }, // # 
          1: { cellWidth: 40 }, // Pseudonyme
          2: { cellWidth: 45 }, // Contact
          3: { cellWidth: 35 }, // Équipe
          4: { cellWidth: 25 }, // Rôle
          5: { cellWidth: 25 }  // Statut
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
