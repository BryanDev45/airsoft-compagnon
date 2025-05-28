
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  currentUserId: string | null;
  isCurrentUserAdmin: boolean;
}

const BanUserDialog: React.FC<BanUserDialogProps> = ({
  open,
  onOpenChange,
  userData,
  currentUserId,
  isCurrentUserAdmin
}) => {
  const [banReason, setBanReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBanUser = async () => {
    if (!isCurrentUserAdmin || !userData?.id || !currentUserId) return;
    
    setIsProcessing(true);

    try {
      const isBanned = userData.Ban || false;
      
      const updateData = {
        Ban: !isBanned,
        ban_reason: !isBanned ? banReason || null : null,
        ban_date: !isBanned ? new Date().toISOString() : null,
        banned_by: !isBanned ? currentUserId : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userData.id);

      if (error) throw error;

      toast({
        title: isBanned ? "Utilisateur débanni" : "Utilisateur banni",
        description: isBanned 
          ? `${userData.username} a été débanni avec succès` 
          : `${userData.username} a été banni avec succès`,
        variant: isBanned ? "default" : "destructive",
      });
      
      // Reset form and close dialog
      setBanReason('');
      onOpenChange(false);
      
      // Refresh page to see changes
      window.location.reload();
      
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la tentative de bannissement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isBanned = userData?.Ban || false;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? "Débannir cet utilisateur?" : "Bannir cet utilisateur?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned 
              ? `Êtes-vous sûr de vouloir débannir ${userData?.username}? Cet utilisateur pourra à nouveau accéder à toutes les fonctionnalités du site.`
              : `Êtes-vous sûr de vouloir bannir ${userData?.username}? Cet utilisateur ne pourra plus accéder à certaines fonctionnalités du site.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {!isBanned && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="banReason">Raison du bannissement (optionnel)</Label>
              <Textarea
                id="banReason"
                placeholder="Expliquez la raison du bannissement..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBanUser}
            disabled={isProcessing}
            className={isBanned ? "bg-blue-600 hover:bg-blue-700" : "bg-destructive hover:bg-destructive/90"}
          >
            {isProcessing ? "Traitement..." : (isBanned ? "Débannir" : "Bannir")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanUserDialog;
