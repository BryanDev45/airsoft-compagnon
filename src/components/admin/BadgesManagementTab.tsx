
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { useAdminBadges, useCreateBadge, useUpdateBadge, useDeleteBadge } from '@/hooks/admin/useAdminBadges';
import BadgesList from './badges/BadgesList';
import BadgeFormDialog from './badges/BadgeFormDialog';
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

  const onFormSubmit = (data: any) => {
    if (selectedBadge) {
      updateBadge({ ...data, id: selectedBadge.id, icon: selectedBadge.icon }, {
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
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Badges</h2>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Créer un badge
        </Button>
      </div>

      {isLoadingBadges ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
        </div>
      ) : (
        <BadgesList badges={badges || []} onEdit={handleEdit} onDelete={handleDeleteRequest} />
      )}

      <BadgeFormDialog
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
