
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X, Trophy, Users } from 'lucide-react';
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
  const [selectedLevel, setSelectedLevel] = useState(userStats?.level || 'Débutant');
  
  const levels = ['Débutant', 'Intermédiaire', 'Confirmé', 'Expert', 'Élite'];

  const handleSave = async () => {
    try {
      // Mise à jour du niveau dans la base de données
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          preferred_game_type: preferredGameType,
          favorite_role: favoriteRole,
          level: selectedLevel 
        })
        .eq('user_id', userStats.user_id);

      if (error) throw error;
      
      // Appel de la fonction existante pour mettre à jour les autres statistiques
      await updateUserStats(preferredGameType, favoriteRole);
      
      setIsEditing(false);
      
      toast({
        title: "Statistiques mises à jour",
        description: "Vos préférences et votre niveau ont été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les statistiques",
        variant: "destructive",
      });
    }
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
                {isEditing ? (
                  <Select 
                    value={selectedLevel} 
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-800">{userStats.level}</p>
                )}
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
                  <Users className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-2xl font-bold">{userStats.games_organized || 0}</span>
                  <span className="text-xs text-gray-500">Parties créées</span>
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
