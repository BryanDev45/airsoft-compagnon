
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Shield, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AdminNotificationButton = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et le message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Récupérer tous les utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');

      if (profilesError) {
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        toast({
          title: "Information",
          description: "Aucun utilisateur trouvé",
        });
        return;
      }

      // Créer les notifications pour tous les utilisateurs
      const notifications = profiles.map(profile => ({
        user_id: profile.id,
        title: title.trim(),
        message: message.trim(),
        type: 'admin_announcement',
        read: false
      }));

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        throw notificationError;
      }

      toast({
        title: "Notification envoyée",
        description: `Notification envoyée à ${profiles.length} utilisateurs`
      });

      // Réinitialiser le formulaire
      setTitle('');
      setMessage('');
      setIsOpen(false);

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  if (!user?.Admin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
        >
          <Shield size={16} />
          Envoyer à tous
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={20} />
            Envoyer une notification à tous les joueurs
          </DialogTitle>
          <DialogDescription>
            Cette notification sera envoyée à tous les utilisateurs enregistrés.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="notification-title">Titre</Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la notification..."
              disabled={isSending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-message">Message</Label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contenu de la notification..."
              rows={4}
              disabled={isSending}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSendNotification}
            disabled={isSending || !title.trim() || !message.trim()}
            className="bg-airsoft-red hover:bg-red-700"
          >
            {isSending ? (
              "Envoi en cours..."
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNotificationButton;
