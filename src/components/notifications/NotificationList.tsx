
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationActions } from "@/hooks/notifications/useNotificationActions";
import { useFriendRequestActions } from "@/hooks/notifications/useFriendRequestActions";
import { useTeamInvitationActions } from "@/hooks/notifications/useTeamInvitationActions";
import NotificationItem from './NotificationItem';

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

export const NotificationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const {
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleDeleteAllRead
  } = useNotificationActions();

  const {
    handleAcceptFriendRequest,
    handleRejectFriendRequest
  } = useFriendRequestActions(handleMarkAsRead);

  const {
    processingInvitation,
    handleAcceptTeamInvitation,
    handleRejectTeamInvitation
  } = useTeamInvitationActions(handleMarkAsRead);

  const handleNotificationClick = async (notification: Notification) => {
    await handleMarkAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
      {notifications.length > 0 ? (
        <>
          <div className="mb-4 flex justify-between">
            <Button 
              variant="ghost" 
              className="text-sm h-8 px-2"
              onClick={handleDeleteAllRead}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer les lues
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm h-8 px-2"
              onClick={handleMarkAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          </div>
          <div className="space-y-4">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={handleDeleteNotification}
                onAcceptFriend={handleAcceptFriendRequest}
                onRejectFriend={handleRejectFriendRequest}
                onAcceptTeam={handleAcceptTeamInvitation}
                onRejectTeam={handleRejectTeamInvitation}
                onNavigate={handleNotificationClick}
                processingInvitation={processingInvitation}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <BellOff className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">Vous n'avez aucune notification</p>
        </div>
      )}
    </div>
  );
};
