
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Gamepad, Plus, Star, Award, Zap, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileStatsProps {
  stats: any;
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  const [editing, setEditing] = useState(false);
  const [preferredGameType, setPreferredGameType] = useState(stats.preferredGameType);
  const [favoriteRole, setFavoriteRole] = useState(stats.favoriteRole);
  
  const handleSave = () => {
    // In a real app, we would save to backend here
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
            <Button className="bg-airsoft-red hover:bg-red-700 text-white" size="sm" onClick={handleSave}>
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
                <p className="font-medium">{stats.gamesPlayed || stats.timePlayed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Plus className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Parties créées</p>
                <p className="font-medium">{stats.gamesCreated || '5'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mode de jeu préféré</p>
                {editing ? (
                  <Select defaultValue={preferredGameType} onValueChange={setPreferredGameType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un mode de jeu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Capture de drapeau">Capture de drapeau</SelectItem>
                      <SelectItem value="Deathmatch">Deathmatch</SelectItem>
                      <SelectItem value="Domination">Domination</SelectItem>
                      <SelectItem value="Escort">Escort</SelectItem>
                      <SelectItem value="Rush">Rush</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{preferredGameType}</p>
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
                  <Select defaultValue={favoriteRole} onValueChange={setFavoriteRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assaut">Assaut</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Sniper">Sniper</SelectItem>
                      <SelectItem value="Médic">Médic</SelectItem>
                      <SelectItem value="Éclaireur">Éclaireur</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-medium">{favoriteRole}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nombre d'opérations</p>
                <p className="font-medium">{stats.operations || '12'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-airsoft-red" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nombre de dominicales</p>
                <p className="font-medium">{stats.sundayGames || '24'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
