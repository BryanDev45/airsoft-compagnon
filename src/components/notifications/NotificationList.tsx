
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, UserCheck, UserMinus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

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
  const queryClient = useQueryClient();

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

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      console.log("Deleting notification:", notificationId);
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error object from Supabase:', error);
        throw error;
      }
      
      // Refetch notifications after successful deletion
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notifications supprimées",
        description: "Les notifications lues ont été supprimées"
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const handleAcceptFriendRequest = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      // Mark notification as read
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami",
        variant: "destructive"
      });
    }
  };

  const handleRejectFriendRequest = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      // Mark notification as read
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande d'ami",
        variant: "destructive"
      });
    }
  };

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
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} transition-colors hover:bg-gray-100`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <div className="flex gap-1">
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                
                {notification.type === 'friend_request' && !notification.read ? (
                  <div className="flex mt-2 space-x-2 justify-end">
                    <Button 
                      variant="default"
                      size="sm"
                      className="bg-airsoft-red hover:bg-red-700"
                      onClick={() => handleAcceptFriendRequest(notification)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accepter
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectFriendRequest(notification)}
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Refuser
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer" 
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Clickable area for standard notifications */}
                  </div>
                )}
              </div>
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
