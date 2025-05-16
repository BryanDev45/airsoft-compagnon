
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface MapEvent {
  id: string; // Changed from number to string to match Supabase's UUID format
  title: string;
  date: string;
  location: string;
  department: string;
  type: string;
  country: string;
  lat: number;
  lng: number;
  maxPlayers?: number;
  price?: number;
  image?: string;
}

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MapEvent[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Construction de la requête de base - ne filtre pas par is_private à ce stade
        let query = supabase
          .from('airsoft_games')
          .select(`
            id, 
            title, 
            date, 
            address, 
            city, 
            zip_code, 
            game_type,
            max_players,
            price,
            latitude,
            longitude,
            created_at,
            created_by,
            is_private,
            Picture1,
            Picture2,
            Picture3,
            Picture4,
            Picture5
          `)
          .gte('date', today) // Filtrer pour n'afficher que les parties à venir ou du jour même
          .order('date', { ascending: true });
        
        // On ne filtre les parties privées que dans tous les cas
        // Modification: Retirer la condition sur user pour toujours filtrer les parties privées pour les utilisateurs non connectés
        query = query.eq('is_private', false);
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }

        // Transformation des données pour correspondre au format attendu par les composants existants
        const formattedEvents = data?.map(game => {
          // Format date as DD/MM/YYYY for display
          const gameDate = new Date(game.date);
          const formattedDate = `${gameDate.getDate().toString().padStart(2, '0')}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getFullYear()}`;
          
          // Get the first available image, or use default
          const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
          
          return {
            id: game.id,
            title: game.title,
            date: formattedDate,
            location: game.city,
            department: game.zip_code?.substring(0, 2) || "",
            type: game.game_type || "woodland",
            country: "france", // Valeur par défaut, peut être étendue plus tard
            lat: game.latitude ? parseFloat(String(game.latitude)) : 48.8566,
            lng: game.longitude ? parseFloat(String(game.longitude)) : 2.3522,
            maxPlayers: game.max_players,
            price: game.price,
            image: gameImage
          };
        }) || [];
        
        console.log("Formatted events:", formattedEvents);
        setEvents(formattedEvents);
      } catch (error: any) {
        console.error("Erreur lors du chargement des parties:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les parties",
          variant: "destructive" 
        });
        
        // En cas d'erreur, on définit un tableau vide pour éviter le chargement infini
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [toast, user]);

  return { loading, events };
}
