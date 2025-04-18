
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X, Trophy, Users, Timer, Target, Flag, Crosshair } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileStatsProps {
  userStats: any;
  updateUserStats: (preferredGameType: string, favoriteRole: string) => Promise<void>;
}

const ProfileStats = ({ userStats, updateUserStats }: ProfileStatsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [preferredGameType, setPreferredGameType] = useState(userStats?.preferred_game_type || 'CQB');
  const [favoriteRole, setFavoriteRole] = useState(userStats?.favorite_role || 'Assaut');

  const handleSave = async () => {
    await updateUserStats(preferredGameType, favoriteRole);
    setIsEditing(false);
  };

  if (!userStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
          <CardDescription>Chargement des statistiques...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Statistiques & préférences</CardTitle>
            <CardDescription>Vos statistiques et préférences de jeu</CardDescription>
          </div>
          
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="bg-airsoft-red hover:bg-red-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Préférences</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mode de jeu préféré</label>
                {isEditing ? (
                  <Select 
                    value={preferredGameType} 
                    onValueChange={setPreferredGameType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un mode de jeu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CQB">CQB</SelectItem>
                      <SelectItem value="Milsim">Milsim</SelectItem>
                      <SelectItem value="Woodland">Woodland</SelectItem>
                      <SelectItem value="Speedsoft">Speedsoft</SelectItem>
                      <SelectItem value="Scénario">Scénario</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-800">{userStats.preferred_game_type}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôle préféré</label>
                {isEditing ? (
                  <Select 
                    value={favoriteRole} 
                    onValueChange={setFavoriteRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assaut">Assaut</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Sniper">Sniper</SelectItem>
                      <SelectItem value="Scout">Scout</SelectItem>
                      <SelectItem value="Médic">Médic</SelectItem>
                      <SelectItem value="Leader">Leader</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-800">{userStats.favorite_role}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <p className="text-gray-800">{userStats.level}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Réputation</label>
                <div className="flex items-center gap-2">
                  <Progress value={userStats.reputation * 10} className="h-2" />
                  <span className="text-sm">{userStats.reputation}/10</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Performance</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center border rounded-lg p-3">
                  <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-2xl font-bold">{userStats.games_played}</span>
                  <span className="text-xs text-gray-500">Parties jouées</span>
                </div>
                
                <div className="flex flex-col items-center border rounded-lg p-3">
                  <Crosshair className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-2xl font-bold">{userStats.accuracy}</span>
                  <span className="text-xs text-gray-500">Précision</span>
                </div>
                
                <div className="flex flex-col items-center border rounded-lg p-3">
                  <Users className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-2xl font-bold">{userStats.win_rate}</span>
                  <span className="text-xs text-gray-500">Taux de victoire</span>
                </div>
                
                <div className="flex flex-col items-center border rounded-lg p-3">
                  <Timer className="h-5 w-5 text-orange-500 mb-1" />
                  <span className="text-2xl font-bold">{userStats.time_played}</span>
                  <span className="text-xs text-gray-500">Temps de jeu</span>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-2">Objectifs</h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Objectifs complétés</span>
                    <span>{userStats.objectives_completed}</span>
                  </div>
                  <Progress value={Math.min(userStats.objectives_completed, 100)} className="h-1.5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Drapeaux capturés</span>
                    <span>{userStats.flags_captured}</span>
                  </div>
                  <Progress value={Math.min(userStats.flags_captured, 100)} className="h-1.5" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sens tactique</span>
                    <span>{userStats.tactical_awareness}</span>
                  </div>
                  <Progress value={userStats.tactical_awareness === 'Excellent' ? 100 : userStats.tactical_awareness === 'Bon' ? 75 : userStats.tactical_awareness === 'Moyen' ? 50 : 25} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
