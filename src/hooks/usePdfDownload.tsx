
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GameParticipant } from '@/types/game';
import { toast } from '@/components/ui/use-toast';

// Fonction utilitaire pour extraire une valeur propre (identique aux autres fichiers)
const extractCleanValue = (field: any): string | null => {
  if (field === null || field === undefined) {
    return null;
  }
  
  if (typeof field === 'object' && field._type !== undefined && field.value !== undefined) {
    if (field.value === 'undefined' || field.value === null || field.value === undefined) {
      return null;
    }
    return String(field.value);
  }
  
  if (typeof field === 'string') {
    if (field === 'undefined' || field === '' || field.trim() === '') {
      return null;
    }
    return field;
  }
  
  const stringValue = String(field);
  if (stringValue === 'undefined' || stringValue === '' || stringValue === 'null') {
    return null;
  }
  
  return stringValue;
};

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
        const cleanPhoneValue = extractCleanValue(profile?.phone_number);
        const cleanEmailValue = extractCleanValue(profile?.email);
        
        if (cleanPhoneValue) {
          contact = cleanPhoneValue;
        } else if (cleanEmailValue) {
          contact = cleanEmailValue;
        }
        
        // Équipe - logique améliorée cohérente avec l'affichage, avec nettoyage des données
        let team = 'Aucune équipe';
        if (profile) {
          const cleanTeamName = extractCleanValue(profile.team);
          const cleanTeamId = extractCleanValue(profile.team_id);
          
          console.log(`📄 PDF PARTICIPANT ${index + 1} - Cleaned team data:`, {
            originalTeam: profile.team,
            originalTeamId: profile.team_id,
            cleanTeamName,
            cleanTeamId
          });
          
          // Vérifier si on a un nom d'équipe valide nettoyé
          if (cleanTeamName) {
            team = cleanTeamName;
            console.log(`📄 PDF PARTICIPANT ${index + 1} - Using clean team name:`, team);
          } else if (cleanTeamId) {
            team = 'Équipe';
            console.log(`📄 PDF PARTICIPANT ${index + 1} - Using fallback for clean team_id`);
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
