
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
import { useGameData } from '@/hooks/game/useGameData';
import { useGameActions } from '@/hooks/game/useGameActions';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('details');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    gameData,
    participants,
    loading,
    isRegistered,
    creatorRating,
    loadParticipants
  } = useGameData(id);

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
  const canEditOrDelete = (isCreator || isAdmin) && !isPastGame;

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
                onRegister={() => handleRegistration(isRegistered)}
                onShare={handleShareGame}
                isCreator={isCreator}
                isPastGame={isPastGame}
                isAdmin={isAdmin}
                onEdit={canEditOrDelete ? handleEditGame : undefined}
                onDelete={canEditOrDelete ? handleDeleteGame : undefined}
              />
              
              <div className="my-6">
                <GameImages images={gameImages} title={gameData.title} />
              </div>
              
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
                />
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
