
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LocationMap from '../map/LocationMap';
import StoreFiltersSidebar from './StoreFiltersSidebar';
import StoreResultsDisplay from './StoreResultsDisplay';
import { useStores } from '@/hooks/useStores';
import { useStoreFiltering } from '@/hooks/useStoreFiltering';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import AddStoreDialog from './AddStoreDialog';

const StoresMapSection = () => {
  const { stores, loading, error, refetch } = useStores();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editStore, setEditStore] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    filteredStores,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    isMapView,
    setIsMapView,
    selectedStore,
    setSelectedStore
  } = useStoreFiltering(stores);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profileData?.Admin === true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleEditStore = (store: any) => {
    setEditStore(store);
    setIsEditDialogOpen(true);
  };

  const handleStoreSuccess = () => {
    console.log('Store operation successful, refetching stores...');
    refetch();
    setIsEditDialogOpen(false);
    setEditStore(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement des magasins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Erreur lors du chargement des magasins</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar des filtres */}
      <div className="lg:col-span-1">
        <Card className="h-fit">
          <StoreFiltersSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            isMapView={isMapView}
            onViewToggle={setIsMapView}
            storeCount={filteredStores.length}
          />
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="lg:col-span-3">
        <Card className="overflow-hidden">
          {isMapView ? (
            <div className="h-[600px]">
              <LocationMap
                events={[]}
                stores={filteredStores}
                onEventSelect={() => {}}
                onStoreSelect={setSelectedStore}
                selectedStore={selectedStore}
                isAdmin={isAdmin}
                onEditStore={handleEditStore}
              />
            </div>
          ) : (
            <StoreResultsDisplay
              stores={filteredStores}
              isAdmin={isAdmin}
              onEditStore={handleEditStore}
            />
          )}
        </Card>
      </div>

      {/* Dialog d'édition de magasin */}
      <AddStoreDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        editStore={editStore}
        onSuccess={handleStoreSuccess}
      />
    </div>
  );
};

export default StoresMapSection;
