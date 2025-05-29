
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export interface MapEvent {
  id: string;
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

// Function to geocode an address using OpenStreetMap Nominatim API
const geocodeAddress = async (address: string, zipCode: string, city: string): Promise<[number, number] | null> => {
  try {
    const fullAddress = `${address}, ${zipCode} ${city}, France`;
    console.log('Geocoding address:', fullAddress);
    
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
    
    const response = await fetch(geocodingUrl, {
      headers: {
        'User-Agent': 'AirsoftCommunityApp/1.0'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      console.log('Geocoding successful:', { lat: parseFloat(lat), lng: parseFloat(lon) });
      return [parseFloat(lon), parseFloat(lat)]; // [longitude, latitude]
    }
    
    console.log('No geocoding results found for:', fullAddress);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Function to check if coordinates are valid (not null, not 0,0 or close to it)
const areCoordinatesValid = (lat: number | null, lng: number | null): boolean => {
  if (!lat || !lng) return false;
  
  // Check if coordinates are close to 0,0 (null island)
  const isCloseToZero = Math.abs(lat) < 0.1 && Math.abs(lng) < 0.1;
  
  // Check if coordinates are in a reasonable range for France/Europe
  const isInReasonableRange = lat >= 40 && lat <= 55 && lng >= -5 && lng <= 10;
  
  return !isCloseToZero && isInReasonableRange;
};

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Use React Query for data fetching, caching, and state management
  const { 
    data: events = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['mapEvents', user?.id],
    queryFn: fetchGames,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache valid for 5 minutes
    retry: 1,
    meta: {
      errorHandler: (error: any) => {
        // Don't display toast for network errors to avoid spam
        if (error.message !== "Failed to fetch") {
          toast({
            title: "Erreur",
            description: "Impossible de charger les parties",
            variant: "destructive" 
          });
        }
      }
    }
  });

  // Function to fetch games
  async function fetchGames(): Promise<MapEvent[]> {    
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    try {
      // Build the base query
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
        .gte('date', today) // Filter to show only upcoming games or today's games
        .order('date', { ascending: true });
      
      // Only show public games to non-logged in users
      if (!user) {
        query = query.eq('is_private', false);
      } else {
        // For logged-in users, also display their private games
        query = query.or(`is_private.eq.false,created_by.eq.${user.id}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      // Transform data and ensure coordinates are accurate
      const formattedEvents = await Promise.all(data?.map(async (game) => {
        // Format date as DD/MM/YYYY for display
        const gameDate = new Date(game.date);
        const formattedDate = `${gameDate.getDate().toString().padStart(2, '0')}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getFullYear()}`;
        
        // Get the first available image, or use default
        const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
        
        // Check if stored coordinates are valid
        let finalLat = 48.8566; // Default to Paris coordinates
        let finalLng = 2.3522;
        
        const storedLat = game.latitude ? parseFloat(String(game.latitude)) : null;
        const storedLng = game.longitude ? parseFloat(String(game.longitude)) : null;
        
        if (areCoordinatesValid(storedLat, storedLng)) {
          // Use stored coordinates if they are valid
          finalLat = storedLat!;
          finalLng = storedLng!;
          console.log(`Using stored coordinates for game ${game.title}:`, { lat: finalLat, lng: finalLng });
        } else {
          // Geocode the address if coordinates are invalid or missing
          console.log(`Invalid coordinates for game ${game.title}, geocoding address...`);
          const geocodedCoords = await geocodeAddress(game.address, game.zip_code, game.city);
          
          if (geocodedCoords) {
            finalLng = geocodedCoords[0]; // longitude
            finalLat = geocodedCoords[1]; // latitude
            
            // Update the database with the corrected coordinates
            try {
              await supabase
                .from('airsoft_games')
                .update({
                  latitude: finalLat,
                  longitude: finalLng
                })
                .eq('id', game.id);
              
              console.log(`Updated coordinates for game ${game.title}:`, { lat: finalLat, lng: finalLng });
            } catch (updateError) {
              console.error('Failed to update coordinates in database:', updateError);
            }
          } else {
            console.log(`Failed to geocode address for game ${game.title}, using default coordinates`);
          }
        }
        
        return {
          id: game.id,
          title: game.title,
          date: formattedDate,
          location: game.city,
          department: game.zip_code?.substring(0, 2) || "",
          type: game.game_type || "woodland",
          country: "france", // Default value, can be extended later
          lat: finalLat,
          lng: finalLng,
          maxPlayers: game.max_players,
          price: game.price,
          image: gameImage
        };
      }) || []);
      
      return formattedEvents;
    } catch (error) {
      console.error("Error loading map data:", error);
      return [];
    }
  }

  // Set up an error handler that runs when the query has an error
  useEffect(() => {
    if (error) {
      console.error("Error loading map data:", error);
    }
  }, [error]);

  return { 
    loading, 
    events, 
    error, 
    refetch 
  };
}
