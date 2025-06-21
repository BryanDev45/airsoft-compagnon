
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameHeader from '@/components/game/GameHeader';
import GameTabs from '@/components/game/GameTabs';
import GameDetailsContainer from '@/components/game/GameDetailsContainer';
import GameSidebar from '@/components/game/GameSidebar';
import ShareDialog from '@/components/game/ShareDialog';
import GameImages from '@/components/game/GameImages';
import RegistrationDialog from '@/components/game/RegistrationDialog';
import InvoiceDownloadButton from '@/components/game/InvoiceDownloadButton';
import { useGameData } from '@/hooks/game/useGameData';
import { useGameActions } from '@/hooks/game/useGameActions';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('details');
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('GameDetails component rendered with ID:', id);

  const {
    gameData,
    participants,
    loading,
    isRegistered,
    creatorRating,
    creatorProfile,
    userProfile,
    loadParticipants
  } = useGameData(id);

  console.log('GameDetails data:', { gameData, participants, loading, isRegistered });

  const {
    loadingRegistration,
    showShareDialog,
    setShowShareDialog,
    showRegistrationDialog,
    setShowRegistrationDialog,
    handleRegistration,
    handleUnregister,
    handleDeleteGame,
    isUserAdmin
  } = useGameActions(gameData, id, loadParticipants);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      }
    };
    
    checkAdminStatus();
  }, [user, isUserAdmin]);

  const handleShareGame = () => {
    setShowShareDialog(true);
  };
  
  const navigateToCreatorProfile = () => {
    if (gameData?.creator?.username) {
      navigate(`/user/${gameData.creator.username}`);
    }
  };
  
  const handleEditGame = () => {
    navigate(`/edit-game/${id}`);
  };

  // Afficher le chargement seulement si on charge vraiment et qu'on n'a pas encore essayé de charger
  if (loading) {
    console.log('GameDetails: Showing loading state');
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

  // Vérification si les données de la partie existent - seulement après que le chargement soit terminé
  // Ajout d'une vérification supplémentaire pour s'assurer qu'on a vraiment fini de charger
  if (!loading && !gameData && id) {
    console.log('GameDetails: No game data available after loading completed');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Partie non trouvée</h2>
            <p className="text-gray-600 mb-6">Cette partie n'existe pas ou a été supprimée.</p>
            <button 
              onClick={() => navigate('/parties')}
              className="bg-airsoft-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retour aux parties
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si on n'a pas d'ID, rediriger
  if (!id) {
    navigate('/parties');
    return null;
  }

  // Si on est encore en train de charger les données, afficher le loader
  if (!gameData) {
    console.log('GameDetails: Still loading game data...');
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

  console.log('GameDetails: Rendering full game details');

  const isPastGame = new Date(gameData.date) < new Date();
  const isCreator = user && gameData ? user.id === gameData.created_by : false;
  const canEditOrDelete = (isCreator || isAdmin) && !isPastGame;

  const gameImages = [
    gameData.Picture1,
    gameData.Picture2,
    gameData.Picture3,
    gameData.Picture4,
    gameData.Picture5
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <GameHeader 
            title={gameData.title}
            gameType={gameData.game_type}
            date={gameData.date}
            endDate={gameData.end_date}
            startTime={gameData.start_time}
            endTime={gameData.end_time}
            address={gameData.address}
            zipCode={gameData.zip_code}
            city={gameData.city}
            participantsCount={participants.length}
            maxPlayers={gameData.max_players}
            price={gameData.price || null}
            isRegistered={isRegistered}
            loadingRegistration={loadingRegistration}
            onRegister={() => handleRegistration(isRegistered)}
            onShare={handleShareGame}
            isCreator={isCreator}
            isPastGame={isPastGame}
            isAdmin={isAdmin}
            onEdit={canEditOrDelete ? handleEditGame : undefined}
            onDelete={canEditOrDelete ? handleDeleteGame : undefined}
          />
          
          {gameImages.length > 0 && (
            <div className="my-6">
              <GameImages images={gameImages} title={gameData.title} />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <GameTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
              <GameDetailsContainer
                selectedTab={selectedTab}
                gameData={gameData}
                participants={participants}
                creatorRating={creatorRating}
                navigateToCreatorProfile={navigateToCreatorProfile}
                isCreator={isCreator}
              />
            </div>
            <GameSidebar
              gameData={gameData}
              participantsCount={participants.length}
              isRegistered={isRegistered}
              loadingRegistration={loadingRegistration}
              onRegister={() => handleRegistration(isRegistered)}
              userProfile={userProfile}
              user={user}
            />
          </div>
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
