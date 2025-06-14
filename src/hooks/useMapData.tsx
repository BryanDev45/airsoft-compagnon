
// Type definitions for map data - updated to use new store types
export interface MapEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  department: string;
  type: string;
  country: string;
  lat: number;
  lng: number;
  maxPlayers?: number;
  price?: number;
  startTime?: string;
  endTime?: string;
  images: string[];
}

// Re-export MapStore from the new location
export type { MapStore } from './stores/types';
