
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProfileStatsProps {
  userStats: any;
  updateUserStats: (gameType: string, role: string, level: string) => Promise<boolean>;
  fetchProfileData: () => Promise<void>;
  isOwnProfile?: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ 
  userStats, 
  updateUserStats,
  fetchProfileData,
  isOwnProfile = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [preferredGameType, setPreferredGameType] = useState(userStats?.preferred_game_type || 'CQB');
  const [favoriteRole, setFavoriteRole] = useState(userStats?.favorite_role || 'Assaut');
  const [level, setLevel] = useState(userStats?.level || 'Débutant');
  const [isLoading, setIsLoading] = useState(false);
  
  const gameTypes = ['CQB', 'Milsim', 'Scénario', 'Woodland', 'Speedsoft'];
  const roles = ['Assaut', 'DMR', 'Sniper', 'Support', 'Médic', 'Ingénieur', 'Éclaireur'];
  const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert', 'Vétéran'];
  
  const handleSaveStats = async () => {
    setIsLoading(true);
    try {
      const success = await updateUserStats(preferredGameType, favoriteRole, level);
      if (success) {
        await fetchProfileData();
        setIsEditing(false);
        toast({
          title: "Statistiques mises à jour",
          description: "Vos statistiques ont été mises à jour avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistiques du joueur</h2>
        {isOwnProfile && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Parties jouées</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.games_played || 0}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Parties organisées</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.games_organized || 0}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Réputation</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.reputation ? parseFloat(userStats.reputation).toFixed(1) : '0.0'} / 5</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type de partie préféré</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.preferred_game_type || 'Non défini'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rôle favori</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.favorite_role || 'Non défini'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Niveau</dt>
                <dd className="mt-1 text-lg font-semibold">{userStats?.level || 'Non défini'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier vos statistiques</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="gameType" className="block text-sm font-medium mb-1">Type de partie préféré</label>
              <Select value={preferredGameType} onValueChange={setPreferredGameType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un type de partie" />
                </SelectTrigger>
                <SelectContent>
                  {gameTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Rôle favori</label>
              <Select value={favoriteRole} onValueChange={setFavoriteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-1">Niveau</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            <Button onClick={handleSaveStats} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileStats;
