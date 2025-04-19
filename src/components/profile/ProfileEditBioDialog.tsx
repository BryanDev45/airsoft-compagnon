
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditBioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string;
}

const ProfileEditBioDialog = ({ open, onOpenChange, currentBio }: ProfileEditBioDialogProps) => {
  const [bio, setBio] = useState(currentBio || '');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSaveBio = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Bio mise à jour",
        description: "Votre biographie a été mise à jour avec succès."
      });
      
      onOpenChange(false);
      // Recharge la page pour afficher les changements
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre biographie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier votre biographie</DialogTitle>
          <DialogDescription>
            Partagez quelques informations sur vous avec la communauté
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              placeholder="Parlez de vous, de votre expérience en airsoft..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveBio} 
            className="bg-airsoft-red hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditBioDialog;
