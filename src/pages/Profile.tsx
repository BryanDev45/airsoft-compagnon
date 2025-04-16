
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, MapPin, Calendar, Edit, Save, Settings, LogOut, Shield, Trophy, Clock, Plus, Upload, List, Zap, Tag, FileText, Users, Map, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [addingEquipment, setAddingEquipment] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  
  // Mock user data
  const user = {
    username: "AirsoftMaster",
    email: "airsoft.master@example.com",
    firstname: "Jean",
    lastname: "Dupont",
    age: "28",
    team: "Les Invincibles",
    location: "Paris, France",
    joinDate: "Avril 2023",
    bio: "Passionné d'airsoft depuis 5 ans, j'organise régulièrement des parties sur Paris et sa région.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    games: [
      { 
        id: 1, 
        title: "Opération Blackout", 
        date: "15/05/2025", 
        role: "Participant", 
        status: "À venir",
        location: "Terrain Battlezone, Paris",
        description: "Une partie nocturne avec objectifs tactiques",
        participants: 24,
        duration: "8h",
        gameType: "Milsim"
      },
      { 
        id: 2, 
        title: "CQB Summer Challenge", 
        date: "02/04/2025", 
        role: "Participant", 
        status: "À venir",
        location: "Hangar 34, Marseille",
        description: "Une journée CQB intense avec plusieurs scénarios",
        participants: 36,
        duration: "6h",
        gameType: "CQB"
      },
      { 
        id: 3, 
        title: "Milsim Weekend", 
        date: "10/03/2025", 
        role: "Organisateur", 
        status: "Terminé",
        location: "Forêt de Fontainebleau",
        description: "Week-end simulation militaire avec campement",
        participants: 80,
        duration: "48h",
        gameType: "Milsim"
      },
    ],
    allGames: [
      // Additional past games
      { 
        id: 4, 
        title: "Opération Eagle", 
        date: "15/02/2025", 
        role: "Participant", 
        status: "Terminé",
        location: "Terrain Delta Force, Lyon",
        description: "Scénario tactique en équipes",
        participants: 30,
        duration: "5h",
        gameType: "Woodland"
      },
      { 
        id: 5, 
        title: "Urban Warfare", 
        date: "05/01/2025", 
        role: "Participant", 
        status: "Terminé",
        location: "Zone urbaine abandonnée, Lille",
        description: "Simulation de combat urbain",
        participants: 40,
        duration: "7h",
        gameType: "CQB"
      },
      { 
        id: 6, 
        title: "Winter Challenge", 
        date: "20/12/2024", 
        role: "Organisateur", 
        status: "Terminé",
        location: "Forêt des Ardennes",
        description: "Challenge hivernal avec objectifs et missions",
        participants: 60,
        duration: "10h",
        gameType: "Woodland"
      },
    ],
    stats: {
      gamesPlayed: 42,
      gamesOrganized: 7,
      reputation: 4.8,
      level: "Confirmé",
      winRate: "68%",
      objectivesCompleted: 127,
      flagsCaptured: 53,
      vipProtection: 12,
      hostageRescue: 8,
      bombDefusal: 15,
      timePlayed: "312h",
      favoriteRole: "Assaut",
      preferredGameType: "Milsim",
      teamwork: "Excellent",
      tacticalAwareness: "Élevé",
      accuracy: "76%"
    },
    equipment: [
      { 
        id: 1, 
        type: "Fusil d'assaut", 
        brand: "G&G", 
        power: "330 FPS", 
        description: "G&G CM16 Raider 2.0 avec red dot et grip vertical",
        image: "https://randomuser.me/api/portraits/men/44.jpg" // placeholder image
      }
    ]
  };

  // List of equipment types for the dropdown
  const equipmentTypes = [
    "DMR", 
    "SMG", 
    "PA", 
    "Mitrailleuse", 
    "Fusil d'assaut", 
    "Fusil de précision", 
    "Fusil à pompe"
  ];

  // Function to handle adding new equipment
  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the new equipment
    setAddingEquipment(false);
    toast({
      title: "Équipement ajouté",
      description: "Votre nouvel équipement a été ajouté avec succès",
    });
  };

  // Function to handle viewing game details
  const handleViewGameDetails = (game: any) => {
    setSelectedGame(game);
    setShowGameDialog(true);
  };

  // Function to handle viewing all games
  const handleViewAllGames = () => {
    setShowAllGamesDialog(true);
  };

  // Function to handle navigation to game page
  const handleNavigateToGame = (gameId: number) => {
    setShowGameDialog(false);
    setShowAllGamesDialog(false);
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-airsoft-dark text-white p-6 relative">
              <div className="absolute right-6 top-6 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {editing ? "Sauvegarder" : "Modifier"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                  {editing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-airsoft-red hover:bg-red-700"
                    >
                      <Edit size={14} />
                    </Button>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <div className="flex items-center gap-1 text-sm text-gray-200">
                    <Calendar size={14} />
                    <span>Membre depuis {user.joinDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-airsoft-red border-none">
                      <Trophy size={14} className="mr-1" /> {user.stats.level}
                    </Badge>
                    <Badge variant="outline" className="text-white border-white">
                      <Clock size={14} className="mr-1" /> {user.stats.gamesPlayed} parties
                    </Badge>
                    <Badge variant="outline" className="text-white border-white">
                      <Shield size={14} className="mr-1" /> {user.stats.gamesOrganized} organisées
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="games">Mes parties</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="equipment">Équipement</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>
                          Informations visibles aux autres joueurs et organisateurs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bio</label>
                          {editing ? (
                            <textarea 
                              className="w-full min-h-[100px] p-3 border rounded-md"
                              defaultValue={user.bio}
                            ></textarea>
                          ) : (
                            <p className="text-gray-700">{user.bio}</p>
                          )}
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <User size={16} />
                              Nom d'utilisateur
                            </label>
                            {editing ? (
                              <Input defaultValue={user.username} />
                            ) : (
                              <p className="text-gray-700">{user.username}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Mail size={16} />
                              Email
                            </label>
                            {editing ? (
                              <Input defaultValue={user.email} />
                            ) : (
                              <p className="text-gray-700">{user.email}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <User size={16} />
                              Nom
                            </label>
                            {editing ? (
                              <Input defaultValue={user.lastname} />
                            ) : (
                              <p className="text-gray-700">{user.lastname}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <User size={16} />
                              Prénom
                            </label>
                            {editing ? (
                              <Input defaultValue={user.firstname} />
                            ) : (
                              <p className="text-gray-700">{user.firstname}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Calendar size={16} />
                              Âge
                            </label>
                            {editing ? (
                              <Input defaultValue={user.age} />
                            ) : (
                              <p className="text-gray-700">{user.age} ans</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Users size={16} />
                              Équipe
                            </label>
                            {editing ? (
                              <Input defaultValue={user.team} />
                            ) : (
                              <p className="text-gray-700">{user.team}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <MapPin size={16} />
                              Localisation
                            </label>
                            {editing ? (
                              <Input defaultValue={user.location} />
                            ) : (
                              <p className="text-gray-700">{user.location}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      {editing && (
                        <CardFooter>
                          <Button className="bg-airsoft-red hover:bg-red-700" onClick={() => setEditing(false)}>
                            <Save size={16} className="mr-2" />
                            Enregistrer les modifications
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistiques</CardTitle>
                        <CardDescription>
                          Vos performances et participation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Parties jouées</span>
                            <span className="font-semibold">{user.stats.gamesPlayed}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Parties organisées</span>
                            <span className="font-semibold">{user.stats.gamesOrganized}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">Réputation</span>
                            <span className="font-semibold flex items-center">
                              {user.stats.reputation}
                              <svg className="w-4 h-4 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Niveau</span>
                            <Badge className="bg-airsoft-red">{user.stats.level}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="games">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mes parties</CardTitle>
                      <CardDescription>
                        Historique et parties à venir
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.games.length === 0 ? (
                          <p className="text-center text-gray-500 py-6">
                            Vous n'avez pas encore participé à des parties.
                          </p>
                        ) : (
                          user.games.map(game => (
                            <div 
                              key={game.id} 
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center"
                            >
                              <div>
                                <h3 className="font-semibold">{game.title}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} /> {game.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User size={14} /> {game.role}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  className={
                                    game.status === "À venir" 
                                      ? "bg-blue-500" 
                                      : game.status === "Terminé" 
                                      ? "bg-gray-500" 
                                      : "bg-green-500"
                                  }
                                >
                                  {game.status}
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                                  onClick={() => handleViewGameDetails(game)}
                                >
                                  Détails
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="bg-airsoft-red hover:bg-red-700"
                        onClick={handleViewAllGames}
                      >
                        Voir toutes mes parties
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stats">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques détaillées</CardTitle>
                      <CardDescription>
                        Analyse complète de votre parcours d'airsofteur
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Performance</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Taux de victoire</p>
                              <p className="font-medium">{user.stats.winRate}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Précision</p>
                              <p className="font-medium">{user.stats.accuracy}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Temps de jeu</p>
                              <p className="font-medium">{user.stats.timePlayed}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Rôle préféré</p>
                              <p className="font-medium">{user.stats.favoriteRole}</p>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Compétences</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Travail d'équipe</p>
                              <p className="font-medium">{user.stats.teamwork}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Conscience tactique</p>
                              <p className="font-medium">{user.stats.tacticalAwareness}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Objectifs</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Objectifs complétés</p>
                              <p className="font-medium">{user.stats.objectivesCompleted}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Drapeaux capturés</p>
                              <p className="font-medium">{user.stats.flagsCaptured}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Protections VIP</p>
                              <p className="font-medium">{user.stats.vipProtection}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Sauvetages d'otages</p>
                              <p className="font-medium">{user.stats.hostageRescue}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Désamorçages de bombes</p>
                              <p className="font-medium">{user.stats.bombDefusal}</p>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-lg border-b pb-2 mt-6">Préférences</h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Type de jeu préféré</p>
                              <p className="font-medium">{user.stats.preferredGameType}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="equipment">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Mon équipement</CardTitle>
                        <CardDescription>
                          Répliques et matériel
                        </CardDescription>
                      </div>
                      <Button 
                        className="bg-airsoft-red hover:bg-red-700"
                        onClick={() => setAddingEquipment(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un équipement
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {addingEquipment ? (
                        <div className="border rounded-lg p-4 mb-4">
                          <h3 className="font-semibold mb-4">Nouvel équipement</h3>
                          <form onSubmit={handleAddEquipment} className="space-y-4">
                            <div className="flex flex-col items-center mb-4">
                              <div className="bg-gray-200 w-32 h-32 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                                <Upload className="text-gray-400" size={32} />
                              </div>
                              <Label htmlFor="photo-upload" className="cursor-pointer text-sm text-airsoft-red">
                                Ajouter une photo
                              </Label>
                              <input id="photo-upload" type="file" className="hidden" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="type" className="flex items-center gap-1">
                                  <List size={16} /> Type d'équipement
                                </Label>
                                <Select>
                                  <SelectTrigger id="type">
                                    <SelectValue placeholder="Sélectionner un type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {equipmentTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="power" className="flex items-center gap-1">
                                  <Zap size={16} /> Puissance (FPS)
                                </Label>
                                <Input id="power" placeholder="Ex: 350 FPS" />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="brand" className="flex items-center gap-1">
                                  <Tag size={16} /> Marque
                                </Label>
                                <Input id="brand" placeholder="Ex: G&G, Tokyo Marui..." />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description" className="flex items-center gap-1">
                                  <FileText size={16} /> Description
                                </Label>
                                <Input id="description" placeholder="Décrivez votre équipement..." />
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setAddingEquipment(false)}
                              >
                                Annuler
                              </Button>
                              <Button 
                                type="submit" 
                                className="bg-airsoft-red hover:bg-red-700"
                              >
                                Enregistrer
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : user.equipment.length > 0 ? (
                        <div className="space-y-4">
                          {user.equipment.map((item) => (
                            <div 
                              key={item.id} 
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4"
                            >
                              <div className="flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.description} 
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between mb-2">
                                  <h3 className="font-semibold">{item.type}</h3>
                                  <Badge className="bg-airsoft-red">{item.power}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Marque:</span> {item.brand}
                                </p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                                >
                                  <Edit size={14} className="mr-1" /> Modifier
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-12 text-gray-500">
                          Vous n'avez pas encore ajouté d'équipement.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Game Details Dialog */}
      <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedGame?.title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Détails de la partie
            </DialogDescription>
          </DialogHeader>
          
          {selectedGame && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge 
                  className={
                    selectedGame.status === "À venir" 
                      ? "bg-blue-500" 
                      : selectedGame.status === "Terminé" 
                      ? "bg-gray-500" 
                      : "bg-green-500"
                  }
                >
                  {selectedGame.status}
                </Badge>
                <span className="text-sm font-medium">{selectedGame.role}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-airsoft-red" />
                  <span>{selectedGame.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-airsoft-red" />
                  <span>Durée: {selectedGame.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-airsoft-red" />
                  <span>{selectedGame.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-airsoft-red" />
                  <span>{selectedGame.participants} participants</span>
                </div>
              </div>
              
              <div className="mt-2">
                <h4 className="font-medium text-sm mb-1">Description:</h4>
                <p className="text-sm text-gray-600">{selectedGame.description}</p>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-airsoft-red hover:bg-red-700"
                  onClick={() => handleNavigateToGame(selectedGame.id)}
                >
                  Voir la page complète
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* All Games Dialog */}
      <Dialog open={showAllGamesDialog} onOpenChange={setShowAllGamesDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Toutes mes parties</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Historique complet de vos participations
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-96 overflow-y-auto pr-2">
            <div className="space-y-4">
              {[...user.games, ...user.allGames].map(game => (
                <div 
                  key={game.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{game.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {game.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} /> {game.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Map size={14} /> {game.location.split(',')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge 
                        className={
                          game.status === "À venir" 
                            ? "bg-blue-500" 
                            : game.status === "Terminé" 
                            ? "bg-gray-500" 
                            : "bg-green-500"
                        }
                      >
                        {game.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                        onClick={() => {
                          setShowAllGamesDialog(false);
                          handleViewGameDetails(game);
                        }}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
