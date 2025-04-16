
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Settings, LogOut, Shield, Trophy, Clock } from 'lucide-react';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  
  // Mock user data
  const user = {
    username: "AirsoftMaster",
    email: "airsoft.master@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    joinDate: "Avril 2023",
    bio: "Passionné d'airsoft depuis 5 ans, j'organise régulièrement des parties sur Paris et sa région.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    games: [
      { id: 1, title: "Opération Blackout", date: "15/05/2025", role: "Participant", status: "À venir" },
      { id: 2, title: "CQB Summer Challenge", date: "02/04/2025", role: "Participant", status: "À venir" },
      { id: 3, title: "Milsim Weekend", date: "10/03/2025", role: "Organisateur", status: "Terminé" },
    ],
    stats: {
      gamesPlayed: 42,
      gamesOrganized: 7,
      reputation: 4.8,
      level: "Confirmé"
    }
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
                  className="text-white border-white hover:bg-white/20"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {editing ? "Sauvegarder" : "Modifier"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white/20"
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
                              <Phone size={16} />
                              Téléphone
                            </label>
                            {editing ? (
                              <Input defaultValue={user.phone} />
                            ) : (
                              <p className="text-gray-700">{user.phone}</p>
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
                                <Button variant="outline" size="sm">Détails</Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-airsoft-red hover:bg-red-700">
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
                      <p className="text-center py-12 text-gray-500">
                        Statistiques avancées en cours de développement
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="equipment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mon équipement</CardTitle>
                      <CardDescription>
                        Répliques et matériel
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center py-12 text-gray-500">
                        Section équipement en cours de développement
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
