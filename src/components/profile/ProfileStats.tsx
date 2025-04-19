
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, Trophy, Target, Users, Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const levelOptions = ['Débutant', 'Novice', 'Intermédiaire', 'Confirmé', 'Expert', 'Vétéran'];
const gameTypeOptions = ['CQB', 'Milsim', 'Woodland', 'Scénario', 'Speedsoft', 'Tournoi'];
const roleOptions = ['Assaut', 'Support', 'Sniper', 'Démolition', 'Médic', 'Éclaireur'];

const ProfileStats = ({ userStats, updateUserStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gameType, setGameType] = useState(userStats?.preferred_game_type || 'CQB');
  const [role, setRole] = useState(userStats?.favorite_role || 'Assaut');
  const [level, setLevel] = useState(userStats?.level || 'Débutant');

  const handleSave = async () => {
    try {
      await updateUserStats(gameType, role, level);
      setIsEditing(false);
      toast({
        title: "Statistiques mises à jour",
        description: "Vos préférences ont été enregistrées avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques",
        variant: "destructive"
      });
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

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Statistiques et préférences</h2>
        {!isEditing ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-airsoft-red hover:bg-red-700"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <Trophy className="text-amber-500 w-8 h-8 mr-4" />
          <div>
            <span className="text-sm font-medium text-gray-500">Parties jouées</span>
            <p className="text-gray-900 text-2xl font-bold">{userStats?.games_played || 0}</p>
          </div>
        </div>

        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <Calendar className="text-blue-500 w-8 h-8 mr-4" />
          <div>
            <span className="text-sm font-medium text-gray-500">Parties créées</span>
            <p className="text-gray-900 text-2xl font-bold">{userStats?.games_organized || 0}</p>
          </div>
        </div>

        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-500">Type de partie préféré</span>
          {isEditing ? (
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger className="mt-2 bg-white">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {gameTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center mt-1">
              <Target className="text-purple-500 w-5 h-5 mr-2" />
              <p className="text-gray-900 font-medium text-lg">{userStats?.preferred_game_type || 'Non spécifié'}</p>
            </div>
          )}
        </div>

        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-500">Rôle préféré</span>
          {isEditing ? (
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-2 bg-white">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center mt-1">
              <Users className="text-indigo-500 w-5 h-5 mr-2" />
              <p className="text-gray-900 font-medium text-lg">{userStats?.favorite_role || 'Non spécifié'}</p>
            </div>
          )}
        </div>

        <div className="space-y-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 col-span-1 sm:col-span-2">
          <span className="text-sm font-medium text-gray-500">Niveau</span>
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
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(userStats?.level || 'Débutant')}`}>
                  {userStats?.level || 'Débutant'}
                </span>
              </div>
              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
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
