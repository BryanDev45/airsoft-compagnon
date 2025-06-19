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
  profilePageVisits: number;
  teamPageVisits: number;
  toolboxCalculatorsVisits: number;
  toolboxDiscordBotVisits: number;
  toolboxGlossaryVisits: number;
  toolboxScenariosVisits: number;
  toolboxTroubleshootingVisits: number;
  toolboxGuidesVisits: number;
  partiesTabVisits: number;
  joueursTabVisits: number;
  equipesTabVisits: number;
  magasinsTabVisits: number;
  gamesPerMonth: Array<{ month: string; count: number }>;
  registrationsPerMonth: Array<{ month: string; count: number }>;
  playersByCountry: Array<{ country: string; count: number }>;
  gamesByCountry: Array<{ country: string; count: number }>;
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
        .in('page_path', [
          '/', 
          '/parties', 
          '/toolbox', 
          '/profile', 
          '/team',
          '/toolbox/calculators',
          '/toolbox/discord-bot',
          '/toolbox/glossary',
          '/toolbox/scenarios',
          '/toolbox/troubleshooting',
          '/toolbox/guides',
          '/parties/parties',
          '/parties/joueurs',
          '/parties/equipes',
          '/parties/magasins'
        ]);

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

      // Nouvelles requêtes pour les statistiques par pays
      // Récupérer les joueurs par pays en analysant leur localisation
      const { data: playersLocationData } = await supabase
        .from('profiles')
        .select('location')
        .not('location', 'is', null);

      // Récupérer les parties par pays (toutes les parties sont en France pour le moment)
      const { data: gamesLocationData } = await supabase
        .from('airsoft_games')
        .select('city, zip_code');

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

      // Traiter les données des joueurs par pays
      const processPlayersByCountry = (data: any[]) => {
        const countryCounts: { [key: string]: number } = {};
        
        data?.forEach(item => {
          if (item.location) {
            // Extraire le pays de la localisation (généralement à la fin)
            const locationParts = item.location.split(',').map((part: string) => part.trim());
            const country = locationParts[locationParts.length - 1] || 'Inconnu';
            
            // Normaliser certains noms de pays
            let normalizedCountry = country;
            if (country.toLowerCase().includes('france') || country.toLowerCase().includes('français')) {
              normalizedCountry = 'France';
            } else if (country.toLowerCase().includes('belgique') || country.toLowerCase().includes('belge')) {
              normalizedCountry = 'Belgique';
            } else if (country.toLowerCase().includes('suisse') || country.toLowerCase().includes('swiss')) {
              normalizedCountry = 'Suisse';
            } else if (country.toLowerCase().includes('canada') || country.toLowerCase().includes('canadien')) {
              normalizedCountry = 'Canada';
            }
            
            countryCounts[normalizedCountry] = (countryCounts[normalizedCountry] || 0) + 1;
          }
        });

        return Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 pays
      };

      // Traiter les données des parties par pays
      const processGamesByCountry = (data: any[]) => {
        const countryCounts: { [key: string]: number } = {};
        
        data?.forEach(item => {
          // Pour le moment, toutes les parties sont en France
          // Mais on peut analyser les codes postaux pour déterminer les régions/départements
          let country = 'France';
          
          // On pourrait ajouter une logique pour identifier d'autres pays
          // basée sur les codes postaux ou villes spécifiques
          
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        return Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);
      };

      const gamesPerMonth = processMonthlyData(gamesData || [], 'date');
      const registrationsPerMonth = processMonthlyData(registrationsData || [], 'join_date');
      const playersByCountry = processPlayersByCountry(playersLocationData || []);
      const gamesByCountry = processGamesByCountry(gamesLocationData || []);

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
        profilePageVisits: pageStats?.find(p => p.page_path === '/profile')?.visit_count || 0,
        teamPageVisits: pageStats?.find(p => p.page_path === '/team')?.visit_count || 0,
        toolboxCalculatorsVisits: pageStats?.find(p => p.page_path === '/toolbox/calculators')?.visit_count || 0,
        toolboxDiscordBotVisits: pageStats?.find(p => p.page_path === '/toolbox/discord-bot')?.visit_count || 0,
        toolboxGlossaryVisits: pageStats?.find(p => p.page_path === '/toolbox/glossary')?.visit_count || 0,
        toolboxScenariosVisits: pageStats?.find(p => p.page_path === '/toolbox/scenarios')?.visit_count || 0,
        toolboxTroubleshootingVisits: pageStats?.find(p => p.page_path === '/toolbox/troubleshooting')?.visit_count || 0,
        toolboxGuidesVisits: pageStats?.find(p => p.page_path === '/toolbox/guides')?.visit_count || 0,
        partiesTabVisits: pageStats?.find(p => p.page_path === '/parties/parties')?.visit_count || 0,
        joueursTabVisits: pageStats?.find(p => p.page_path === '/parties/joueurs')?.visit_count || 0,
        equipesTabVisits: pageStats?.find(p => p.page_path === '/parties/equipes')?.visit_count || 0,
        magasinsTabVisits: pageStats?.find(p => p.page_path === '/parties/magasins')?.visit_count || 0,
        gamesPerMonth,
        registrationsPerMonth,
        playersByCountry,
        gamesByCountry,
      };
    },
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};
