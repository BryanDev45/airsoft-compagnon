
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X } from 'lucide-react';
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

  return (
    <Card className="p-6">
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
        {/* Parties jouées */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500">Parties jouées</span>
          <p className="text-gray-900 text-lg font-medium">{userStats?.games_played || 0}</p>
        </div>

        {/* Parties créées */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500">Parties créées</span>
          <p className="text-gray-900 text-lg font-medium">{userStats?.games_organized || 0}</p>
        </div>

        {/* Type de partie préféré */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500">Type de partie préféré</span>
          {isEditing ? (
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {gameTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-900">{userStats?.preferred_game_type || 'Non spécifié'}</p>
          )}
        </div>

        {/* Rôle préféré */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500">Rôle préféré</span>
          {isEditing ? (
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-900">{userStats?.favorite_role || 'Non spécifié'}</p>
          )}
        </div>

        {/* Niveau */}
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-500">Niveau</span>
          {isEditing ? (
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-900">{userStats?.level || 'Débutant'}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileStats;
