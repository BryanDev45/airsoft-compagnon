import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData } from '@/types/team';

interface TeamSettingsMediaProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
}

const TeamSettingsMedia = ({ team, loading, setLoading, onTeamUpdate }: TeamSettingsMediaProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(team?.logo || '');
  const [bannerPreview, setBannerPreview] = useState(team?.banner || '');
  
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

  const handleSaveMedia = async () => {
    setLoading(true);
    
    try {
      let newLogoUrl = team?.logo;
      let newBannerUrl = team?.banner;
      
      // Upload new logo if changed
      if (logoFile) {
        const logoFileName = `team_${team.id}_logo_${Date.now()}`;
        const { error: logoError } = await supabase.storage
          .from('team_media')
          .upload(logoFileName, logoFile, { upsert: true });
          
        if (logoError) throw logoError;
        
        const { data: logoPublicUrl } = supabase.storage
          .from('team_media')
          .getPublicUrl(logoFileName);
          
        newLogoUrl = logoPublicUrl.publicUrl;
      }
      
      // Upload new banner if changed
      if (bannerFile) {
        const bannerFileName = `team_${team.id}_banner_${Date.now()}`;
        const { error: bannerError } = await supabase.storage
          .from('team_media')
          .upload(bannerFileName, bannerFile, { upsert: true });
          
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
      
      toast({
        title: "Médias mis à jour",
        description: "Les médias de l'équipe ont été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des médias:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les médias de l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSaveMedia}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer les médias"}
        </Button>
      </div>
    </div>
  );
};

export default TeamSettingsMedia;
