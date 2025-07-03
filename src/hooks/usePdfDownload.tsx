
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GameParticipant } from '@/types/game';
import { toast } from '@/hooks/use-toast';

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
      const primaryColor: [number, number, number] = [220, 38, 38]; // Rouge airsoft
      const secondaryColor: [number, number, number] = [107, 114, 128]; // Gris
      const lightGray: [number, number, number] = [249, 250, 251];
      
      // **HEADER SECTION**
      // Dégradé gris horizontal pour l'en-tête
      for (let x = 0; x < pageWidth; x++) {
        const ratio = x / pageWidth;
        const r = Math.round(75 + (17 - 75) * ratio);
        const g = Math.round(85 + (24 - 85) * ratio);
        const b = Math.round(99 + (39 - 99) * ratio);
        doc.setFillColor(r, g, b);
        doc.rect(x, 0, 1, 42, 'F');
      }
      
      // Logo avec proportions correctes
      try {
        doc.addImage('/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png', 'PNG', 15, 8, 32, 30);
      } catch (error) {
        console.warn('Logo non trouvé pour le PDF');
      }
      
      // Titre principal en blanc
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('LISTE DES PARTICIPANTS', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Partie d\'Airsoft - Gestion des inscriptions', pageWidth / 2, 32, { align: 'center' });
      
      // Ligne décorative
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.line(60, 37, pageWidth - 60, 37);
      
      // Retour au noir pour le reste
      doc.setTextColor(0, 0, 0);
      
      // **INFORMATIONS DE LA PARTIE**
      doc.setFillColor(...lightGray);
      doc.rect(20, 52, pageWidth - 40, 35, 'F');
      doc.setDrawColor(...secondaryColor);
      doc.rect(20, 52, pageWidth - 40, 35, 'S');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('INFORMATIONS DE LA PARTIE', 25, 64);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Titre: ${gameTitle}`, 25, 74);
      doc.text(`Date: ${gameDate}`, 25, 81);
      doc.text(`Nombre total de participants: ${participants.length}`, 120, 74);
      
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
      
      // Génération du tableau avec largeurs ajustées
      autoTable(doc, {
        head: [['#', 'Nom & Prénom (Pseudo)', 'Contact', 'Équipe', 'Rôle', 'Statut']],
        body: tableData,
        startY: 92,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [107, 114, 128],
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: [220, 38, 38], // Rouge airsoft
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 }, // #
          1: { cellWidth: 50 }, // Nom & Prénom (Pseudo) - plus large pour le nom complet
          2: { cellWidth: 45 }, // Contact
          3: { cellWidth: 30 }, // Équipe
          4: { cellWidth: 25 }, // Rôle
          5: { halign: 'center', cellWidth: 25 }  // Statut
        },
        tableWidth: 'wrap',
        margin: { left: 15, right: 15 },
        theme: 'striped'
      });
      
      // **PIED DE PAGE PROFESSIONNEL**
      const finalY = (doc as any).lastAutoTable.finalY || 85;
      const pageHeight = doc.internal.pageSize.height;
      
      // Ligne de séparation
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, finalY + 15, pageWidth - 20, finalY + 15);
      
      // Informations de génération
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      doc.text(`Document généré automatiquement le ${new Date().toLocaleString('fr-FR')}`, 20, finalY + 25);
      doc.text('Airsoft Companion - Gestion des parties', pageWidth - 20, finalY + 25, { align: 'right' });
      
      // Note importante
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.text('Cette liste est confidentielle et ne doit pas être divulguée à des tiers', 20, finalY + 35);
      
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
