
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AvatarUploader from './media/AvatarUploader';
import BannerUploader from './media/BannerUploader';
import { useSaveMedia } from './media/useSaveMedia';

interface ProfileEditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditMediaDialog = ({ open, onOpenChange }: ProfileEditMediaDialogProps) => {
  const [currentTab, setCurrentTab] = useState("avatar");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const { user } = useAuth();
  const { loading, saveMediaChanges } = useSaveMedia(user?.id);
  
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

    if (open) fetchCurrentImages();
  }, [open, user?.id]);

  const handleSaveChanges = async () => {
    const success = await saveMediaChanges(avatarPreview, bannerPreview);
    if (success) {
      onOpenChange(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Personnaliser votre profil</DialogTitle>
          <DialogDescription>
            Personnalisez votre avatar et votre bannière de profil
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="banner">Bannière</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatar" className="space-y-4">
            <AvatarUploader 
              avatarPreview={avatarPreview}
              onAvatarChange={setAvatarPreview}
            />
          </TabsContent>
          
          <TabsContent value="banner" className="space-y-4">
            <BannerUploader 
              bannerPreview={bannerPreview}
              onBannerChange={setBannerPreview}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            className="bg-airsoft-red hover:bg-red-700"
            disabled={loading}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditMediaDialog;
