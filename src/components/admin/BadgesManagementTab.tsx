
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useAdminBadges, useCreateBadge, useUpdateBadge, useDeleteBadge, useToggleBadgeVisibility } from '@/hooks/admin/useAdminBadges';
import BadgesList from './badges/BadgesList';
import ResponsiveBadgeFormDialog from './badges/ResponsiveBadgeFormDialog';
import { Badge as BadgeType } from '@/hooks/badges/useAllBadges';
import DeleteBadgeDialog from './badges/DeleteBadgeDialog';

const BadgesManagementTab = () => {
  const { data: badges, isLoading: isLoadingBadges } = useAdminBadges();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);

  const { mutate: createBadge, isPending: isCreating } = useCreateBadge();
  const { mutate: updateBadge, isPending: isUpdating } = useUpdateBadge();
  const { mutate: deleteBadge, isPending: isDeleting } = useDeleteBadge();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleBadgeVisibility();

  const handleCreate = () => {
    setSelectedBadge(null);
    setIsFormOpen(true);
  };

  const handleEdit = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setIsFormOpen(true);
  };
  
  const handleDeleteRequest = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setIsDeleteOpen(true);
  };

  const handleToggleVisibility = (badge: BadgeType) => {
    toggleVisibility({ badgeId: badge.id, isHidden: badge.is_hidden || false });
  };

  const onFormSubmit = (data: any) => {
    if (selectedBadge) {
      updateBadge({ ...data, id: selectedBadge.id, icon: selectedBadge.icon, locked_icon: selectedBadge.locked_icon }, {
        onSuccess: () => setIsFormOpen(false),
      });
    } else {
      createBadge(data, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };
  
  const confirmDelete = () => {
    if (selectedBadge) {
      deleteBadge(selectedBadge.id, {
        onSuccess: () => setIsDeleteOpen(false),
      });
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold">Gestion des Badges</h2>
        <Button onClick={handleCreate} size="sm" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="sm:hidden">Créer</span>
          <span className="hidden sm:inline">Créer un badge</span>
        </Button>
      </div>

      {isLoadingBadges || isTogglingVisibility ? (
        <div className="flex justify-center items-center h-32 sm:h-64">
          <div className="text-center">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-airsoft-red mx-auto mb-2 sm:mb-4" />
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        </div>
      ) : (
        <BadgesList 
          badges={badges || []} 
          onEdit={handleEdit} 
          onDelete={handleDeleteRequest} 
          onToggleVisibility={handleToggleVisibility}
        />
      )}

      <ResponsiveBadgeFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={onFormSubmit}
        badge={selectedBadge}
        isSaving={isCreating || isUpdating}
      />
      
      <DeleteBadgeDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        badgeName={selectedBadge?.name}
      />
    </div>
  );
};

export default BadgesManagementTab;
