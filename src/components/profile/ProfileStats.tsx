
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Gamepad, Plus, Star, Award, Zap, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileStats = ({
  userStats,
  updateUserStats
}) => {
  const [editing, setEditing] = useState(false);
  const [preferredGameType, setPreferredGameType] = useState(userStats?.preferred_game_type || '');
  const [favoriteRole, setFavoriteRole] = useState(userStats?.favorite_role || '');
  
  const handleSave = async () => {
    await updateUserStats(preferredGameType, favoriteRole);
    setEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Statistiques détaillées</CardTitle>
          <CardDescription>
            Analyse de votre parcours d'airsofteur
          </CardDescription>
        </div>
        {editing ? (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setEditing(false)} size="sm">
              <X className="h-4 w-4 mr-2" /> Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              size="sm"
              className="bg-airsoft-red hover:bg-red-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" /> Enregistrer
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)} className="bg-airsoft-red hover:bg-red-700 text-white" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Gamepad className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Parties jouées</p>
                <p className="font-medium">{userStats?.games_played || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Plus className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Parties créées</p>
                <p className="font-medium">{userStats?.games_organized || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mode de jeu préféré</p>
                {editing ? (
                  <Select 
                    value={preferredGameType} 
                    onValueChange={setPreferredGameType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un mode de jeu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CQB">CQB</SelectItem>
                      <SelectItem value="Field">Field</SelectItem>
                      <SelectItem value="Milsim">Milsim</SelectItem>
                      <SelectItem value="Scénario">Scénario</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{userStats?.preferred_game_type || '-'}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Rôle préféré</p>
                {editing ? (
                  <Select 
                    value={favoriteRole} 
                    onValueChange={setFavoriteRole}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assaut">Assaut</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Sniper">Sniper</SelectItem>
                      <SelectItem value="Éclaireur">Éclaireur</SelectItem>
                      <SelectItem value="Médic">Médic</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{userStats?.favorite_role || '-'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Précision</p>
                <p className="font-medium">{userStats?.accuracy || '0%'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Temps de jeu</p>
                <p className="font-medium">{userStats?.time_played || '0h'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
