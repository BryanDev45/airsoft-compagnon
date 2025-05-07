
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { callRPC } from "@/utils/supabaseHelpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Layout Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// Game Detail Components
import GameHeader from "@/components/game/GameHeader";
import GameImages from "@/components/game/GameImages";
import GameDetailsTab from "@/components/game/GameDetailsTab";
import GameRulesTab from "@/components/game/GameRulesTab";
import GameEquipmentTab from "@/components/game/GameEquipmentTab";
import GameCommentsTab from "@/components/game/GameCommentsTab";
import GameInfoCard from "@/components/game/GameInfoCard";
import GameLocationCard from "@/components/game/GameLocationCard";
import GameParticipantsCard from "@/components/game/GameParticipantsCard";
import ParticipantsDialog from "@/components/game/ParticipantsDialog";
import ShareDialog from "@/components/game/ShareDialog";
import RegistrationDialog from "@/components/game/RegistrationDialog";
import GameOrganizerActions from "@/components/game/GameOrganizerActions";

// Types
import type { GameData, GameParticipant, Comment } from '@/types/game';
import { Info, Shield, FileText, MessageSquare } from 'lucide-react';

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCurrentUserOrganizer, setIsCurrentUserOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [creatorRating, setCreatorRating] = useState<number | null>(0);
  const [isGamePassed, setIsGamePassed] = useState(false);

  // Check authentication and registration status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        setCurrentUserId(session.user.id);
        
        if (id) {
          // Check if user is registered for this game
          const { data: participation, error } = await supabase
            .from('game_participants')
            .select('*')
            .eq('game_id', id)
            .eq('user_id', session.user.id)
            .single();

          if (participation && !error) {
            setIsRegistered(true);
          }
        }
      }
    };

    checkAuth();
    window.scrollTo(0, 0);
  }, [id]);

  // Query for game details and creator profile
  const {
    data: gameData,
    isLoading: isLoadingGame,
    error: gameError,
    refetch: refetchGame
  } = useQuery({
    queryKey: ['gameDetails', id],
    queryFn: async () => {
      if (!id) throw new Error('Game ID is required');

      const { data: game, error: gameError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('id', id)
        .single();

      if (gameError) throw gameError;

      // Check if game is passed
      const today = new Date();
      const gameDate = new Date(game.date);
      setIsGamePassed(gameDate < today);

      // Check if current user is the organizer
      if (currentUserId && game.created_by === currentUserId) {
        setIsCurrentUserOrganizer(true);
      }

      // Fetch creator profile separately
      let creator = null;
      if (game) {
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', game.created_by)
          .single();

        if (!creatorError && creatorData) {
          creator = creatorData;

          // Get creator's average rating
          const { data: avgRating } = await callRPC<number>(
            'get_average_rating',
            { p_user_id: game.created_by }
          );

          if (avgRating !== null) {
            setCreatorRating(avgRating);
          }
        }
      }

      return { ...game, creator } as GameData;
    },
    enabled: !!id
  });

  // Query for participants and their profiles
  const {
    data: participants,
    isLoading: isLoadingParticipants,
    refetch: refetchParticipants
  } = useQuery({
    queryKey: ['gameParticipants', id],
    queryFn: async () => {
      if (!id) throw new Error('Game ID is required');

      // First get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', id);

      if (participantsError) throw participantsError;

      // Then get their profiles
      const participantsWithProfiles = await Promise.all(
        (participantsData || []).map(async participant => {
          if (!participant.user_id) return { ...participant, profile: null };

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', participant.user_id)
            .single();

          return {
            ...participant,
            profile: profileError ? null : profileData
          };
        })
      );

      return participantsWithProfiles as GameParticipant[];
    },
    enabled: !!gameData
  });

  // Helper functions
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copié !",
          description: message
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de copier le lien"
        });
      });
  };

  const handleShareGame = () => {
    setShareDialogOpen(true);
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isRegistered) {
      setRegistrationDialogOpen(true);
      return;
    }

    setLoadingRegistration(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (session && id) {
      const { error } = await supabase
        .from('game_participants')
        .insert({
          game_id: id,
          user_id: session.user.id,
          role: 'Participant',
          status: 'Confirmé'
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de vous inscrire à cette partie."
        });
      } else {
        setIsRegistered(true);
        refetchParticipants();
        toast({
          title: "Inscription confirmée !",
          description: `Vous êtes inscrit à "${gameData?.title}"`,
          duration: 5000
        });
      }
    }

    setLoadingRegistration(false);
  };

  const handleUnregister = async () => {
    setLoadingRegistration(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (session && id) {
      const { error } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id)
        .eq('user_id', session.user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de vous désinscrire de cette partie."
        });
      } else {
        setIsRegistered(false);
        refetchParticipants();
        toast({
          title: "Désinscription effectuée",
          description: "Vous n'êtes plus inscrit à cette partie",
          duration: 5000
        });
      }
    }

    setLoadingRegistration(false);
    setRegistrationDialogOpen(false);
  };

  // Helper function to navigate to creator profile
  const navigateToCreatorProfile = () => {
    if (gameData?.creator?.username) {
      navigate(`/user/${gameData.creator.username}`);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au profil de l'organisateur"
      });
    }
  };

  if (isLoadingGame) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Chargement des détails de la partie...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (gameError || !gameData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold mb-4">Partie non trouvée</h1>
              <p className="mb-6 text-gray-600">
                Nous n'avons pas pu trouver les détails de cette partie. Elle a peut-être été supprimée ou l'identifiant est incorrect.
              </p>
              <button 
                className="bg-airsoft-red text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => navigate('/parties')}
              >
                Retour à la recherche de parties
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare game images
  const gameImages = [];
  if (gameData.Picture1) gameImages.push(gameData.Picture1);
  if (gameData.Picture2) gameImages.push(gameData.Picture2);
  if (gameData.Picture3) gameImages.push(gameData.Picture3);
  if (gameData.Picture4) gameImages.push(gameData.Picture4);
  if (gameData.Picture5) gameImages.push(gameData.Picture5);

  // Default scenarios if not available
  const scenarios = ["Capture de drapeaux", "Escorte VIP", "Défense de position", "Extraction d'otages"];

  // Comments will be static for now as they're not in database yet
  const comments: Comment[] = [
    {
      author: "Airsoft_Pro",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      date: "Il y a 2 jours",
      content: "Ça a l'air super ! J'ai participé à une partie similaire organisée par cette équipe et c'était vraiment bien géré."
    },
    {
      author: "Sniper_Elite",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      date: "Il y a 3 jours",
      content: "Est-ce que le terrain dispose d'un espace pour les snipers ?"
    }
  ];

  // Prepare coordinates for map
  const coordinates: [number, number] = gameData.longitude && gameData.latitude 
    ? [gameData.longitude, gameData.latitude] 
    : [2.3522, 48.8566];  // Default to Paris if no coordinates

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow bg-gray-50">
        <GameHeader
          title={gameData.title}
          gameType={gameData.game_type}
          date={gameData.date}
          startTime={gameData.start_time}
          endTime={gameData.end_time}
          address={gameData.address}
          zipCode={gameData.zip_code}
          city={gameData.city}
          participantsCount={participants?.length || 0}
          maxPlayers={gameData.max_players}
          price={gameData.price}
          isRegistered={isRegistered}
          loadingRegistration={loadingRegistration}
          onRegister={handleRegister}
          onShare={handleShareGame}
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {isCurrentUserOrganizer && (
            <div className="mb-6 flex justify-end">
              <GameOrganizerActions 
                gameId={gameData.id} 
                gameDate={gameData.date}
                isGamePassed={isGamePassed}
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <GameImages 
                images={gameImages} 
                title={gameData.title} 
              />
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <Tabs defaultValue="details">
                  <div className="px-6 pt-6">
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="details">
                        <Info size={16} className="mr-2" />
                        <span className="hidden sm:inline">Détails</span>
                      </TabsTrigger>
                      <TabsTrigger value="rules">
                        <Shield size={16} className="mr-2" />
                        <span className="hidden sm:inline">Règles</span>
                      </TabsTrigger>
                      <TabsTrigger value="equipment">
                        <FileText size={16} className="mr-2" />
                        <span className="hidden sm:inline">Équipement</span>
                      </TabsTrigger>
                      <TabsTrigger value="comments">
                        <MessageSquare size={16} className="mr-2" />
                        <span className="hidden sm:inline">Commentaires</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="details" className="p-6">
                    <GameDetailsTab 
                      description={gameData.description}
                      creator={gameData.creator}
                      creatorRating={creatorRating}
                      navigateToCreatorProfile={navigateToCreatorProfile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="rules" className="p-6">
                    <GameRulesTab rules={gameData.rules} />
                  </TabsContent>
                  
                  <TabsContent value="equipment" className="p-6">
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
                  </TabsContent>
                  
                  <TabsContent value="comments" className="p-6">
                    <GameCommentsTab comments={comments} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-6">
              <GameInfoCard 
                price={gameData.price}
                date={gameData.date}
                startTime={gameData.start_time}
                endTime={gameData.end_time}
                participantsCount={participants?.length || 0}
                maxPlayers={gameData.max_players}
                isRegistered={isRegistered}
                loadingRegistration={loadingRegistration}
                onRegister={handleRegister}
              />
              
              <GameLocationCard 
                address={gameData.address}
                zipCode={gameData.zip_code}
                city={gameData.city}
                coordinates={coordinates}
              />
              
              <GameParticipantsCard 
                participants={participants || []}
                isLoading={isLoadingParticipants}
                onViewAllClick={() => setParticipantsOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Dialogs */}
      <ParticipantsDialog 
        open={participantsOpen}
        onOpenChange={setParticipantsOpen}
        participants={participants || []}
        isLoading={isLoadingParticipants}
      />

      <ShareDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopyToClipboard={copyToClipboard}
      />

      <RegistrationDialog 
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
        gameData={gameData}
        loadingRegistration={loadingRegistration}
        onUnregister={handleUnregister}
      />
    </div>
  );
};

export default GameDetails;
