
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileEditTabs from './media/ProfileEditTabs';

interface ProfileEditBioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string;
  currentUsername: string;
}

const ProfileEditBioDialog = ({
  open,
  onOpenChange,
  currentBio,
  currentUsername
}: ProfileEditBioDialogProps) => {
  const [bio, setBio] = useState(currentBio);
  const [username, setUsername] = useState(currentUsername);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("bio");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchCurrentImages = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar, banner')
          .eq('id', user.id)
          .single();
        if (data) {
          setAvatarPreview(data.avatar);
          setBannerPreview(data.banner);
        }
      }
    };

    if (open) {
      fetchCurrentImages();
      setBio(currentBio);
      setUsername(currentUsername);
    }
  }, [open, user?.id, currentBio, currentUsername]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      // Préparer les données à mettre à jour
      const updates: Record<string, any> = {};
      
      if (currentTab === "bio") {
        // Mise à jour de la bio et du nom d'utilisateur
        updates.bio = bio;
        updates.username = username;
      } else if (currentTab === "avatar" && avatarPreview) {
        // Mise à jour de l'avatar uniquement
        updates.avatar = avatarPreview;
      } else if (currentTab === "banner" && bannerPreview) {
        // Mise à jour de la bannière uniquement
        updates.banner = bannerPreview;
      }
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) throw error;
        
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès"
        });
        onOpenChange(false);
        
        // Recharger la page pour afficher les changements
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const content = (
    <div className="py-4">
      <ProfileEditTabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        username={username}
        bio={bio}
        avatarPreview={avatarPreview}
        bannerPreview={bannerPreview}
        onUsernameChange={setUsername}
        onBioChange={setBio}
        onAvatarChange={setAvatarPreview}
        onBannerChange={setBannerPreview}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Modifier votre profil</DrawerTitle>
            <DrawerDescription>
              Modifiez votre profil pour qu'il reflète au mieux votre personnalité
            </DrawerDescription>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 px-4">
            {content}
          </ScrollArea>

          <DrawerFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-airsoft-red hover:bg-red-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[85vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle>Modifier votre profil</DialogTitle>
          <DialogDescription>
            Modifiez votre profil pour qu'il reflète au mieux votre personnalité
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          {content}
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 p-6 pt-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-airsoft-red hover:bg-red-700"
            disabled={isUpdating}
          >
            {isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditBioDialog;
