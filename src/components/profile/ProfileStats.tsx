
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Star, TrendingUp, Clock, Target, Flag, Brain, Trophy } from "lucide-react";
import RatingStars from './RatingStars';

const ProfileStats = ({ userStats, updateUserStats, fetchProfileData, profileData, isOwnProfile = false }) => {
  const [editMode, setEditMode] = useState(false);
  const [gameType, setGameType] = useState(userStats?.preferred_game_type || 'Indéfini');
  const [role, setRole] = useState(userStats?.favorite_role || 'Indéfini');
  const [level, setLevel] = useState(userStats?.level || 'Débutant');

  const handleSaveStats = async () => {
    const success = await updateUserStats(gameType, role, level);
    if (success) {
      toast({
        title: "Statistiques mises à jour",
        description: "Vos préférences ont été enregistrées",
      });
      setEditMode(false);
      fetchProfileData();
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les statistiques",
        variant: "destructive"
      });
    }
  };

  const cancelEdit = () => {
    setGameType(userStats?.preferred_game_type || 'Indéfini');
    setRole(userStats?.favorite_role || 'Indéfini');
    setLevel(userStats?.level || 'Débutant');
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">Statistiques de jeu</h2>
        {isOwnProfile && (
          <Button 
            variant="outline" 
            onClick={() => setEditMode(!editMode)}
            className={`${editMode ? 'hidden' : ''}`}
          >
            Modifier mes préférences
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Réputation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold">
                {profileData?.reputation ? profileData.reputation.toFixed(1) : "0.0"}
              </span>
              <span className="text-gray-500 ml-2">/ 5</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Parties jouées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{userStats?.games_played || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Parties organisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{userStats?.games_organized || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Préférences de jeu</CardTitle>
          <CardDescription>
            Ces informations sont basées sur vos parties et préférences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de jeu préféré
              </label>
              {editMode ? (
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CQB">CQB</SelectItem>
                    <SelectItem value="Milsim">Milsim</SelectItem>
                    <SelectItem value="Woodland">Woodland</SelectItem>
                    <SelectItem value="Speedsoft">Speedsoft</SelectItem>
                    <SelectItem value="Scénario">Scénario</SelectItem>
                    <SelectItem value="Indéfini">Indéfini</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-semibold">{userStats?.preferred_game_type || 'Indéfini'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle favori
              </label>
              {editMode ? (
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assaut">Assaut</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Sniper">Sniper</SelectItem>
                    <SelectItem value="Scout">Scout</SelectItem>
                    <SelectItem value="Médic">Médic</SelectItem>
                    <SelectItem value="Ingénieur">Ingénieur</SelectItem>
                    <SelectItem value="Indéfini">Indéfini</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-semibold">{userStats?.favorite_role || 'Indéfini'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau estimé
              </label>
              {editMode ? (
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Confirmé">Confirmé</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-semibold">{userStats?.level || 'Débutant'}</p>
              )}
            </div>
          </div>
          
          {editMode && (
            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" onClick={cancelEdit}>Annuler</Button>
              <Button onClick={handleSaveStats}>Enregistrer</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
