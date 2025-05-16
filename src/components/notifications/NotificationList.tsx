
import React, { useState, useEffect } from 'react';
import { X, BellRing } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: string;
  link?: string;
  related_id?: string;
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les notifications au chargement du composant
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setNotifications(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Mise à jour locale de l'état
      setNotifications(prevState => 
        prevState.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };
  
  const deleteNotification = async (notificationId: string) => {
    setDeleting(notificationId);
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Mise à jour locale de l'état
      setNotifications(prevState => 
        prevState.filter(notif => notif.id !== notificationId)
      );
      
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès",
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };
  
  // Obtenir le type d'icône en fonction du type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <BellRing className="h-4 w-4 text-blue-500" />
        </div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <BellRing className="h-4 w-4 text-gray-500" />
        </div>;
    }
  };

  // Format de date relative (par ex. "il y a 2 heures")
  const formatRelativeDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { 
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      return "Date inconnue";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              notifications.forEach(notif => {
                if (!notif.read) markAsRead(notif.id);
              });
            }}
          >
            Marquer tout comme lu
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="h-8 w-8 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Chargement des notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`relative flex items-start p-4 rounded-md border ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              {getNotificationIcon(notification.type)}
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">{notification.title}</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    disabled={deleting === notification.id}
                  >
                    {deleting === notification.id ? (
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500">{formatRelativeDate(notification.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 mb-4">
            <BellRing className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="mb-1 text-sm font-medium">Pas de notifications</h3>
          <p className="text-xs text-gray-500">Vous n'avez aucune notification pour le moment.</p>
        </div>
      )}
    </div>
  );
}

export default NotificationList;
