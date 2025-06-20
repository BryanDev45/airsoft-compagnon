
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useChartData = () => {
  return useQuery({
    queryKey: ['admin-chart-data'],
    queryFn: async () => {
      console.log('Fetching chart data...');

      const [
        { data: gamesData },
        { data: registrationsData },
        { data: playersLocationData },
        { data: gamesLocationData }
      ] = await Promise.all([
        supabase.from('airsoft_games').select('date')
          .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true }),
        supabase.from('profiles').select('join_date')
          .gte('join_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('join_date', { ascending: true }),
        supabase.from('profiles').select('location').not('location', 'is', null),
        supabase.from('airsoft_games').select('city, zip_code')
      ]);

      // Traitement des données
      const processMonthlyData = (data: any[], dateField: string) => {
        const monthCounts: { [key: string]: number } = {};
        
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthKey = date.toISOString().slice(0, 7);
          monthCounts[monthKey] = 0;
        }

        data?.forEach(item => {
          if (item[dateField]) {
            const monthKey = item[dateField].slice(0, 7);
            if (monthCounts.hasOwnProperty(monthKey)) {
              monthCounts[monthKey]++;
            }
          }
        });

        return Object.entries(monthCounts).map(([month, count]) => {
          const date = new Date(month + '-01');
          const monthName = date.toLocaleDateString('fr-FR', { 
            month: 'short', 
            year: '2-digit' 
          });
          return { month: monthName, count };
        });
      };

      const processPlayersByCountry = (data: any[]) => {
        const countryCounts: { [key: string]: number } = {};
        
        data?.forEach(item => {
          if (item.location) {
            const locationParts = item.location.split(',').map((part: string) => part.trim());
            const country = locationParts[locationParts.length - 1] || 'Inconnu';
            
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
          .slice(0, 10);
      };

      const processGamesByCountry = (data: any[]) => {
        const countryCounts: { [key: string]: number } = {};
        
        data?.forEach(() => {
          const country = 'France';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        return Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);
      };

      return {
        gamesPerMonth: processMonthlyData(gamesData || [], 'date'),
        registrationsPerMonth: processMonthlyData(registrationsData || [], 'join_date'),
        playersByCountry: processPlayersByCountry(playersLocationData || []),
        gamesByCountry: processGamesByCountry(gamesLocationData || []),
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};
