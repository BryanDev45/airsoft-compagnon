
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface TeamApplicationButtonProps {
  teamId: string;
  teamName: string;
  leaderId: string;
  isRecruiting: boolean;
  currentUserId?: string;
  onApplicationSent?: () => void;
}

const TeamApplicationButton: React.FC<TeamApplicationButtonProps> = ({
  teamId,
  teamName,
  leaderId,
  isRecruiting,
  currentUserId,
  onApplicationSent
}) => {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [userHasTeam, setUserHasTeam] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || !teamId) return;

      try {
        // Check if user is already a confirmed member of any team
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .limit(1)
          .maybeSingle();

        if (memberError) throw memberError;

        if (memberData) {
          setUserHasTeam(true);
          return;
        }

        // Vérifier si l'utilisateur a déjà postulé
        const { data: applicationData, error: applicationError } = await supabase
          .from('team_members')
          .select('status')
          .eq('team_id', teamId)
          .eq('user_id', user.id);

        if (applicationError) throw applicationError;

        if (applicationData && applicationData.length > 0) {
          const status = applicationData[0].status;
          if (status === 'pending') {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    checkUserStatus();
  }, [user, teamId]);

  const handleApplyToTeam = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler à une équipe",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsApplying(true);

      // Créer la candidature
      const { error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: user.id,
          status: 'pending',
          role: 'Membre'
        }]);

      if (error) throw error;

      // Créer une notification pour le leader de l'équipe
      await supabase
        .from('notifications')
        .insert([{
          user_id: leaderId,
          title: 'Nouvelle demande d\'adhésion',
          message: `Un joueur souhaite rejoindre votre équipe ${teamName}`,
          type: 'team_request',
          link: `/team/${teamId}`,
          related_id: teamId
        }]);

      setHasApplied(true);
      toast({
        title: "Candidature envoyée",
        description: `Votre candidature pour rejoindre l'équipe ${teamName} a été envoyée`
      });

      if (onApplicationSent) {
        onApplicationSent();
      }
    } catch (error: any) {
      console.error('Error applying to team:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la candidature",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Ne pas afficher le bouton si l'utilisateur n'est pas connecté, a déjà une équipe, ou si l'équipe ne recrute pas
  if (!user || userHasTeam || !isRecruiting || currentUserId === leaderId) return null;

  if (hasApplied) {
    return (
      <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm text-center">
        Candidature envoyée
      </div>
    );
  }

  return (
    <Button
      onClick={handleApplyToTeam}
      disabled={isApplying}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {isApplying ? "Envoi..." : "Postuler à l'équipe"}
    </Button>
  );
};

export default TeamApplicationButton;
