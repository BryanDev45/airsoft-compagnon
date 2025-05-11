import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameHeader from '@/components/game/GameHeader';
import GameTabs from '@/components/game/GameTabs';
import GameCommentsTab from '@/components/game/GameCommentsTab';
import GameParticipantsTab from '@/components/game/GameParticipantsTab';
import GameDetailsTab from '@/components/game/GameDetailsTab';

const GameDetails = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details');

  useEffect(() => {
    if (id) {
      loadGameData();
      loadParticipants();
    }
  }, [id]);

  const loadGameData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('airsoft_games')
        .select(`*, creator:created_by (
          id,
          username,
          avatar,
          firstname,
          lastname,
          newsletter_subscribed
        )`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setGameData(data as GameData);
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
    if (!gameData) return;

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
          };
        })
      );

      setParticipants(participantsWithProfiles as unknown as GameParticipant[]);

    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des participants."
      });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {gameData && (
            <>
              <GameHeader game={gameData} />
              <GameTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
              <div className="mt-4">
                {selectedTab === 'details' && <GameDetailsTab game={gameData} />}
                {selectedTab === 'participants' && <GameParticipantsTab participants={participants} />}
                {selectedTab === 'comments' && <GameCommentsTab gameId={id} />}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GameDetails;
