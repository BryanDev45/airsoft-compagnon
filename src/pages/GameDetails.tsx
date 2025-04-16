
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Info, 
  Shield, 
  ChevronRight, 
  Share2, 
  Star, 
  MessageSquare, 
  FileText, 
  User,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const GameDetails = () => {
  const { id } = useParams();
  const [participantsOpen, setParticipantsOpen] = useState(false);
  
  // Mock game data (in a real app, would fetch this data based on the ID)
  const game = {
    id: id || '1',
    title: "Opération Blackout",
    date: "15 Mai 2025",
    time: "09:00 - 17:00",
    location: "Terrain CQB Paris, 75012 Paris",
    organizer: {
      name: "Team Ghost",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
    },
    status: "À venir",
    description: "Opération Blackout est une partie CQB tactique se déroulant dans un complexe urbain abandonné. Deux équipes s'affronteront dans une série de missions objectives avec des scénarios variés tout au long de la journée.",
    rules: "- Limite FPS: 350 pour AEG, 400 pour bolt\n- Port de protection oculaire obligatoire\n- Pas de tir à moins de 5m\n- Respect des zones neutres\n- Fair-play exigé",
    requiredEquipment: "- Réplique conforme aux limites FPS\n- Protection oculaire homologuée\n- Batterie et chargeurs\n- Tenue adaptée aux conditions\n- Eau et en-cas",
    capacity: {
      max: 40,
      registered: 28,
    },
    price: "35€",
    images: [
      "https://images.unsplash.com/photo-1624881513483-c1f3760fe7ad?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624881514789-5a8a7a82b9b5?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625008928888-27fde18fd355?q=80&w=2069&auto=format&fit=crop",
    ],
    scenarios: [
      "Capture de drapeaux",
      "Escorte VIP",
      "Défense de position",
      "Extraction d'otages",
    ],
    comments: [
      {
        author: "Airsoft_Pro",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        date: "Il y a 2 jours",
        content: "Ça a l'air super ! J'ai participé à une partie similaire organisée par cette équipe et c'était vraiment bien géré.",
      },
      {
        author: "Sniper_Elite",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        date: "Il y a 3 jours",
        content: "Est-ce que le terrain dispose d'un espace pour les snipers ?",
      },
    ],
    participants: Array.from({ length: 28 }).map((_, idx) => ({
      id: idx + 1,
      name: `Joueur ${idx + 1}`,
      avatar: `https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${20 + (idx % 70)}.jpg`,
      status: idx < 5 ? "online" : "offline",
      team: idx % 2 === 0 ? "Alpha" : "Bravo",
      role: idx % 5 === 0 ? "Organisateur" : "Joueur",
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="bg-airsoft-dark text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Badge variant="outline" className="border-white text-white">Partie CQB</Badge>
                  <Badge className="bg-airsoft-red">{game.status}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{game.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{game.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{game.capacity.registered}/{game.capacity.max} participants</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" className="bg-airsoft-red text-white border-white hover:bg-white hover:text-airsoft-dark">
                  <Share2 size={16} className="mr-2" />
                  Partager
                </Button>
                <Button className="bg-airsoft-red hover:bg-red-700">
                  S'inscrire - {game.price}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden mb-8">
                <img 
                  src={game.images[0]} 
                  alt={game.title} 
                  className="w-full h-[300px] object-cover"
                />
                <div className="bg-white p-2 grid grid-cols-3 gap-2">
                  {game.images.slice(1, 4).map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`${game.title} ${idx + 1}`} 
                      className="h-20 w-full object-cover rounded"
                    />
                  ))}
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
                    <p className="text-gray-700 mb-6">{game.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">Scénarios prévus</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                      {game.scenarios.map((scenario, idx) => (
                        <li key={idx}>{scenario}</li>
                      ))}
                    </ul>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Organisé par</h3>
                      <div className="flex items-center gap-3">
                        <img 
                          src={game.organizer.avatar}
                          alt={game.organizer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{game.organizer.name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star size={14} className="text-yellow-500 mr-1" />
                            <span>{game.organizer.rating} / 5</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Voir le profil <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rules" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Règles de la partie</h2>
                    <div className="whitespace-pre-line text-gray-700">
                      {game.rules}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="equipment" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Équipement requis</h2>
                    <div className="whitespace-pre-line text-gray-700">
                      {game.requiredEquipment}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Commentaires ({game.comments.length})</h2>
                    
                    <div className="space-y-6 mb-6">
                      {game.comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-4">
                          <img 
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-gray-700 mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">Ajouter un commentaire</h3>
                      <textarea 
                        className="w-full min-h-[100px] p-3 border rounded-md mb-3"
                        placeholder="Votre question ou commentaire..."
                      ></textarea>
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
                      <span className="font-semibold">{game.price}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Date</span>
                      <span>{game.date}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Horaires</span>
                      <span>{game.time}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Capacité</span>
                      <span>
                        <span className="font-semibold">{game.capacity.registered}</span>
                        /{game.capacity.max} participants
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Place disponible</span>
                      <span className="font-semibold">{game.capacity.max - game.capacity.registered}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full bg-airsoft-red hover:bg-red-700">
                      S'inscrire à la partie
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Localisation</h3>
                  <div className="bg-gray-200 rounded-lg h-[200px] mb-4 flex items-center justify-center text-gray-500">
                    Carte interactive
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-airsoft-red flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-medium">Terrain CQB Paris</div>
                      <div className="text-gray-600 text-sm">15 rue des Airsofteurs, 75012 Paris</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Obtenir l'itinéraire
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Participants ({game.capacity.registered})</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.participants.slice(0, 8).map((participant, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="relative">
                          <img 
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {participant.status === "online" && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                      <span className="text-sm text-gray-500 font-medium">+{game.capacity.registered - 9}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setParticipantsOpen(true)}
                  >
                    Voir tous les participants
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Participants Dialog */}
      <Dialog open={participantsOpen} onOpenChange={setParticipantsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants ({game.participants.length})</DialogTitle>
            <DialogDescription>
              Voici la liste des joueurs inscrits à cet événement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <Badge className="bg-green-500">Équipe Alpha: {game.participants.filter(p => p.team === "Alpha").length}</Badge>
                <Badge className="bg-blue-500">Équipe Bravo: {game.participants.filter(p => p.team === "Bravo").length}</Badge>
              </div>
              <Badge variant="outline" className="text-gray-700 border-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> En ligne: {game.participants.filter(p => p.status === "online").length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.participants.map((participant, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <img 
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {participant.status === "online" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Badge className={`text-xs mr-2 ${participant.team === "Alpha" ? "bg-green-500" : "bg-blue-500"}`}>
                          Équipe {participant.team}
                        </Badge>
                        {participant.role === "Organisateur" && (
                          <Badge variant="outline" className="text-xs border-airsoft-red text-airsoft-red">
                            Organisateur
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <User size={14} className="mr-1" />
                      Profil
                    </Button>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default GameDetails;
