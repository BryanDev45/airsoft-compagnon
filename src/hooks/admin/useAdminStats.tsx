import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  totalTeams: number;
  totalGames: number;
  pastGames: number;
  upcomingGames: number;
  onlineUsers: number;
  totalMessages: number;
  totalConversations: number;
  verifiedUsers: number;
  bannedUsers: number;
  discordBotDownloads: number;
  discordBotInvites: number;
  pwaInstalls: number;
  homePageVisits: number;
  partiesPageVisits: number;
  toolboxPageVisits: number;
  adminPageVisits: number;
  gamesPerMonth: Array<{ month: string; count: number }>;
  registrationsPerMonth: Array<{ month: string; count: number }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('Fetching admin statistics...');

      // Récupérer le nombre total d'utilisateurs
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre total d'équipes
      const { count: totalTeams } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre total de parties
      const { count: totalGames } = await supabase
        .from('airsoft_games')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre de parties passées
      const today = new Date().toISOString().split('T')[0];
      const { count: pastGames } = await supabase
        .from('airsoft_games')
        .select('*', { count: 'exact', head: true })
        .lt('date', today);

      // Récupérer le nombre de parties à venir
      const { count: upcomingGames } = await supabase
        .from('airsoft_games')
        .select('*', { count: 'exact', head: true })
        .gte('date', today);

      // Récupérer le nombre d'utilisateurs connectés (dernière activité < 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: onlineUsers } = await supabase
        .from('user_presence')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true)
        .gte('last_seen', fiveMinutesAgo);

      // Récupérer le nombre total de messages
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre total de conversations
      const { count: totalConversations } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre d'utilisateurs vérifiés
      const { count: verifiedUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);

      // Récupérer le nombre d'utilisateurs bannis
      const { count: bannedUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('Ban', true);

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

      // Récupérer les statistiques de visite des pages
      const { data: pageStats } = await supabase
        .from('page_visit_stats')
        .select('page_path, visit_count')
        .in('page_path', ['/', '/parties', '/toolbox', '/admin']);

      // Récupérer les données pour le graphique des parties par mois (12 derniers mois)
      const { data: gamesData } = await supabase
        .from('airsoft_games')
        .select('date')
        .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Récupérer les données pour le graphique des inscriptions par mois (12 derniers mois)
      const { data: registrationsData } = await supabase
        .from('profiles')
        .select('join_date')
        .gte('join_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('join_date', { ascending: true });

      // Traiter les données pour les graphiques
      const processMonthlyData = (data: any[], dateField: string) => {
        const monthCounts: { [key: string]: number } = {};
        
        // Initialiser les 12 derniers mois
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
          monthCounts[monthKey] = 0;
        }

        // Compter les éléments par mois
        data?.forEach(item => {
          if (item[dateField]) {
            const monthKey = item[dateField].slice(0, 7);
            if (monthCounts.hasOwnProperty(monthKey)) {
              monthCounts[monthKey]++;
            }
          }
        });

        // Convertir en format pour le graphique
        return Object.entries(monthCounts).map(([month, count]) => {
          const date = new Date(month + '-01');
          const monthName = date.toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: '2-digit' 
          });
          return { month: monthName, count };
        });
      };

      const gamesPerMonth = processMonthlyData(gamesData || [], 'date');
      const registrationsPerMonth = processMonthlyData(registrationsData || [], 'join_date');

      console.log('Admin statistics fetched successfully');

      return {
        totalUsers: totalUsers || 0,
        totalTeams: totalTeams || 0,
        totalGames: totalGames || 0,
        pastGames: pastGames || 0,
        upcomingGames: upcomingGames || 0,
        onlineUsers: onlineUsers || 0,
        totalMessages: totalMessages || 0,
        totalConversations: totalConversations || 0,
        verifiedUsers: verifiedUsers || 0,
        bannedUsers: bannedUsers || 0,
        discordBotDownloads: discordStats?.download_count || 0,
        discordBotInvites: discordStats?.invite_count || 0,
        pwaInstalls: pwaStats?.install_count || 0,
        homePageVisits: pageStats?.find(p => p.page_path === '/')?.visit_count || 0,
        partiesPageVisits: pageStats?.find(p => p.page_path === '/parties')?.visit_count || 0,
        toolboxPageVisits: pageStats?.find(p => p.page_path === '/toolbox')?.visit_count || 0,
        adminPageVisits: pageStats?.find(p => p.page_path === '/admin')?.visit_count || 0,
        gamesPerMonth,
        registrationsPerMonth,
      };
    },
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};
