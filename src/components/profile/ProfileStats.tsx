import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, Trophy, Target, Users, Calendar, Star, Award, Medal } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const levelOptions = ['Débutant', 'Novice', 'Intermédiaire', 'Confirmé', 'Expert', 'Vétéran'];
const gameTypeOptions = ['CQB', 'Milsim', 'Woodland', 'Scénario', 'Speedsoft', 'Tournoi'];
const roleOptions = ['Assaut', 'Support', 'Sniper', 'Démolition', 'Médic', 'Éclaireur'];

const ProfileStats = ({ userStats, updateUserStats, fetchProfileData, isOwnProfile = false, profileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gameType, setGameType] = useState(userStats?.preferred_game_type || 'CQB');
  const [role, setRole] = useState(userStats?.favorite_role || 'Assaut');
  const [level, setLevel] = useState(userStats?.level || 'Débutant');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userStats) {
      setGameType(userStats.preferred_game_type);
      setRole(userStats.favorite_role);
      setLevel(userStats.level);
    }
  }, [userStats]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("Mise à jour des statistiques:", gameType, role, level);
      
      const success = await updateUserStats(gameType, role, level);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Vos préférences ont été mises à jour.",
        });
        setIsEditing(false);
        await fetchProfileData();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'Débutant': 'bg-green-100 text-green-800',
      'Novice': 'bg-blue-100 text-blue-800',
      'Intermédiaire': 'bg-indigo-100 text-indigo-800',
      'Confirmé': 'bg-purple-100 text-purple-800',
      'Expert': 'bg-yellow-100 text-yellow-800',
      'Vétéran': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Utiliser la réputation du profil au lieu du stats.reputation
  const reputation = profileData?.reputation || 0;

  return (
    <Card className="p-4 sm:p-6 shadow-md bg-gradient-to-br from-white to-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Medal className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-semibold">Statistiques et préférences</h2>
        </div>
        {isOwnProfile && !isEditing ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : isEditing ? (
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-none"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-airsoft-red hover:bg-red-700 flex-1 sm:flex-none"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="space-y-1 bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-lg shadow-sm border border-amber-200 flex items-center">
          <Trophy className="text-amber-500 w-10 h-10 mr-4" />
          <div>
            <span className="text-sm font-medium text-amber-700">Parties jouées</span>
            <p className="text-amber-900 text-2xl font-bold">{userStats?.games_played || 0}</p>
          </div>
        </div>

        <div className="space-y-1 bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg shadow-sm border border-blue-200 flex items-center">
          <Calendar className="text-blue-500 w-10 h-10 mr-4" />
          <div>
            <span className="text-sm font-medium text-blue-700">Parties créées</span>
            <p className="text-blue-900 text-2xl font-bold">{userStats?.games_organized || 0}</p>
          </div>
        </div>

        <div className="space-y-1 bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg shadow-sm border border-purple-200 flex items-center">
          <Star className="text-purple-500 w-10 h-10 mr-4" />
          <div>
            <span className="text-sm font-medium text-purple-700">Réputation</span>
            <p className="text-purple-900 text-2xl font-bold">{reputation.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-lg shadow-sm border border-indigo-200">
          <span className="text-sm font-medium text-indigo-700">Type de partie préféré</span>
          {isEditing ? (
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger className="mt-2 bg-white border-indigo-200">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {gameTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center mt-2">
              <Target className="text-indigo-500 w-5 h-5 mr-2" />
              <p className="text-indigo-900 font-medium text-lg">{userStats?.preferred_game_type || 'Non spécifié'}</p>
            </div>
          )}
        </div>

        <div className="space-y-1 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg shadow-sm border border-green-200">
          <span className="text-sm font-medium text-green-700">Rôle préféré</span>
          {isEditing ? (
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-2 bg-white border-green-200">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center mt-2">
              <Users className="text-green-500 w-5 h-5 mr-2" />
              <p className="text-green-900 font-medium text-lg">{userStats?.favorite_role || 'Non spécifié'}</p>
            </div>
          )}
        </div>

        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">Niveau</span>
          {isEditing ? (
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="mt-2 bg-white">
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mt-2 gap-2">
              <div className="flex items-center">
                <Award className="text-gray-500 w-5 h-5 mr-2" />
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(userStats?.level || 'Débutant')}`}>
                  {userStats?.level || 'Débutant'}
                </span>
              </div>
              <div className="w-full sm:w-2/3 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-green-400 to-airsoft-red h-2.5 rounded-full" 
                  style={{ 
                    width: `${(levelOptions.indexOf(userStats?.level || 'Débutant') + 1) * (100 / levelOptions.length)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileStats;
