
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { getAllDefaultAvatars } from "@/utils/avatarUtils";

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
  const [defaultAvatars, setDefaultAvatars] = useState<string[]>([]);
  
  useEffect(() => {
    const avatars = getAllDefaultAvatars();
    if (avatars && avatars.length > 0) {
      setDefaultAvatars(avatars);
    }
  }, []);
  
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

  const handleSelectDefaultAvatar = (src: string) => {
    setAvatarPreview(src);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier votre profil</DialogTitle>
          <DialogDescription>
            Modifiez votre profil pour qu'il reflète au mieux votre personnalité
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bio">Informations</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="banner">Bannière</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bio" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre nom d'utilisateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Parlez de vous en quelques mots..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500">
                  Cette description sera visible sur votre profil public
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="avatar" className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
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
              <div className="w-full mt-4">
                <p className="text-xs text-gray-400 mb-2">Ou choisissez un avatar parmi ces modèles</p>
                <div className="grid grid-cols-3 gap-4 mt-2 max-h-60 overflow-y-auto p-2">
                  {defaultAvatars && defaultAvatars.length > 0 ? (
                    defaultAvatars.map((src, index) => (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        className={`p-1 rounded-lg border-2 ${avatarPreview === src ? 'border-airsoft-red' : 'border-transparent'} hover:border-gray-300 transition-colors focus:outline-none`}
                        onClick={() => handleSelectDefaultAvatar(src)}
                        title="Choisir cet avatar"
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={src}
                            alt={`Avatar airsoft ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-3 text-center py-4">Chargement des avatars...</p>
                  )}
                </div>
              </div>
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

        <DialogFooter className="mt-6">
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
