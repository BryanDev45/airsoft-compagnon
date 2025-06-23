
import { getValidCoordinates } from "@/utils/geocodingUtils";
import { MapEvent } from "@/hooks/useGamesData";

export interface RawGameData {
  id: string;
  title: string;
  date: string;
  end_date?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  game_type: string;
  max_players?: number;
  price?: number;
  start_time?: string;
  end_time?: string;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  created_by: string;
  is_private: boolean;
}

export const processGame = async (game: RawGameData): Promise<MapEvent> => {
  console.log(`🎮 PROCESSING GAME - "${game.title}": Address="${game.address || ''}, ${game.zip_code || ''} ${game.city || ''}", Stored coords=(${game.latitude}, ${game.longitude})`);
  
  // Create address string for logging
  const addressString = `${game.address || ''}, ${game.zip_code || ''} ${game.city || ''}`.trim();
  
  // Use the same geocoding system as stores
  const validCoordinates = await getValidCoordinates(
    game.latitude || null,
    game.longitude || null,
    game.address || '',
    game.zip_code || '',
    game.city || '',
    'France', // Default country
    {
      name: game.title,
      address: game.address,
      city: game.city,
      zip_code: game.zip_code,
      type: 'game_location'
    }
  );

  console.log(`🎮 FINAL COORDS - "${game.title}" (${addressString}): (${validCoordinates.latitude}, ${validCoordinates.longitude})`);

  return {
    id: game.id,
    title: game.title,
    date: game.date, // Format ISO YYYY-MM-DD
    endDate: game.end_date,
    location: `${game.city}`,
    department: game.zip_code ? game.zip_code.substring(0, 2) : '',
    type: game.game_type,
    country: 'France',
    lat: validCoordinates.latitude,
    lng: validCoordinates.longitude,
    maxPlayers: game.max_players,
    price: game.price,
    startTime: game.start_time,
    endTime: game.end_time,
    images: [
      game.Picture1,
      game.Picture2,
      game.Picture3,
      game.Picture4,
      game.Picture5
    ].filter(Boolean)
  };
};
