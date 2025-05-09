
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditBioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any; // Made user optional
  currentBio?: string;
  currentUsername?: string;
  onUpdate?: () => Promise<void>;
}

const ProfileEditBioDialog = ({ 
  open, 
  onOpenChange, 
  user,
  currentBio, 
  currentUsername,
  onUpdate
}: ProfileEditBioDialogProps) => {
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { user: authUser } = useAuth();

  // Set default values when the dialog opens
  useEffect(() => {
    if (open) {
      setBio(user?.bio || currentBio || '');
      setUsername(user?.username || currentUsername || '');
    }
  }, [open, currentBio, currentUsername, user]);

  const handleSave = async () => {
    if (!authUser?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          bio,
          username 
        })
        .eq('id', authUser.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Votre bio et votre nom d'utilisateur ont été mis à jour avec succès."
      });
      
      onOpenChange(false);
      
      // Call the onUpdate callback if provided
      if (onUpdate) {
        await onUpdate();
      } else {
        // Recharge la page pour afficher les changements
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
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
          <DialogTitle>Modifier votre profil</DialogTitle>
          <DialogDescription>
            Personnalisez votre profil pour la communauté
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
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
            onClick={handleSave} 
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
