
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
}

const TeamApplicationButton: React.FC<TeamApplicationButtonProps> = ({
  teamId,
  teamName,
  leaderId,
  isRecruiting
}) => {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || !teamId) return;

      try {
        // Check if user is already a member or has applied
        const { data, error } = await supabase
          .from('team_members')
          .select('status')
          .eq('team_id', teamId)
          .eq('user_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const status = data[0].status;
          if (status === 'confirmed') {
            setIsMember(true);
          } else if (status === 'pending') {
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

      // Check if user is already in a team
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData?.team_id) {
        toast({
          title: "Déjà membre d'une équipe",
          description: "Vous devez d'abord quitter votre équipe actuelle",
          variant: "destructive"
        });
        return;
      }

      // Create team application
      const { error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: user.id,
          status: 'pending',
          role: 'Membre'
        }]);

      if (error) throw error;

      // Create notification for team leader
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

  // Don't show button if user is not logged in, is already a member, or team is not recruiting
  if (!user || isMember || !isRecruiting) return null;

  if (hasApplied) {
    return (
      <div className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
        Candidature envoyée
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleApplyToTeam}
      disabled={isApplying}
      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
    >
      <UserPlus className="h-4 w-4 mr-1" />
      {isApplying ? "Envoi..." : "Postuler"}
    </Button>
  );
};

export default TeamApplicationButton;
