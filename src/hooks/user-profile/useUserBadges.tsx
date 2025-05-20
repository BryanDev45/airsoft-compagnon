
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching user badges
 */
export const useUserBadges = (userId: string | undefined) => {
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: badges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            date,
            badges (
              id,
              name,
              description,
              icon,
              background_color,
              border_color
            )
          `)
          .eq('user_id', userId);

        if (badgesError) throw badgesError;

        let formattedBadges = [];
        if (badges && badges.length > 0) {
          formattedBadges = badges.map(entry => ({
            id: entry.badges.id,
            name: entry.badges.name,
            description: entry.badges.description,
            icon: entry.badges.icon || '/placeholder.svg',
            date: new Date(entry.date).toLocaleDateString('fr-FR'),
            backgroundColor: entry.badges.background_color || '#f8f9fa',
            borderColor: entry.badges.border_color || '#e9ecef'
          }));
        }
        
        setUserBadges(formattedBadges);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching badges:", error);
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  return {
    userBadges,
    loading
  };
};
