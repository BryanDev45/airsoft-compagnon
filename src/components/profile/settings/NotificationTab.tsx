
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from "@tanstack/react-query";

interface NotificationTabProps {
  user: any;
  isActive?: boolean;
}

const NotificationTab = ({ user, isActive }: NotificationTabProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h4 className="font-medium">Préférences de communication</h4>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3">
          <div>
            <Label className="text-base">Newsletter</Label>
            <p className="text-xs text-muted-foreground">
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
    </div>
  );
};

export default NotificationTab;
