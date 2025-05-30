
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';

interface TeamInviteButtonProps {
  targetUserId: string;
  targetUsername: string;
}

const TeamInviteButton: React.FC<TeamInviteButtonProps> = ({
  targetUserId,
  targetUsername
}) => {
  const { user } = useAuth();
  const [isInviting, setIsInviting] = useState(false);
  const [hasInvited, setHasInvited] = useState(false);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [userTeamId, setUserTeamId] = useState<string | null>(null);
  
  // Utiliser les permissions d'équipe
  const permissions = useTeamPermissions(userTeamId);

  useEffect(() => {
    const checkInvitationStatus = async () => {
      if (!user || !targetUserId) return;

      try {
        // Vérifier si l'utilisateur a une équipe et est leader ou admin
        const { data: profileData } = await supabase
          .from('profiles')
          .select('team_id, is_team_leader')
          .eq('id', user.id)
          .single();

        if (profileData?.team_id) {
          setUserTeamId(profileData.team_id);
          
          // Récupérer les informations de l'équipe
          const { data: teamData } = await supabase
            .from('teams')
            .select('*')
            .eq('id', profileData.team_id)
            .single();

          setUserTeam(teamData);

          // Vérifier si une invitation a déjà été envoyée
          const { data: invitationData } = await supabase
            .from('team_invitations')
            .select('status')
            .eq('team_id', profileData.team_id)
            .eq('invited_user_id', targetUserId);

          if (invitationData && invitationData.length > 0) {
            setHasInvited(true);
          }
        }
      } catch (error) {
        console.error('Error checking invitation status:', error);
      }
    };

    checkInvitationStatus();
  }, [user, targetUserId]);

  const handleInviteToTeam = async () => {
    if (!user || !userTeam) {
      toast({
        title: "Erreur",
        description: "Vous devez être membre d'une équipe pour inviter des joueurs",
        variant: "destructive"
      });
      return;
    }

    // Vérifier les permissions
    if (!permissions.canInviteMembers) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les permissions nécessaires pour inviter des joueurs dans l'équipe",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsInviting(true);

      // Vérifier que le joueur cible n'a pas déjà d'équipe
      const { data: targetProfileData } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', targetUserId)
        .single();

      if (targetProfileData?.team_id) {
        toast({
          title: "Invitation impossible",
          description: "Ce joueur fait déjà partie d'une équipe",
          variant: "destructive"
        });
        return;
      }

      // Créer l'invitation
      const { error } = await supabase
        .from('team_invitations')
        .insert([{
          team_id: userTeam.id,
          invited_user_id: targetUserId,
          inviter_user_id: user.id
        }]);

      if (error) throw error;

      setHasInvited(true);
      toast({
        title: "Invitation envoyée",
        description: `Vous avez invité ${targetUsername} à rejoindre votre équipe ${userTeam.name}`
      });
    } catch (error: any) {
      console.error('Error sending team invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'invitation",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  // Ne pas afficher le bouton si l'utilisateur ne peut pas inviter ou n'a pas d'équipe
  if (!user || !permissions.canInviteMembers || user.id === targetUserId || !userTeam) return null;

  if (hasInvited) {
    return (
      <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
        Invitation envoyée
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleInviteToTeam}
      disabled={isInviting || permissions.loading}
      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
    >
      <UserPlus className="h-4 w-4 mr-1" />
      {isInviting ? "Envoi..." : "Inviter dans l'équipe"}
    </Button>
  );
};

export default TeamInviteButton;
