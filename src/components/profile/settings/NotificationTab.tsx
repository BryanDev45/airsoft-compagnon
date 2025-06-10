
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Bell, CheckCheck, Trash2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationActions } from '@/hooks/notifications/useNotificationActions';
import { Separator } from "@/components/ui/separator";

interface NotificationTabProps {
  user: any;
  isActive?: boolean;
}

const NotificationTab = ({ user, isActive }: NotificationTabProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { handleMarkAllAsRead, handleDeleteAllRead } = useNotificationActions();
  
  useEffect(() => {
    if (user && user.newsletter_subscribed !== undefined) {
      setIsSubscribed(!!user.newsletter_subscribed);
    }
  }, [user]);

  // Rafraîchir les notifications quand l'onglet devient actif
  useEffect(() => {
    if (isActive && user?.id) {
      console.log("Refreshing notifications for notifications tab");
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
    }
  }, [isActive, user?.id, queryClient]);

  // Rafraîchir le count quand l'onglet devient inactif
  useEffect(() => {
    if (!isActive && user?.id) {
      console.log("Notifications tab became inactive, refreshing count");
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
    }
  }, [isActive, user?.id, queryClient]);

  const handleNewsletterChange = async (checked: boolean) => {
    if (!user || !user.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier l'utilisateur",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ newsletter_subscribed: checked })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setIsSubscribed(checked);
      
      toast({
        title: checked ? "Inscription réussie" : "Désinscription réussie",
        description: checked 
          ? "Vous êtes maintenant inscrit à la newsletter" 
          : "Vous êtes maintenant désinscrit de la newsletter",
      });
    } catch (error: any) {
      console.error("Error updating newsletter subscription:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences de newsletter",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
    <div className="space-y-6">
      {/* Section Newsletter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-airsoft-red" />
          <h4 className="font-semibold text-lg">Préférences de communication</h4>
        </div>
        
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50/50">
          <div className="space-y-1">
            <Label className="text-base font-medium">Newsletter</Label>
            <p className="text-sm text-muted-foreground">
              Recevez nos actualités et événements par email
            </p>
          </div>
          <Switch 
            checked={isSubscribed}
            onCheckedChange={handleNewsletterChange}
            disabled={isUpdating}
          />
        </div>
      </div>

      <Separator />

      {/* Section Gestion des notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-airsoft-red" />
          <h4 className="font-semibold text-lg">Gestion des notifications</h4>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleMarkAllAsReadClick}
            className="w-full justify-start h-12 text-left"
          >
            <CheckCheck className="mr-3 h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium">Tout marquer comme lu</div>
              <div className="text-sm text-muted-foreground">Marquer toutes les notifications comme lues</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDeleteAllReadClick}
            className="w-full justify-start h-12 text-left hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="mr-3 h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-red-600">Supprimer les notifications lues</div>
              <div className="text-sm text-muted-foreground">Effacer définitivement les notifications déjà lues</div>
            </div>
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Les demandes d'amis et d'équipe en attente ne seront pas supprimées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;
