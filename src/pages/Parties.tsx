
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Users, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserSearchResults from '../components/search/UserSearchResults';
import TeamSearchResults from '../components/search/TeamSearchResults';

const Recherche = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("parties");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const authState = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authState === 'true');
  }, []);

  const handleCreateParty = () => {
    if (isAuthenticated) {
      navigate('/parties/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Recherche</h1>
                <p className="text-gray-600">
                  Trouvez des parties, des joueurs et des équipes
                </p>
              </div>
              {activeTab === "parties" && (
                <Button 
                  onClick={handleCreateParty} 
                  className="bg-airsoft-red hover:bg-red-700 text-white"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Créer une partie
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
              </TabsList>
              
              <TabsContent value="parties">
                <MapSection />
              </TabsContent>
              
              <TabsContent value="joueurs">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center border rounded-md overflow-hidden mb-6">
                      <Input 
                        placeholder="Rechercher un joueur par nom, localisation..." 
                        className="border-0 focus-visible:ring-0 flex-1" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
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
                    <div className="flex items-center border rounded-md overflow-hidden mb-6">
                      <Input 
                        placeholder="Rechercher une équipe par nom, région..." 
                        className="border-0 focus-visible:ring-0 flex-1" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button variant="ghost" className="rounded-l-none">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <TeamSearchResults searchQuery={searchQuery} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recherche;
