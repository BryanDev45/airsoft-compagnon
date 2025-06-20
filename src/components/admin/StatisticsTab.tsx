
import React from 'react';
import { useAdminStats } from '@/hooks/admin/useAdminStats';
import StatisticsHeader from './statistics/StatisticsHeader';
import StatsChartsSection from './statistics/StatsChartsSection';
import StatsCardsGrid from './statistics/StatsCardsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye,
  Search,
  TrendingUp,
} from 'lucide-react';
import { createPageVisitCards, createSearchTabVisitCards, createToolboxVisitCards } from './statistics/StatsPageVisitCards';

const StatisticsTab: React.FC = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const pageVisitCards = createPageVisitCards(stats);
  const searchTabVisitCards = createSearchTabVisitCards(stats);
  const toolboxVisitCards = createToolboxVisitCards(stats);

  return (
    <div className="space-y-6">
      <StatisticsHeader />

      <StatsChartsSection
        gamesPerMonth={stats?.gamesPerMonth || []}
        registrationsPerMonth={stats?.registrationsPerMonth || []}
        playersByCountry={stats?.playersByCountry || []}
        gamesByCountry={stats?.gamesByCountry || []}
      />

      <StatsCardsGrid stats={stats} />

      {/* Page Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Statistiques de visite des pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {pageVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Page Tabs Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Statistiques des onglets de la page de recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchTabVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Toolbox Visit Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            Statistiques des onglets de la boîte à outils
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {toolboxVisitCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor} text-center`}>
                  <div className="flex items-center justify-center mb-3">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Informations complémentaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Taux de vérification</h4>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
              </p>
              <p className="text-sm text-blue-600">
                {stats?.verifiedUsers} sur {stats?.totalUsers} utilisateurs
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Parties actives</h4>
              <p className="text-2xl font-bold text-green-600">
                {stats?.totalGames ? Math.round((stats.upcomingGames / stats.totalGames) * 100) : 0}%
              </p>
              <p className="text-sm text-green-600">
                {stats?.upcomingGames} parties à venir sur {stats?.totalGames} total
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Adoption du bot Discord</h4>
              <p className="text-2xl font-bold text-purple-600">
                {((stats?.discordBotDownloads || 0) + (stats?.discordBotInvites || 0)).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">
                Total téléchargements + invitations
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              <strong>Note :</strong> Les statistiques sont actualisées automatiquement toutes les 30 secondes. 
              Les utilisateurs en ligne sont ceux ayant eu une activité dans les 5 dernières minutes.
              Les statistiques de téléchargement et de visite sont mises à jour en temps réel.
              Les graphiques montrent les données des 12 derniers mois.
              Les statistiques par pays sont basées sur les informations de localisation des profils utilisateurs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;
