
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Store, MapPin, User, Users, Search, Plus, MapPinPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserSearchResults from '../components/search/UserSearchResults';
import TeamSearchResults from '../components/search/TeamSearchResults';
import MapComponent from '../components/map/MapComponent';
import { useAuth } from '../hooks/useAuth';

// This component will automatically scroll to top on mount
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};
const Recherche = () => {
  const navigate = useNavigate();
  const {
    user,
    initialLoading
  } = useAuth();
  const [activeTab, setActiveTab] = useState("parties");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCenter, setSearchCenter] = useState<[number, number]>([2.3522, 48.8566]); // Paris coordinates
  
  // Vérifier si l'utilisateur connecté est un admin
  const isAdmin = user?.user_metadata?.Admin || false;

  const handleCreateParty = () => {
    if (user) {
      navigate('/parties/create');
    } else {
      navigate('/login');
    }
  };
  const handleCreateTeam = () => {
    if (user) {
      navigate('/team/create');
    } else {
      navigate('/login');
    }
  };
  
  const handleAddStore = () => {
    // Cette fonction sera implémentée pour permettre aux administrateurs d'ajouter un magasin
    console.log("Ajouter un nouveau magasin");
    // Pour l'instant, nous logguons simplement l'action.
    // Dans une implémentation complète, cela ouvrirait une modal ou naviguerait vers une page de création.
  };
  
  return <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Recherche</h1>
                <p className="text-gray-600">
                  Trouvez des parties, des joueurs, des équipes et des magasins
                </p>
              </div>
              {activeTab === "parties" && (
                <Button onClick={handleCreateParty} className="bg-airsoft-red hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Créer une partie
                </Button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-8">
                <TabsTrigger value="parties" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Parties
                </TabsTrigger>
                <TabsTrigger value="joueurs" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Joueurs
                </TabsTrigger>
                <TabsTrigger value="equipes" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Équipes
                </TabsTrigger>
                <TabsTrigger value="magasins" className="flex items-center gap-1">
                  <Store className="h-4 w-4" />
                  Magasins
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="parties">
                <MapSection />
              </TabsContent>
              
              <TabsContent value="joueurs">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center border rounded-md overflow-hidden mb-6">
                      <Input placeholder="Rechercher un joueur par nom, localisation..." className="border-0 focus-visible:ring-0 flex-1" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      <Button variant="ghost" className="rounded-l-none">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <UserSearchResults searchQuery={searchQuery} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="equipes">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md">
                        <Input placeholder="Rechercher une équipe par nom, région..." className="border-0 focus-visible:ring-0 flex-1" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Button variant="ghost" className="rounded-l-none">
                          <Search className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {!user?.team_id && !initialLoading && <Button onClick={handleCreateTeam} className="bg-airsoft-red hover:bg-red-700 text-white ml-4">
                          <Plus className="h-4 w-4 mr-2" /> Créer une équipe
                        </Button>}
                    </div>
                    
                    <TeamSearchResults searchQuery={searchQuery} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="magasins">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md">
                        <Input placeholder="Rechercher un magasin par nom, ville..." className="border-0 focus-visible:ring-0 flex-1" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Button variant="ghost" className="rounded-l-none">
                          <Search className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {isAdmin && (
                        <Button onClick={handleAddStore} className="bg-airsoft-red hover:bg-red-700 text-white ml-4">
                          <MapPinPlus className="h-4 w-4 mr-2" /> Ajouter un magasin
                        </Button>
                      )}
                    </div>
                    
                    <div className="h-[600px] rounded-lg overflow-hidden">
                      <MapComponent searchCenter={searchCenter} searchRadius={0} filteredEvents={[]} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Recherche;
