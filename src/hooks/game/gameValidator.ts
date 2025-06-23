
import { MapEvent } from "@/hooks/useGamesData";
import { areCoordinatesValid } from "@/utils/geocodingUtils";

export const isValidGame = (game: MapEvent): boolean => {
  const isValid = areCoordinatesValid(game.lat, game.lng);
  
  if (!isValid) {
    console.warn(`🎮 GAME VALIDATION - Game "${game.title}" has invalid coordinates: (${game.lat}, ${game.lng})`);
  } else {
    console.log(`🎮 GAME VALIDATION - Game "${game.title}" has valid coordinates: (${game.lat}, ${game.lng})`);
  }
  
  return isValid;
};
