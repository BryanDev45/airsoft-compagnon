
import React from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';
import { useFriendRequestActions } from '@/hooks/notifications/useFriendRequestActions';
import { useTeamInvitationActions } from '@/hooks/notifications/useTeamInvitationActions';
import { useTeamRequestActions } from '@/hooks/notifications/useTeamRequestActions';
import { toast } from "@/components/ui/use-toast";
import NotificationItem from './NotificationItem';
import AdminNotificationButton from './AdminNotificationButton';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  created_at: string;
  related_id: string | null;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const { handleDeleteNotification, handleMarkAsRead, handleNavigateToNotification, handleMarkAllAsRead, handleDeleteAllRead } = useNotificationActions();
  const { processingInvitation: processingFriend, handleAcceptFriendRequest, handleRejectFriendRequest } = useFriendRequestActions(handleMarkAsRead);
  const { processingInvitation, handleAcceptTeamInvitation, handleRejectTeamInvitation } = useTeamInvitationActions(handleMarkAsRead);
  const { processingRequest, handleAcceptTeamRequest, handleRejectTeamRequest } = useTeamRequestActions(handleMarkAsRead);

  const handleMarkAllAsReadClick = async () => {
    await handleMarkAllAsRead();
    toast({
      title: "Notifications marquées",
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };

  const handleDeleteAllReadClick = async () => {
    await handleDeleteAllRead();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Bouton admin en haut */}
      <div className="mb-4">
        <AdminNotificationButton />
      </div>

      {/* Boutons de gestion des notifications */}
      <div className="mb-4 space-y-2">
        <Button
          variant="outline"
          onClick={handleMarkAllAsReadClick}
          className="w-full justify-start h-10 text-left"
          size="sm"
        >
          <CheckCheck className="mr-2 h-4 w-4 text-green-600" />
          <span className="text-sm">Tout marquer comme lu</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDeleteAllReadClick}
          className="w-full justify-start h-10 text-left hover:bg-red-50 hover:border-red-200"
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">Supprimer les notifications lues</span>
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* Liste des notifications */}
      <div className="flex-1">
        {!notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell className="h-8 w-8 mb-2" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDeleteNotification}
                  onAcceptFriend={handleAcceptFriendRequest}
                  onRejectFriend={handleRejectFriendRequest}
                  onAcceptTeam={handleAcceptTeamInvitation}
                  onRejectTeam={handleRejectTeamInvitation}
                  onAcceptTeamRequest={handleAcceptTeamRequest}
                  onRejectTeamRequest={handleRejectTeamRequest}
                  onNavigate={handleNavigateToNotification}
                  processingInvitation={processingInvitation || processingFriend}
                  processingRequest={processingRequest}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
