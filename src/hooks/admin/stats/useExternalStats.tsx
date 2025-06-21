
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExternalStats = () => {
  return useQuery({
    queryKey: ['external-stats'],
    queryFn: async () => {
      console.log('🔄 Fetching external stats...');
      
      try {
        // Récupérer les statistiques des pages visitées avec les onglets de recherche
        const { data: pageVisits } = await supabase
          .from('page_visit_stats')
          .select('page_path, visit_count');

        // Récupérer les statistiques du bot Discord
        const { data: discordStats } = await supabase
          .from('discord_bot_stats')
          .select('download_count, invite_count')
          .single();

        // Récupérer les statistiques PWA
        const { data: pwaStats } = await supabase
          .from('pwa_stats')
          .select('install_count')
          .single();

        // Traiter les visites de pages pour extraire les statistiques des onglets
        const pageVisitMap: Record<string, number> = {};
        
        if (pageVisits) {
          pageVisits.forEach(visit => {
            pageVisitMap[visit.page_path] = visit.visit_count || 0;
          });
        }

        // Extraire les statistiques spécifiques des pages et onglets
        const stats = {
          // Visites des pages principales
          homePageVisits: pageVisitMap['/'] || 0,
          partiesPageVisits: pageVisitMap['/parties'] || 0,
          toolboxPageVisits: pageVisitMap['/toolbox'] || 0,
          profilePageVisits: pageVisitMap['/profile'] || 0,
          teamPageVisits: pageVisitMap['/team'] || 0,
          
          // Visites des onglets de recherche
          partiesTabVisits: pageVisitMap['/parties/tab/parties'] || 0,
          joueursTabVisits: pageVisitMap['/parties/tab/joueurs'] || 0,
          equipesTabVisits: pageVisitMap['/parties/tab/equipes'] || 0,
          magasinsTabVisits: pageVisitMap['/parties/tab/magasins'] || 0,
          
          // Visites des onglets de la boîte à outils
          toolboxCalculatorsVisits: pageVisitMap['/toolbox/tab/calculators'] || 0,
          toolboxDiscordBotVisits: pageVisitMap['/toolbox/tab/discord-bot'] || 0,
          toolboxGlossaryVisits: pageVisitMap['/toolbox/tab/glossary'] || 0,
          toolboxScenariosVisits: pageVisitMap['/toolbox/tab/scenarios'] || 0,
          toolboxTroubleshootingVisits: pageVisitMap['/toolbox/tab/troubleshooting'] || 0,
          toolboxGuidesVisits: pageVisitMap['/toolbox/tab/guides'] || 0,
          
          // Statistiques externes
          discordBotDownloads: discordStats?.download_count || 0,
          discordBotInvites: discordStats?.invite_count || 0,
          pwaInstalls: pwaStats?.install_count || 0,
        };

        console.log('📊 External stats loaded:', stats);
        return stats;
      } catch (error) {
        console.error('❌ Error fetching external stats:', error);
        return {
          homePageVisits: 0,
          partiesPageVisits: 0,
          toolboxPageVisits: 0,
          profilePageVisits: 0,
          teamPageVisits: 0,
          partiesTabVisits: 0,
          joueursTabVisits: 0,
          equipesTabVisits: 0,
          magasinsTabVisits: 0,
          toolboxCalculatorsVisits: 0,
          toolboxDiscordBotVisits: 0,
          toolboxGlossaryVisits: 0,
          toolboxScenariosVisits: 0,
          toolboxTroubleshootingVisits: 0,
          toolboxGuidesVisits: 0,
          discordBotDownloads: 0,
          discordBotInvites: 0,
          pwaInstalls: 0,
        };
      }
    },
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};
