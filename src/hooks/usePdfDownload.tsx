
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GameParticipant } from '@/types/game';
import { toast } from '@/hooks/use-toast';
import { 
  addPDFHeader, 
  addPDFFooter, 
  addInfoBox, 
  formatDateFR, 
  DEFAULT_PDF_COLORS,
  type PDFHeaderOptions 
} from '@/utils/pdfHelpers';

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
      const pageWidth = doc.internal.pageSize.width;
      
      // Variables pour les couleurs et styles
      const colors = DEFAULT_PDF_COLORS;
      
      // **HEADER SECTION**
      const headerOptions: PDFHeaderOptions = {
        title: 'LISTE DES PARTICIPANTS',
        subtitle: 'Partie d\'Airsoft - Gestion des inscriptions',
        logoPath: '/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png',
        logoSize: { width: 32, height: 30, x: 15, y: 8 }
      };
      
      addPDFHeader(doc, headerOptions, colors);
      
      // **INFORMATIONS DE LA PARTIE**
      const gameInfo = [
        `Titre: ${gameTitle}`,
        `Date: ${gameDate}`,
        `Participants: ${participants.length}`
      ];
      
      const gameInfoHeight = addInfoBox(doc, 20, 52, pageWidth - 40, 35, 'INFORMATIONS DE LA PARTIE', gameInfo, colors);
      
      // Ajuster la position de départ du tableau en fonction de la hauteur réelle
      const tableStartY = 52 + gameInfoHeight + 10;
      
      // Préparation des données pour le tableau
      const tableData = participants.map((participant, index) => {
        const profile = participant.profile;
        
        console.log(`📄 PDF PARTICIPANT ${index + 1} - Processing:`, {
          participant: participant,
          profile: profile,
          profileKeys: profile ? Object.keys(profile) : null
        });
        
        // Nom complet avec pseudo entre parenthèses
        let displayName = 'Utilisateur inconnu';
        const firstName = profile?.firstname || '';
        const lastName = profile?.lastname || '';
        const username = profile?.username || '';
        
        if (firstName || lastName) {
          const fullName = `${firstName} ${lastName}`.trim();
          if (username) {
            displayName = `${fullName} (${username})`;
          } else {
            displayName = fullName || 'Utilisateur inconnu';
          }
        } else if (username) {
          displayName = `(${username})`;
        }
        
        // Contact (priorité au téléphone, sinon email)  
        let contact = 'Non renseigné';
        if (profile?.phone_number) {
          contact = profile.phone_number;
        } else if (profile?.email) {
          contact = profile.email;
        }
        
        // Équipe - données maintenant propres
        let team = 'Aucune équipe';
        if (profile?.team) {
          team = profile.team;
          console.log(`📄 PDF PARTICIPANT ${index + 1} - Using team name:`, team);
        } else {
          console.log(`📄 PDF PARTICIPANT ${index + 1} - No team information available`);
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
      
      // Génération du tableau avec en-têtes personnalisés pour chaque page
      autoTable(doc, {
        head: [['#', 'Nom & Prénom (Pseudo)', 'Contact', 'Équipe', 'Rôle', 'Statut']],
        body: tableData,
        startY: tableStartY,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: colors.secondary,
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: colors.primary,
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: colors.lightGray
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 },
          1: { cellWidth: 50 },
          2: { cellWidth: 45 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { halign: 'center', cellWidth: 25 }
        },
        tableWidth: 'wrap',
        margin: { left: 15, right: 15 },
        theme: 'striped',
        // Pas d'en-tête répété sur les nouvelles pages
        showHead: 'everyPage'
      });
      
      // **PIED DE PAGE PROFESSIONNEL**
      const finalY = (doc as any).lastAutoTable.finalY || 85;
      
      // Ajouter le pied de page sur toutes les pages
      const totalPages = doc.internal.pages.length - 1; // -1 car la première page est vide
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addPDFFooter(doc, {
          leftText: `Document généré le ${new Date().toLocaleString('fr-FR')}`,
          rightText: 'Airsoft Companion - Gestion des parties',
          centerText: 'Cette liste est confidentielle et ne doit pas être divulguée à des tiers'
        }, colors);
      }
      
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
