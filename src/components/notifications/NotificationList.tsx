
import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash, UserPlus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const NotificationList = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(15);

        if (error) throw error;

        setNotifications(data || []);

        // Mark all notifications as read
        if (data && data.length > 0) {
          const unreadNotifications = data.filter(notification => !notification.read);
          
          if (unreadNotifications.length > 0) {
            const { error: updateError } = await supabase
              .from('notifications')
              .update({ read: true })
              .in('id', unreadNotifications.map(n => n.id));

            if (updateError) throw updateError;
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const handleAcceptFriendRequest = async (friendshipId: string, notificationId: string) => {
    try {
      // Update friendship status
      const { error: friendshipError } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (friendshipError) throw friendshipError;

      // Delete the notification
      await deleteNotification(notificationId);

      toast({
        title: 'Demande acceptée',
        description: 'Vous avez un nouvel ami !',
      });

      // Refresh notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setNotifications(data || []);

    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'accepter cette demande d'ami",
        variant: 'destructive',
      });
    }
  };

  const handleDeclineFriendRequest = async (friendshipId: string, notificationId: string) => {
    try {
      // Update friendship status
      const { error: friendshipError } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', friendshipId);

      if (friendshipError) throw friendshipError;

      // Delete the notification
      await deleteNotification(notificationId);

      toast({
        title: 'Demande refusée',
        description: 'La demande d\'ami a été refusée',
      });

      // Refresh notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setNotifications(data || []);

    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de refuser cette demande d\'ami',
        variant: 'destructive',
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(notifications.filter(n => n.id !== notificationId));

      toast({
        title: 'Notification supprimée',
        description: 'La notification a été supprimée',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer cette notification',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    // If the notification has a link, navigate to it
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const renderNotificationActions = (notification: any) => {
    if (notification.type === 'friend_request') {
      return (
        <div className="flex space-x-2 mt-2">
          <Button 
            size="sm" 
            className="bg-airsoft-red hover:bg-red-700"
            onClick={() => handleAcceptFriendRequest(notification.related_id, notification.id)}
          >
            <Check className="h-3 w-3 mr-1" />
            Accepter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeclineFriendRequest(notification.related_id, notification.id)}
          >
            <X className="h-3 w-3 mr-1" />
            Refuser
          </Button>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="h-5 w-5 text-airsoft-red" />;
      default:
        return <Bell className="h-5 w-5 text-airsoft-red" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="h-6 w-6 border-2 border-t-transparent border-airsoft-red rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length > 0 ? (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 hover:bg-gray-50">
                <div className={`flex items-start ${notification.read ? 'opacity-75' : ''}`}>
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {renderNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1" onClick={() => handleNotificationClick(notification)}>
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                      {renderNotificationActions(notification)}
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-16 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t text-center">
        <Button variant="ghost" size="sm" className="text-airsoft-red hover:text-red-700 hover:bg-red-50">
          Marquer toutes comme lues
        </Button>
      </div>
    </div>
  );
};

export default NotificationList;
