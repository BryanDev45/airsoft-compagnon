
import React from 'react';
import { UserPlus, Mail, UserX, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { useFriendshipActions } from './hooks/useFriendshipActions';
import { useNavigate } from 'react-router-dom';
import ReportUserButton from '@/components/profile/ReportUserButton';

interface UserActionButtonsProps {
  user: {
    id: string;
    username: string;
    firstname?: string | null;
    lastname?: string | null;
    team_info?: {
      id: string;
      name: string;
      logo: string | null;
    } | null;
  };
  friendshipStatus?: string;
  isCurrentUserTeamAdmin?: boolean;
  onFriendAction: (userId: string, action: 'add' | 'remove') => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  user,
  friendshipStatus,
  isCurrentUserTeamAdmin,
  onFriendAction
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Ne pas afficher les boutons pour soi-même
  if (currentUser?.id === user.id) {
    return null;
  }

  const handleSendMessage = () => {
    navigate(`/messages?user=${user.username}`);
  };

  const handleTeamInvite = () => {
    // TODO: Implémenter l'invitation d'équipe
    console.log('Inviter en équipe:', user.username);
  };

  const canInviteToTeam = isCurrentUserTeamAdmin && !user.team_info?.id;
  const canAddFriend = !friendshipStatus || friendshipStatus === 'none';
  const isPendingFriend = friendshipStatus === 'pending';
  const isFriend = friendshipStatus === 'accepted';

  return (
    <div className="flex gap-1">
      {/* Bouton d'amitié */}
      {canAddFriend && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          onClick={() => onFriendAction(user.id, 'add')}
          title="Ajouter comme ami"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      )}

      {isPendingFriend && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 text-orange-500 border-orange-500"
          disabled
          title="Demande d'ami en attente"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      )}

      {/* Invitation d'équipe */}
      {canInviteToTeam && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
          onClick={handleTeamInvite}
          title="Inviter dans l'équipe"
        >
          <Users className="h-4 w-4" />
        </Button>
      )}

      {/* Message */}
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white"
        onClick={handleSendMessage}
        title="Envoyer un message"
      >
        <Mail className="h-4 w-4" />
      </Button>

      {/* Signalement - Utilise un div wrapper pour maintenir la taille */}
      <div className="h-9 w-9">
        <ReportUserButton
          username={user.username}
          reportedUserId={user.id}
          asIcon={true}
        />
      </div>
    </div>
  );
};

export default UserActionButtons;
