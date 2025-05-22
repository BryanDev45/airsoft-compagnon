
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useSaveMedia = (userId?: string) => {
  const [loading, setLoading] = useState(false);

  const saveMediaChanges = async (avatarPreview: string | null, bannerPreview: string | null) => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      const updates: Record<string, any> = {};
      if (avatarPreview !== undefined) updates['avatar'] = avatarPreview;
      if (bannerPreview !== undefined) updates['banner'] = bannerPreview;
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);

        if (error) throw error;
      }
      
      toast({
        title: "Médias mis à jour",
        description: "Vos images de profil ont été mises à jour avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error("Erreur de mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les images: " + error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveMediaChanges
  };
};
