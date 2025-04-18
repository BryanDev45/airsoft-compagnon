
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  birth_date: string | null;
  age: number | null;
  join_date: string | null;
  team: string | null;
  team_id: string | null;
  is_verified: boolean;
  stats?: any;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer le profil de l'utilisateur
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Récupérer les statistiques de l'utilisateur
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') throw statsError;

        setProfile(profileData);
        setStats(statsData || {});
      } catch (error: any) {
        console.error('Erreur lors de la récupération du profil:', error.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStats = async (updates: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setStats(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Statistiques mises à jour",
        description: "Vos statistiques ont été mises à jour avec succès",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return { profile, stats, loading, updateProfile, updateStats };
};
