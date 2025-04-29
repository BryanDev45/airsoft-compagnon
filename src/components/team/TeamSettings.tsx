import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PenBox, Settings, X, Save, Camera, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface TeamSettingsProps {
  team: any;
  onTeamUpdate?: (updatedTeam: any) => void; // Cette fonction sera appelée lors des mises à jour
}

const TeamSettings = ({ team, onTeamUpdate }: TeamSettingsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(team?.name || '');
  const [location, setLocation] = useState(team?.location || '');
  const [founded, setFounded] = useState(team?.founded || '');
  const [description, setDescription] = useState(team?.description || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(team?.logo || '');
  const [bannerPreview, setBannerPreview] = useState(team?.banner || '');
  const [loading, setLoading] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const [isTeamMember, setIsTeamMember] = useState(false);
  
  // Vérifier si l'utilisateur est le propriétaire de l'équipe
  const isTeamOwner = user?.id === team?.owner_id;
  
  // Vérifier si l'utilisateur est membre de l'équipe
  React.useEffect(() => {
    const checkTeamMembership = async () => {
      if (!user || !team) return;
      
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single();
        
      if (!error && data) {
        setIsTeamMember(true);
      }
    };
    
    checkTeamMembership();
  }, [user, team]);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTeamMedia = async () => {
    try {
      let newLogoUrl = team?.logo;
      let newBannerUrl = team?.banner;
      
      // Upload new logo if changed
      if (logoFile) {
        const logoFileName = `team_${team.id}_logo_${Date.now()}`;
        const { data: logoData, error: logoError } = await supabase.storage
          .from('team_media')
          .upload(logoFileName, logoFile);
          
        if (logoError) throw logoError;
        
        const { data: logoPublicUrl } = supabase.storage
          .from('team_media')
          .getPublicUrl(logoFileName);
          
        newLogoUrl = logoPublicUrl.publicUrl;
      }
      
      // Upload new banner if changed
      if (bannerFile) {
        const bannerFileName = `team_${team.id}_banner_${Date.now()}`;
        const { data: bannerData, error: bannerError } = await supabase.storage
          .from('team_media')
          .upload(bannerFileName, bannerFile);
          
        if (bannerError) throw bannerError;
        
        const { data: bannerPublicUrl } = supabase.storage
          .from('team_media')
          .getPublicUrl(bannerFileName);
          
        newBannerUrl = bannerPublicUrl.publicUrl;
      }
      
      // Update team with new media URLs
      const { error } = await supabase
        .from('teams')
        .update({
          logo: newLogoUrl,
          banner: newBannerUrl
        })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with the updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          logo: newLogoUrl,
          banner: newBannerUrl
        });
      }
      
      return { logo: newLogoUrl, banner: newBannerUrl };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des médias:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les médias de l'équipe: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };
  
  const updateTeamInfo = async (mediaUrls: { logo?: string, banner?: string } = {}) => {
    try {
      const updatedFields = {
        name,
        location,
        founded,
        description,
        ...mediaUrls
      };
      
      const { error } = await supabase
        .from('teams')
        .update(updatedFields)
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          ...updatedFields
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'équipe: " + error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      let mediaUrls = {};
      
      // Update media files if any changed
      if (logoFile || bannerFile) {
        const mediaResult = await updateTeamMedia();
        if (mediaResult) {
          mediaUrls = mediaResult;
        }
      }
      
      // Update team information
      await updateTeamInfo(mediaUrls);
      
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateDescription = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({ description })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          description
        });
      }
      
      toast({
        title: "Description mise à jour",
        description: "La description de votre équipe a été mise à jour avec succès.",
      });
      
      setIsEditingBio(false);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la description:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la description: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTeam = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete all team members first
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id);
        
      if (membersError) throw membersError;
      
      // Then delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // N'afficher le bouton des paramètres que si l'utilisateur est le propriétaire ou un membre de l'équipe
  if (!isTeamOwner && !isTeamMember) return null;
  
  // Déterminer les onglets à afficher selon le rôle de l'utilisateur
  const shouldShowDangerTab = isTeamOwner; // Seul le propriétaire peut supprimer l'équipe

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Paramètres de l'équipe</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Paramètres de l'équipe</DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="media">Média</TabsTrigger>
            {shouldShowDangerTab && <TabsTrigger value="danger">Danger</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'équipe</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Nom de l'équipe"
                disabled={!isTeamOwner}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <Input 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                placeholder="Localisation"
                disabled={!isTeamOwner}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date de fondation</label>
              <Input 
                value={founded} 
                onChange={e => setFounded(e.target.value)}
                placeholder="Année de fondation"
                type="number"
                min="1990"
                max="2099"
                disabled={!isTeamOwner}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description de l'équipe</label>
              {isEditingBio && isTeamOwner ? (
                <div className="space-y-2">
                  <Textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description de l'équipe"
                    className="h-32"
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setDescription(team.description || '');
                        setIsEditingBio(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={handleUpdateDescription}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-md p-3 bg-gray-50 min-h-[100px]">
                    {description || <span className="text-gray-400 italic">Aucune description</span>}
                  </div>
                  
                  {isTeamOwner && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsEditingBio(true)}
                    >
                      <PenBox className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo de l'équipe</label>
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 rounded-full border bg-gray-100 overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo prévisualisé" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                {isTeamOwner && (
                  <div>
                    <Button asChild variant="outline" className="mb-2">
                      <label className="cursor-pointer">
                        <Camera className="h-4 w-4 mr-2" />
                        Changer le logo
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleLogoChange}
                        />
                      </label>
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      Format recommandé: carré, 1:1. JPG ou PNG.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bannière de l'équipe</label>
              <div className="h-40 w-full rounded-md border bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
                {bannerPreview ? (
                  <img 
                    src={bannerPreview} 
                    alt="Bannière prévisualisée" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              {isTeamOwner && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Format recommandé: 16:9 ou 4:1. JPG ou PNG. Résolution minimum 1280x720px.
                  </p>
                  
                  <Button asChild variant="outline">
                    <label className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer la bannière
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleBannerChange}
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {shouldShowDangerTab && (
            <TabsContent value="danger" className="pt-4">
              <div className="border rounded-md p-4 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">Zone de danger</h3>
                <p className="text-sm text-red-600 mb-4">
                  Attention : les actions ci-dessous sont irréversibles et peuvent entraîner la perte définitive de données.
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteTeam}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? "Suppression..." : "Supprimer cette équipe"}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            
            {isTeamOwner && (
              <Button 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSettings;
