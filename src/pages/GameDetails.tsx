import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameHeader from '@/components/game/GameHeader';
import GameTabs from '@/components/game/GameTabs';
import GameCommentsTab from '@/components/game/GameCommentsTab';
import GameParticipantsTab from '@/components/game/GameParticipantsTab';
import GameDetailsTab from '@/components/game/GameDetailsTab';
import GameRulesTab from '@/components/game/GameRulesTab';
import GameEquipmentTab from '@/components/game/GameEquipmentTab';
import ShareDialog from '@/components/game/ShareDialog';
import GameImages from '@/components/game/GameImages';
import GameInfoCard from '@/components/game/GameInfoCard';
import GameLocationCard from '@/components/game/GameLocationCard';
import RegistrationDialog from '@/components/game/RegistrationDialog';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details');
  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [creatorRating, setCreatorRating] = useState<number | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [deletingGame, setDeletingGame] = useState(false);

  useEffect(() => {
    if (id) {
      loadGameData();
      loadParticipants();
    }
  }, [id, user]);

  const loadGameData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Get the game data first without trying to join with creator
      const { data: gameData, error: gameError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('id', id)
        .single();

      if (gameError) {
        throw gameError;
      }
      
      // Then fetch the creator separately using the created_by field
      let creator: Profile | null = null;
      if (gameData.created_by) {
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', gameData.created_by)
          .single();
          
        if (creatorError) {
          console.warn("Could not fetch creator profile:", creatorError);
        } else {
          // Cast creatorData to any to safely access all properties including team_logo
          const creatorDataAny = creatorData as any;
          creator = {
            ...creatorDataAny,
            newsletter_subscribed: creatorDataAny?.newsletter_subscribed ?? null,
            team_logo: creatorDataAny?.team_logo ?? null
          } as Profile;
          
          setCreatorProfile(creator);
        }
        
        // Fetch creator's rating if available
        if (gameData.created_by) {
          const { data: ratingData } = await supabase
            .rpc('get_average_rating', { p_user_id: gameData.created_by });
            
          setCreatorRating(ratingData);
        }
      }
      
      // Combine game data with creator
      const gameWithCreator: GameData = {
        ...gameData,
        creator
      };
      
      setGameData(gameWithCreator);
      
    } catch (error) {
      console.error('Error loading game data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les informations de la partie."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    if (!id) return;

    try {
      const { data: participants, error } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', id);

      if (error) throw error;

      // Get participant profiles
      const participantsWithProfiles = await Promise.all(
        participants.map(async (participant) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', participant.user_id)
            .single();

          // Make sure newsletter_subscribed is included
          const profile = profileError ? null : {
            ...(profileData as any),
            newsletter_subscribed: profileData?.newsletter_subscribed ?? null
          } as Profile;

          return {
            ...participant,
            profile
          } as GameParticipant;
        })
      );

      setParticipants(participantsWithProfiles);
      
      // Check if current user is registered
      if (user) {
        const isUserRegistered = participantsWithProfiles.some(p => p.user_id === user.id);
        setIsRegistered(isUserRegistered);
      }

    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des participants."
      });
    }
  };
  
  const handleRegistration = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!gameData) return;
    
    try {
      setLoadingRegistration(true);
      
      if (isRegistered) {
        // Open registration management dialog
        setShowRegistrationDialog(true);
      } else {
        // Register for the game
        const { error } = await supabase
          .from('game_participants')
          .insert({
            game_id: id,
            user_id: user.id,
            role: 'Participant',
            status: 'Confirmé'
          });
          
        if (error) throw error;
        
        toast({
          title: "Inscription réussie",
          description: "Vous êtes maintenant inscrit à cette partie."
        });
        
        // Reload participants to update the list and status
        await loadParticipants();
      }
    } catch (error) {
      console.error('Error with registration:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter votre inscription."
      });
    } finally {
      setLoadingRegistration(false);
    }
  };
  
  const handleShareGame = () => {
    setShowShareDialog(true);
  };
  
  const handleUnregister = async () => {
    if (!user || !id) return;
    
    try {
      setLoadingRegistration(true);
      
      // Delete the participant entry
      const { error } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Désinscription réussie",
        description: "Vous avez été désinscrit de cette partie."
      });
      
      // Close the dialog and reload participants
      setShowRegistrationDialog(false);
      setIsRegistered(false);
      
      // Reload participants to update the list and status
      await loadParticipants();
      
    } catch (error) {
      console.error('Error unregistering:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous désinscrire de cette partie."
      });
    } finally {
      setLoadingRegistration(false);
    }
  };
  
  const navigateToCreatorProfile = () => {
    if (gameData?.creator?.username) {
      navigate(`/user/${gameData.creator.username}`);
    }
  };
  
  const handleEditGame = () => {
    navigate(`/edit-game/${id}`);
  };
  
  const handleDeleteGame = async () => {
    if (!user || !id || !gameData || user.id !== gameData.created_by) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'êtes pas autorisé à supprimer cette partie."
      });
      return;
    }
    
    try {
      setDeletingGame(true);
      
      // Delete participants first (due to foreign key constraints)
      const { error: participantsError } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id);
      
      if (participantsError) throw participantsError;
      
      // Then delete comments if they exist
      const { error: commentsError } = await supabase
        .from('game_comments')
        .delete()
        .eq('game_id', id);
        
      if (commentsError) throw commentsError;
      
      // Finally delete the game itself
      const { error: gameError } = await supabase
        .from('airsoft_games')
        .delete()
        .eq('id', id);
        
      if (gameError) throw gameError;
      
      toast({
        title: "Partie supprimée",
        description: "La partie a été supprimée avec succès."
      });
      
      // Navigate back to parties list
      navigate('/parties');
      
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la partie. Veuillez réessayer."
      });
    } finally {
      setDeletingGame(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-airsoft-red rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement des données de la partie...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPastGame = gameData ? new Date(gameData.date) < new Date() : false;
  const isCreator = user && gameData ? user.id === gameData.created_by : false;

  // Préparez les images pour le composant GameImages
  const gameImages = gameData ? [
    gameData.Picture1,
    gameData.Picture2,
    gameData.Picture3,
    gameData.Picture4,
    gameData.Picture5
  ].filter(Boolean) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {gameData && (
            <>
              <GameHeader 
                title={gameData.title}
                gameType={gameData.game_type}
                date={gameData.date}
                startTime={gameData.start_time}
                endTime={gameData.end_time}
                address={gameData.address}
                zipCode={gameData.zip_code}
                city={gameData.city}
                participantsCount={participants.length}
                maxPlayers={gameData.max_players}
                price={gameData.price}
                isRegistered={isRegistered}
                loadingRegistration={loadingRegistration}
                onRegister={handleRegistration}
                onShare={handleShareGame}
                isCreator={isCreator}
                isPastGame={isPastGame}
                onEdit={isCreator ? handleEditGame : undefined}
                onDelete={isCreator && !isPastGame ? handleDeleteGame : undefined}
              />
              
              <div className="my-6">
                <GameImages images={gameImages} title={gameData.title} />
              </div>
              
              {/* Cartes d'info et de localisation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <GameTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                  <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
                    {selectedTab === 'details' && (
                      <GameDetailsTab 
                        description={gameData.description} 
                        creator={gameData.creator} 
                        creatorRating={creatorRating}
                        navigateToCreatorProfile={navigateToCreatorProfile}
                      />
                    )}
                    {selectedTab === 'participants' && <GameParticipantsTab participants={participants} />}
                    {selectedTab === 'comments' && <GameCommentsTab gameId={id || ''} />}
                    {selectedTab === 'rules' && <GameRulesTab rules={gameData.rules} />}
                    {selectedTab === 'equipment' && (
                      <GameEquipmentTab
                        aegFpsMin={gameData.aeg_fps_min}
                        aegFpsMax={gameData.aeg_fps_max}
                        dmrFpsMax={gameData.dmr_fps_max}
                        eyeProtectionRequired={gameData.eye_protection_required}
                        fullFaceProtectionRequired={gameData.full_face_protection_required}
                        hasToilets={gameData.has_toilets}
                        hasParking={gameData.has_parking}
                        hasEquipmentRental={gameData.has_equipment_rental}
                        manualValidation={gameData.manual_validation}
                        isPrivate={gameData.is_private}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <GameInfoCard
                    price={gameData.price}
                    date={gameData.date}
                    startTime={gameData.start_time}
                    endTime={gameData.end_time}
                    participantsCount={participants.length}
                    maxPlayers={gameData.max_players}
                    isRegistered={isRegistered}
                    loadingRegistration={loadingRegistration}
                    onRegister={handleRegistration}
                  />
                  <GameLocationCard
                    address={gameData.address}
                    zipCode={gameData.zip_code}
                    city={gameData.city}
                    coordinates={[gameData.longitude || 0, gameData.latitude || 0]}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      {showShareDialog && (
        <ShareDialog 
          open={showShareDialog} 
          onOpenChange={setShowShareDialog}
          onCopyToClipboard={(text, message) => {
            navigator.clipboard.writeText(text);
            toast({
              title: "Lien copié",
              description: message
            });
          }}
        />
      )}
      {showRegistrationDialog && gameData && (
        <RegistrationDialog
          open={showRegistrationDialog}
          onOpenChange={setShowRegistrationDialog}
          gameData={gameData}
          loadingRegistration={loadingRegistration}
          onUnregister={handleUnregister}
        />
      )}
    </div>
  );
};

export default GameDetails;
