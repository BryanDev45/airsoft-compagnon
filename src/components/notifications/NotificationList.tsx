
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
          <div className="mb-4 flex justify-end">
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
                className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} cursor-pointer transition-colors hover:bg-gray-100`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
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
