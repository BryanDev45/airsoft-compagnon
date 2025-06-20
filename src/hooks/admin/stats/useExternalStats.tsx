
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExternalStats = () => {
  return useQuery({
    queryKey: ['admin-external-stats'],
    queryFn: async () => {
      console.log('Fetching external statistics...');

      const [
        { data: discordStats },
        { data: pwaStats },
        { data: pageStats }
      ] = await Promise.all([
        supabase.from('discord_bot_stats').select('download_count, invite_count').single(),
        supabase.from('pwa_stats').select('install_count').single(),
        supabase.from('page_visit_stats').select('page_path, visit_count').in('page_path', [
          '/', '/parties', '/toolbox', '/profile', '/team',
          '/toolbox/calculators', '/toolbox/discord-bot', '/toolbox/glossary',
          '/toolbox/scenarios', '/toolbox/troubleshooting', '/toolbox/guides',
          '/parties/parties', '/parties/joueurs', '/parties/equipes', '/parties/magasins'
        ])
      ]);

      return {
        discordBotDownloads: discordStats?.download_count || 0,
        discordBotInvites: discordStats?.invite_count || 0,
        pwaInstalls: pwaStats?.install_count || 0,
        pageStats: pageStats || [],
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};
