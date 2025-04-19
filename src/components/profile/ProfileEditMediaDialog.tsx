import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileEditMediaDialog = ({ open, onOpenChange }: ProfileEditMediaDialogProps) => {
  const [currentTab, setCurrentTab] = useState("avatar");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
    }
  }, [open, user?.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille de l'image ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille de l'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const updates: Record<string, any> = {};
      
      if (avatarPreview) {
        updates['avatar'] = avatarPreview;
      }
      
      if (bannerPreview) {
        updates['banner'] = bannerPreview;
      }
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) throw error;
      }

      toast({
        title: "Médias mis à jour",
        description: "Vos images de profil ont été mises à jour avec succès."
      });
      
      onOpenChange(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error: any) {
      console.error("Erreur de mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les images: " + error.message,
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
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                  <AvatarFallback>
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex gap-3 mb-2">
                <Label 
                  htmlFor="avatar-upload" 
                  className="flex items-center gap-1 bg-airsoft-red hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
                >
                  <Upload size={16} />
                  Télécharger
                </Label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
                
                {avatarPreview && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAvatarPreview(null)}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Réinitialiser
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Formats acceptés : JPG, PNG. Taille maximale : 2MB.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="banner" className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="mb-4 w-full">
                <div className="h-32 w-full rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-airsoft-red flex items-center justify-center">
                  {bannerPreview ? (
                    <img 
                      src={bannerPreview} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-white" />
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mb-2">
                <Label 
                  htmlFor="banner-upload" 
                  className="flex items-center gap-1 bg-airsoft-red hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
                >
                  <Upload size={16} />
                  Télécharger
                </Label>
                <input 
                  id="banner-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerChange} 
                  className="hidden" 
                />
                
                {bannerPreview && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setBannerPreview(null)}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Réinitialiser
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Format recommandé : 1500x500px. Taille maximale : 5MB.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            className="bg-airsoft-red hover:bg-red-700"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditMediaDialog;
