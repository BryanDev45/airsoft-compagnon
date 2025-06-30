
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

export const useTeamFetch = () => {
  const navigate = useNavigate();
  const { loading, error, executeRequest } = useNetworkRequest({
    maxRetries: 3,
    initialDelay: 1000,
  });

  const fetchTeamById = useCallback(async (teamId: string) => {
    console.log('Fetching team data for teamId:', teamId);
    
    return executeRequest(async () => {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*, team_fields(*)')
        .eq('id', teamId)
        .maybeSingle();

      console.log('Team query result:', { teamData, teamError });

      if (teamError) {
        console.error('Error fetching team:', teamError);
        throw teamError;
      }

      if (!teamData) {
        console.warn('No team found for ID:', teamId);
        toast({
          title: "Équipe non trouvée",
          description: "Cette équipe n'existe pas ou a été supprimée",
          variant: "destructive",
        });
        navigate('/');
        return null;
      }

      console.log('Team data found:', teamData);
      return teamData;
    }, {
      errorMessage: "Impossible de charger les données de l'équipe."
    });
  }, [navigate, executeRequest]);

  return {
    fetchTeamById,
    loading,
    error
  };
};
