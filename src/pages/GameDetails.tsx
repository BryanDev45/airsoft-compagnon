import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, Info, Shield, ChevronRight, Share2, Star, MessageSquare, FileText, User, X, Check, Link as LinkIcon, Copy, Crosshair, Eye, Award, AlertCircle, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import LocationMap from '../components/map/LocationMap';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@/types/profile";

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Type definitions to handle the query results
interface GameData {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  city: string;
  zip_code: string;
  max_players: number;
  price: number | null;
  created_by: string;
  game_type: string;
  rules: string;
  latitude: number | null;
  longitude: number | null;
  has_toilets: boolean | null;
  has_parking: boolean | null;
  has_equipment_rental: boolean | null;
  eye_protection_required: boolean | null;
  full_face_protection_required: boolean | null;
  is_private: boolean | null;
  manual_validation: boolean | null;
  aeg_fps_min: number | null;
  aeg_fps_max: number | null;
  dmr_fps_max: number | null;
  creator?: Profile | null;
}
interface GameParticipant {
  id: string;
  user_id: string;
  game_id: string;
  role: string;
  status: string;
  created_at: string | null;
  profile?: Profile | null;
}
interface GameImage {
  id: string;
  game_id: string;
  image_url: string;
}
const GameDetails = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session && id) {
        // Check if user is registered for this game
        const {
          data: participation,
          error
        } = await supabase.from('game_participants').select('*').eq('game_id', id).eq('user_id', session.user.id).single();
        if (participation && !error) {
          setIsRegistered(true);
        }
      }
    };
    checkAuth();
    window.scrollTo(0, 0);
  }, [id]);

  // Query for game details and creator profile separately
  const {
    data: gameData,
    isLoading: isLoadingGame,
    error: gameError,
    refetch: refetchGame
  } = useQuery({
    queryKey: ['gameDetails', id],
    queryFn: async () => {
      if (!id) throw new Error('Game ID is required');
      const {
        data: game,
        error: gameError
      } = await supabase.from('airsoft_games').select('*').eq('id', id).single();
      if (gameError) throw gameError;

      // Fetch creator profile separately
      let creator = null;
      if (game) {
        const {
          data: creatorData,
          error: creatorError
        } = await supabase.from('profiles').select('*').eq('id', game.created_by).single();
        if (!creatorError && creatorData) {
          creator = creatorData;
        }
      }
      return {
        ...game,
        creator
      } as GameData;
    }
  });
  const {
    data: gameImages,
    isLoading: isLoadingImages
  } = useQuery({
    queryKey: ['gameImages', id],
    queryFn: async () => {
      if (!id) throw new Error('Game ID is required');
      const {
        data,
        error
      } = await supabase.from('airsoft_game_images').select('*').eq('game_id', id);
      if (error) throw error;
      return data as GameImage[] || [];
    },
    enabled: !!gameData
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
      const {
        data: participantsData,
        error: participantsError
      } = await supabase.from('game_participants').select('*').eq('game_id', id);
      if (participantsError) throw participantsError;

      // Then get their profiles
      const participantsWithProfiles = await Promise.all((participantsData || []).map(async participant => {
        if (!participant.user_id) return {
          ...participant,
          profile: null
        };
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('profiles').select('*').eq('id', participant.user_id).single();
        return {
          ...participant,
          profile: profileError ? null : profileData
        };
      }));
      return participantsWithProfiles as GameParticipant[];
    },
    enabled: !!gameData
  });
  const handleShareGame = () => {
    setShareDialogOpen(true);
  };
  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copié !",
        description: message
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien"
      });
    });
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
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session && id) {
      const {
        error
      } = await supabase.from('game_participants').insert({
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
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session && id) {
      const {
        error
      } = await supabase.from('game_participants').delete().eq('game_id', id).eq('user_id', session.user.id);
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
  if (isLoadingGame) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Chargement des détails de la partie...</p>
          </div>
        </main>
        <Footer />
      </div>;
  }
  if (gameError || !gameData) {
    return <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold mb-4">Partie non trouvée</h1>
              <p className="mb-6 text-gray-600">
                Nous n'avons pas pu trouver les détails de cette partie. Elle a peut-être été supprimée ou l'identifiant est incorrect.
              </p>
              <Button onClick={() => navigate('/parties')}>Retour à la recherche de parties</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>;
  }

  // Format date from ISO to readable format
  const formattedDate = gameData.date ? format(new Date(gameData.date), 'dd MMMM yyyy', {
    locale: fr
  }) : '';

  // Format time
  const formatTime = timeString => {
    if (!timeString) return '';
    // Handle PostgreSQL time format (HH:MM:SS)
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  const formattedTimeRange = `${formatTime(gameData.start_time)} - ${formatTime(gameData.end_time)}`;

  // Prepare default images if no real images
  const defaultImages = ["https://images.unsplash.com/photo-1624881513483-c1f3760fe7ad?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1624881514789-5a8a7a82b9b0?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1625008928888-27fde18fd355?q=80&w=2069&auto=format&fit=crop"];
  const gameImages1 = gameImages?.length > 0 ? gameImages.map(img => img.image_url) : defaultImages;

  // Default scenarios if not available
  const scenarios = ["Capture de drapeaux", "Escorte VIP", "Défense de position", "Extraction d'otages"];

  // Comments will be static for now as they're not in database yet
  const comments = [{
    author: "Airsoft_Pro",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    date: "Il y a 2 jours",
    content: "Ça a l'air super ! J'ai participé à une partie similaire organisée par cette équipe et c'était vraiment bien géré."
  }, {
    author: "Sniper_Elite",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    date: "Il y a 3 jours",
    content: "Est-ce que le terrain dispose d'un espace pour les snipers ?"
  }];

  // Prepare coordinates for map
  const coordinates: [number, number] = gameData.longitude && gameData.latitude ? [gameData.longitude, gameData.latitude] : [2.3522, 48.8566];

  // Helper function to get initials from username
  const getInitials = (username: string | null): string => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };
  return <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="bg-airsoft-dark text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Badge variant="outline" className="border-white text-white">
                    {gameData.game_type === "dominicale" ? "Partie Dominicale" : "Opération"}
                  </Badge>
                  <Badge className="bg-airsoft-red">
                    {new Date(gameData.date) > new Date() ? "À venir" : "Terminé"}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{gameData.title}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formattedTimeRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{gameData.address}, {gameData.zip_code} {gameData.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{participants?.length || 0}/{gameData.max_players} participants</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" className="bg-airsoft-red text-white border-white hover:bg-white hover:text-airsoft-dark" onClick={handleShareGame}>
                  <Share2 size={16} className="mr-2" />
                  Partager
                </Button>
                <Button className={`${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-airsoft-red hover:bg-red-700'}`} onClick={handleRegister} disabled={loadingRegistration || gameData.max_players <= (participants?.length || 0) && !isRegistered}>
                  {loadingRegistration ? <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div> : isRegistered ? <>
                      <Check size={16} className="mr-2" />
                      Inscrit
                    </> : <>
                      S'inscrire - {gameData.price}€
                    </>}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden mb-8">
                <img src={gameImages1[0]} alt={gameData.title} className="w-full h-[300px] object-cover" />
                <div className="bg-white p-2 grid grid-cols-3 gap-2">
                  {gameImages1.slice(1, 4).map((img, idx) => <img key={idx} src={img} alt={`${gameData.title} ${idx + 1}`} className="h-20 w-full object-cover rounded" />)}
                </div>
              </div>
              
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
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 mb-6">{gameData.description}</p>
                    
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      {scenarios.map((scenario, idx) => (
                        <li key={idx}>{scenario}</li>
                      ))}
                    </ul>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Organisé par</h3>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={gameData.creator?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt={gameData.creator?.username || "Organisateur"} />
                          <AvatarFallback>{getInitials(gameData.creator?.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{gameData.creator?.username || "Organisateur"}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star size={14} className="text-yellow-500 mr-1" />
                            <span>4.8 / 5</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate(`/profile/${gameData.creator?.username}`)}>
                          Voir le profil <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rules" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Règles de la partie</h2>
                    <div className="whitespace-pre-line text-gray-700">
                      {gameData.rules}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="equipment" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Équipement et limitations</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Crosshair className="text-airsoft-red mr-2" size={20} />
                          Limites de puissance
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center justify-between">
                            <span>AEG / GBB :</span>
                            <Badge className="bg-amber-500">{gameData.aeg_fps_min} - {gameData.aeg_fps_max} FPS</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Sniper / DMR :</span>
                            <Badge className="bg-amber-500">Max {gameData.dmr_fps_max} FPS</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Eye className="text-airsoft-red mr-2" size={20} />
                          Protection
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center justify-between">
                            <span>Protection oculaire :</span>
                            <Badge className={gameData.eye_protection_required ? "bg-green-500" : "bg-red-500"}>
                              {gameData.eye_protection_required ? "Obligatoire" : "Facultative"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-left">Protection intégrale :</span>
                            <Badge className={gameData.full_face_protection_required ? "bg-green-500" : "bg-amber-500"}>
                              {gameData.full_face_protection_required ? "Obligatoire" : "Recommandée"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <AlertCircle className="text-airsoft-red mr-2" size={20} />
                          Services du terrain
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center justify-between">
                            <span>Toilettes :</span>
                            <Badge className={gameData.has_toilets ? "bg-green-500" : "bg-red-500"}>
                              {gameData.has_toilets ? "Disponibles" : "Non disponibles"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Parking :</span>
                            <Badge className={gameData.has_parking ? "bg-green-500" : "bg-red-500"}>
                              {gameData.has_parking ? "Disponible" : "Non disponible"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-left">Location de matériel:</span>
                            <Badge className={gameData.has_equipment_rental ? "bg-green-500" : "bg-red-500"}>
                              {gameData.has_equipment_rental ? "Disponible" : "Non disponible"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Lock className="text-airsoft-red mr-2" size={20} />
                          Paramètres de participation
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center justify-between">
                            <span>Validation :</span>
                            <Badge className={gameData.manual_validation ? "bg-amber-500" : "bg-green-500"}>
                              {gameData.manual_validation ? "Requise" : "Automatique"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Partie privée :</span>
                            <Badge className={gameData.is_private ? "bg-amber-500" : "bg-green-500"}>
                              {gameData.is_private ? "Oui" : "Non"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Commentaires ({comments.length})</h2>
                    
                    <div className="space-y-6 mb-6">
                      {comments.map((comment, idx) => <div key={idx} className="flex gap-4">
                          <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-gray-700 mt-1">{comment.content}</p>
                          </div>
                        </div>)}
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">Ajouter un commentaire</h3>
                      <textarea className="w-full min-h-[100px] p-3 border rounded-md mb-3" placeholder="Votre question ou commentaire..."></textarea>
                      <Button className="bg-airsoft-red hover:bg-red-700">
                        <MessageSquare size={16} className="mr-2" />
                        Poster un commentaire
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Informations</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-semibold">{gameData.price}€</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Date</span>
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Horaires</span>
                      <span>{formattedTimeRange}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Capacité</span>
                      <span>
                        <span className="font-semibold">{participants?.length || 0}</span>
                        /{gameData.max_players} participants
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Place disponible</span>
                      <span className="font-semibold">{gameData.max_players - (participants?.length || 0)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className={`w-full ${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-airsoft-red hover:bg-red-700'}`} onClick={handleRegister} disabled={loadingRegistration || gameData.max_players <= (participants?.length || 0) && !isRegistered}>
                      {loadingRegistration ? <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div> : isRegistered ? <>
                          <Check size={16} className="mr-2" />
                          Inscrit - Gérer mon inscription
                        </> : <>
                          S'inscrire à la partie
                        </>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Localisation</h3>
                  <div className="bg-gray-200 rounded-lg h-[200px] mb-4">
                    <LocationMap location={`${gameData.address}, ${gameData.zip_code} ${gameData.city}`} coordinates={coordinates} />
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-airsoft-red flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium">{gameData.address}</div>
                      <div className="text-gray-600 text-sm">{gameData.zip_code} {gameData.city}</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => {
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gameData.address}, ${gameData.zip_code} ${gameData.city}`)}`, '_blank');
                }}>
                    <MapPin size={16} className="mr-2" />
                    Obtenir l'itinéraire
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Participants ({participants?.length || 0})</h3>
                  
                  {isLoadingParticipants ? <div className="flex justify-center py-4">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    </div> : participants?.length > 0 ? <>
                      <div className="flex flex-wrap gap-2">
                        {participants.slice(0, 8).map((participant, idx) => <div key={idx} className="flex flex-col items-center">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={participant.profile?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} alt={participant.profile?.username || "Participant"} className="w-10 h-10 object-cover" />
                                <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>)}
                        
                        {participants.length > 8 && <>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                              <User size={18} className="text-gray-500" />
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                              <span className="text-sm text-gray-500 font-medium">+{participants.length - 9}</span>
                            </div>
                          </>}
                      </div>
                      <Button variant="outline" className="w-full mt-4" onClick={() => setParticipantsOpen(true)}>
                        Voir tous les participants
                      </Button>
                    </> : <div className="text-center py-6 text-gray-500">
                      <User size={48} className="mx-auto mb-2 opacity-30" />
                      <p>Aucun participant inscrit pour le moment</p>
                    </div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={participantsOpen} onOpenChange={setParticipantsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants ({participants?.length || 0})</DialogTitle>
            <DialogDescription>
              Voici la liste des joueurs inscrits à cet événement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="space-y-4">
              {isLoadingParticipants ? <div className="flex justify-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map((participant, idx) => <div key={idx} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                      <Avatar>
                        <AvatarImage src={participant.profile?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} alt={participant.profile?.username || "Participant"} className="w-12 h-12 object-cover" />
                        <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="font-medium">{participant.profile?.username || "Participant"}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          {participant.role === "Organisateur" && <Badge variant="outline" className="text-xs border-airsoft-red text-airsoft-red">
                              Organisateur
                            </Badge>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={() => navigate(`/profile/${participant.profile?.username}`)}>
                        <User size={14} className="mr-1" />
                        Profil
                      </Button>
                    </div>)}
                </div>}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">
                <X size={14} className="mr-2" /> Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager cette partie</DialogTitle>
            <DialogDescription>
              Partagez cette partie d'airsoft avec vos amis via le lien ou les réseaux sociaux.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="link" className="sr-only">Lien</label>
                <input id="link" className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full" readOnly value={window.location.href} />
              </div>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(window.location.href, "Lien copié dans le presse-papier")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou partager via</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(window.location.href, "Lien pour Facebook copié")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-blue-600 h-5 w-5">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(window.location.href, "Lien pour Twitter copié")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400 h-5 w-5">
                  <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 01 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(window.location.href, "Lien pour WhatsApp copié")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-green-500 h-5 w-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" onClick={() => {
              const mailSubject = encodeURIComponent(`Partie d'airsoft: ${gameData.title}`);
              const mailBody = encodeURIComponent(`Salut,\n\nJ'ai trouvé cette partie d'airsoft qui pourrait t'intéresser:\n\n${gameData.title}\nDate: ${formattedDate}\nLieu: ${gameData.address}, ${gameData.city}\n\nTu peux voir les détails ici: ${window.location.href}`);
              window.location.href = `mailto:?subject=${mailSubject}&body=${mailBody}`;
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-gray-500 h-5 w-5">
                  <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                </svg>
              </Button>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant="secondary">
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={registrationDialogOpen} onOpenChange={setRegistrationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer votre inscription</DialogTitle>
            <DialogDescription>
              Vous êtes déjà inscrit à cette partie. Que souhaitez-vous faire ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              <strong>Partie :</strong> {gameData.title}<br />
              <strong>Date :</strong> {formattedDate}<br />
              <strong>Heure :</strong> {formattedTimeRange}<br />
              <strong>Lieu :</strong> {gameData.address}, {gameData.zip_code} {gameData.city}
            </p>
            
            <div className="flex flex-col gap-4">
              <Button variant="destructive" onClick={handleUnregister} disabled={loadingRegistration}>
                {loadingRegistration ? <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div> : <X size={16} className="mr-2" />}
                Se désinscrire
              </Button>
              <Button variant="outline" onClick={() => setRegistrationDialogOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default GameDetails;
