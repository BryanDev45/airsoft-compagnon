import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserGames } from '@/hooks/useUserGames';
import { useEquipmentActions } from '@/hooks/useEquipmentActions';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { GameList } from '@/components/profile/GameList';
import { EquipmentList } from '@/components/profile/EquipmentList';
import { toast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const session = useSession();
  const userId = session?.user?.id;

  // Hooks
  const {
    loading: profileLoading,
    profileData,
    userStats,
    fetchProfileData,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
  } = useProfileData(userId);

  const {
    userGames,
    fetchUserGames,
    loading: gamesLoading,
    error: gamesError,
  } = useUserGames(userId);

  const {
    userEquipment,
    fetchUserEquipment,
    loading: equipmentLoading,
    error: equipmentError,
  } = useEquipmentActions(userId);

  // Initial data load
  useEffect(() => {
    if (userId) {
      fetchProfileData();
      fetchUserGames();
      fetchUserEquipment();
    }
  }, [userId]);

  // Global error handling (optionnel)
  useEffect(() => {
    if (gamesError || equipmentError) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger toutes les données du profil",
        variant: "destructive",
      });
    }
  }, [gamesError, equipmentError]);

  // Affichage en attendant le chargement
  if (!userId || profileLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProfileHeader profile={profileData} updateLocation={updateLocation} />

      {/* Stats utilisateur */}
      {userStats && <ProfileStats stats={userStats} />}

      {/* Liste des parties */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Mes parties</h2>
        {gamesLoading ? (
          <Skeleton className="w-full h-32" />
        ) : (
          <GameList games={userGames} />
        )}
      </section>

      {/* Liste du matériel */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Mon équipement</h2>
        {equipmentLoading ? (
          <Skeleton className="w-full h-32" />
        ) : (
          <EquipmentList equipment={userEquipment} />
        )}
      </section>
    </div>
  );
}
