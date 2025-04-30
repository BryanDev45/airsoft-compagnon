
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile, UserStats } from '@/types/profile';

/**
 * Hook for profile update operations
 */
export const useProfileUpdates = (
  userId: string | undefined,
  setProfileData: React.Dispatch<React.SetStateAction<Profile | null>>,
  setUserStats: React.Dispatch<React.SetStateAction<UserStats | null>>
) => {
  const [updating, setUpdating] = useState(false);

  const updateLocation = async (location: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update({ location })
        .eq('id', userId);

      if (error) throw error;

      setProfileData(prev => prev ? { ...prev, location } : null);
      
      toast({
        title: "Succès",
        description: "Votre localisation a été mise à jour avec succès",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating location:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la localisation",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateUserStats = async (
    preferredGameType: string,
    favoriteRole: string,
    level: string
  ): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      setUpdating(true);
      console.log("Updating stats:", preferredGameType, favoriteRole, level);
      
      // Update in database
      const { error } = await supabase
        .from('user_stats')
        .update({
          preferred_game_type: preferredGameType,
          favorite_role: favoriteRole,
          level: level,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      // Update state
      setUserStats(prev => prev ? {
        ...prev,
        preferred_game_type: preferredGameType,
        favorite_role: favoriteRole,
        level: level,
        updated_at: new Date().toISOString()
      } : null);
      
      return true;
    } catch (error: any) {
      console.error("Error updating stats:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques: " + error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    updateLocation,
    updateUserStats
  };
};
