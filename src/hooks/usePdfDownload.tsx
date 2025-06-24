
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
        
        console.log(`📄 PDF PARTICIPANT ${index + 1} - Processing:`, {
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
        let contact = 'Non renseigné';
        const phoneValue = profile?.phone_number;
        const emailValue = profile?.email;
        
        if (phoneValue && typeof phoneValue === 'string' && phoneValue.trim() !== '') {
          contact = phoneValue;
        } else if (emailValue && typeof emailValue === 'string' && emailValue.trim() !== '') {
          contact = emailValue;
        }
        
        // Équipe - logique améliorée cohérente avec l'affichage
        let team = 'Aucune équipe';
        if (profile) {
          console.log(`📄 PDF PARTICIPANT ${index + 1} - Team data:`, {
            team: profile.team,
            team_id: profile.team_id,
            teamType: typeof profile.team,
            teamIdType: typeof profile.team_id
          });
          
          // Vérifier si on a un nom d'équipe valide
          if (profile.team && 
              typeof profile.team === 'string' && 
              profile.team.trim() !== '' && 
              profile.team !== 'undefined' &&
              profile.team !== 'null') {
            team = profile.team;
            console.log(`📄 PDF PARTICIPANT ${index + 1} - Using team name:`, team);
          } else if (profile.team_id && 
                     typeof profile.team_id === 'string' && 
                     profile.team_id.trim() !== '' && 
                     profile.team_id !== 'undefined' &&
                     profile.team_id !== 'null') {
            team = 'Équipe';
            console.log(`📄 PDF PARTICIPANT ${index + 1} - Using fallback for team_id`);
          } else {
            console.log(`📄 PDF PARTICIPANT ${index + 1} - No team information available`);
          }
        }
        
        console.log(`📄 PDF PARTICIPANT ${index + 1} - Final data:`, {
          displayName,
          contact,
          team,
          role: participant.role || 'Participant'
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
      
      // Génération du tableau avec largeurs ajustées
      autoTable(doc, {
        head: [['#', 'Pseudonyme', 'Contact', 'Équipe', 'Rôle', 'Statut']],
        body: tableData,
        startY: 70,
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [220, 38, 38], // Rouge airsoft
          textColor: 255,
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 }, // # 
          1: { cellWidth: 35 }, // Pseudonyme
          2: { cellWidth: 50 }, // Contact
          3: { cellWidth: 30 }, // Équipe
          4: { cellWidth: 25 }, // Rôle
          5: { cellWidth: 25 }  // Statut
        },
        // Options pour gérer le débordement
        tableWidth: 'wrap',
        margin: { left: 15, right: 15 }
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
