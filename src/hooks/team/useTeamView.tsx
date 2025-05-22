
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export const useTeamView = (team: any, fetchTeamData: () => void) => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [isEditingField, setIsEditingField] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberDialog(true);
  };

  const handleContactTeam = () => {
    setShowContactDialog(true);
  };

  const handleSendMessage = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message envoyé",
      description: `Votre message a été envoyé à ${team?.name} (${team?.contactEmail})`
    });
    setContactMessage('');
    setContactSubject('');
    setShowContactDialog(false);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleShareVia = (method: string) => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez l'équipe ${team?.name} sur Airsoft Compagnon!`;

    switch (method) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Lien copié",
            description: "Le lien a été copié dans votre presse-papier"
          });
        });
        break;
    }

    setShowShareDialog(false);
  };

  const handleFieldEdit = async (fieldId: string | null, updates: any) => {
    if (fieldId) {
      const { error } = await supabase
        .from('team_fields')
        .update(updates)
        .eq('id', fieldId);
      
      if (error) {
        console.error('Error updating field:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('team_fields')
        .insert([{ ...updates, team_id: team?.id }]);
      
      if (error) {
        console.error('Error creating field:', error);
        return;
      }
    }
    
    // Refresh the team data
    fetchTeamData();
    setIsEditingField(false);
  };
  
  return {
    selectedMember,
    setSelectedMember,
    showMemberDialog,
    setShowMemberDialog,
    showContactDialog,
    setShowContactDialog,
    showShareDialog,
    setShowShareDialog,
    contactMessage,
    setContactMessage,
    contactSubject,
    setContactSubject,
    isEditingField,
    setIsEditingField,
    selectedField,
    setSelectedField,
    handleViewMember,
    handleContactTeam,
    handleSendMessage,
    handleShare,
    handleShareVia,
    handleFieldEdit
  };
};
