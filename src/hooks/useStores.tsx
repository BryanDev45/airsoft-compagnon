
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { MapStore } from './useMapData';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { useQuery } from '@tanstack/react-query';

const STORES_CACHE_KEY = 'stores_data';

const fetchStoresData = async (): Promise<MapStore[]> => {
  // Vérifier d'abord le cache local
  const cachedStores = getStorageWithExpiry(STORES_CACHE_KEY);
  if (cachedStores) {
    console.log('Using cached stores data');
    return cachedStores;
  }

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) throw error;
  
  const mappedStores: MapStore[] = (data || []).map(store => ({
    id: store.id,
    name: store.name,
    address: store.address,
    city: store.city,
    zip_code: store.zip_code,
    phone: store.phone,
    email: store.email,
    website: store.website,
    lat: store.latitude || 0,
    lng: store.longitude || 0,
    image: store.picture1 || store.picture2 || store.picture3 || store.picture4 || store.picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png",
    picture2: store.picture2,
    picture3: store.picture3,
    picture4: store.picture4,
    picture5: store.picture5
  }));
  
  // Mettre en cache pour 30 minutes
  setStorageWithExpiry(STORES_CACHE_KEY, mappedStores, CACHE_DURATIONS.MEDIUM);
  
  return mappedStores;
};

export const useStores = () => {
  const {
    data: stores = [],
    isLoading: loading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStoresData,
    staleTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    gcTime: CACHE_DURATIONS.LONG, // 24 heures
    refetchOnWindowFocus: false,
    retry: 1,
    meta: {
      errorHandler: (error: any) => {
        if (error.message !== "Failed to fetch") {
          toast({
            title: "Erreur",
            description: "Impossible de charger les magasins",
            variant: "destructive"
          });
        }
      }
    }
  });

  const error = queryError ? 'Impossible de charger les magasins' : null;

  return {
    stores,
    loading,
    error,
    refetch
  };
};
