
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Search, Settings, Loader2 } from 'lucide-react';
import { useGlossaryTerms, GlossaryTerm } from '@/hooks/useGlossary';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import GlossaryAdminDialog from './GlossaryAdminDialog';

const AirsoftGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: glossaryItems, isLoading, error } = useGlossaryTerms();
  const { user } = useAuth();
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!glossaryItems) return [];
    return glossaryItems.filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [glossaryItems, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-airsoft-red" />
            Glossaire Airsoft
          </CardTitle>
          {user?.Admin && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsAdminDialogOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Gérer le glossaire
              </Button>
              <GlossaryAdminDialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen} />
            </>
          )}
        </div>
        <CardDescription>
          Recherchez des termes et définitions du monde de l'airsoft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un terme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">Erreur lors du chargement du glossaire.</div>
            ) : (
              <div className="space-y-4">
                {filteredItems.length > 0 ? filteredItems.map((item: GlossaryTerm) => (
                  <div key={item.id} className="space-y-2">
                    <h3 className="font-semibold text-lg">{item.term}</h3>
                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted-foreground py-4">Aucun terme trouvé.</div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirsoftGlossary;
