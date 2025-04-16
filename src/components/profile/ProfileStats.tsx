
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileStatsProps {
  stats: any;
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques détaillées</CardTitle>
        <CardDescription>
          Analyse complète de votre parcours d'airsofteur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Performance</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Taux de victoire</p>
                <p className="font-medium">{stats.winRate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Précision</p>
                <p className="font-medium">{stats.accuracy}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Temps de jeu</p>
                <p className="font-medium">{stats.timePlayed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Rôle préféré</p>
                <p className="font-medium">{stats.favoriteRole}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg border-b pb-2 mt-6">Compétences</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Travail d'équipe</p>
                <p className="font-medium">{stats.teamwork}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Conscience tactique</p>
                <p className="font-medium">{stats.tacticalAwareness}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Objectifs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Objectifs complétés</p>
                <p className="font-medium">{stats.objectivesCompleted}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Drapeaux capturés</p>
                <p className="font-medium">{stats.flagsCaptured}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Protections VIP</p>
                <p className="font-medium">{stats.vipProtection}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Sauvetages d'otages</p>
                <p className="font-medium">{stats.hostageRescue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Désamorçages de bombes</p>
                <p className="font-medium">{stats.bombDefusal}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg border-b pb-2 mt-6">Préférences</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Type de jeu préféré</p>
                <p className="font-medium">{stats.preferredGameType}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
