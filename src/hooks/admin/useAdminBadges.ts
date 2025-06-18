
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge as BadgeType } from '@/hooks/badges/useAllBadges';
import { toast } from '@/components/ui/use-toast';

// Helper to upload image and get URL
const uploadIcon = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('badge-icons')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Erreur d'upload: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('badge-icons')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

// Fetch all badges
const fetchBadges = async (): Promise<BadgeType[]> => {
  const { data, error } = await supabase.from('badges').select('*').order('name');
  if (error) throw error;
  return data as BadgeType[];
};

export const useAdminBadges = () => {
  return useQuery<BadgeType[], Error>({
    queryKey: ['adminBadges'],
    queryFn: fetchBadges,
  });
};

// --- Mutations ---

type BadgeFormData = Omit<BadgeType, 'id' | 'created_at' | 'icon' | 'locked_icon'> & { iconFile?: File, icon?: string, lockedIconFile?: File, locked_icon?: string | null };

// Create a new badge
const createBadge = async (badgeData: BadgeFormData) => {
  let iconUrl = '/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png'; // A default placeholder icon
  if (badgeData.iconFile) {
    iconUrl = await uploadIcon(badgeData.iconFile);
  }

  let lockedIconUrl: string | null = null;
  if (badgeData.lockedIconFile) {
    lockedIconUrl = await uploadIcon(badgeData.lockedIconFile);
  }

  const { iconFile, lockedIconFile, ...badgeToInsert } = badgeData;

  const { data, error } = await supabase
    .from('badges')
    .insert({ ...badgeToInsert, icon: iconUrl, locked_icon: lockedIconUrl })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBadges'] });
      queryClient.invalidateQueries({ queryKey: ['allBadges'] });
      toast({ title: 'Succès', description: 'Badge créé avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de créer le badge: ${error.message}` });
    },
  });
};

// Update a badge
const updateBadge = async (badgeData: Partial<BadgeFormData> & { id: string }) => {
  const { id, iconFile, lockedIconFile, ...badgeToUpdate } = badgeData;
  const updatePayload: { [key: string]: any } = badgeToUpdate;

  if (iconFile) {
    updatePayload.icon = await uploadIcon(iconFile);
  }

  if (lockedIconFile) {
    updatePayload.locked_icon = await uploadIcon(lockedIconFile);
  }

  // Remove keys that are not part of the 'badges' table columns
  delete updatePayload.iconFile;
  delete updatePayload.lockedIconFile;

  const { data, error } = await supabase
    .from('badges')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBadges'] });
      queryClient.invalidateQueries({ queryKey: ['allBadges'] });
      toast({ title: 'Succès', description: 'Badge mis à jour avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de mettre à jour le badge: ${error.message}` });
    },
  });
};

// Toggle badge visibility
const toggleBadgeVisibility = async (badgeId: string, isHidden: boolean) => {
  const { data, error } = await supabase
    .from('badges')
    .update({ is_hidden: !isHidden })
    .eq('id', badgeId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useToggleBadgeVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ badgeId, isHidden }: { badgeId: string; isHidden: boolean }) => 
      toggleBadgeVisibility(badgeId, isHidden),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminBadges'] });
      queryClient.invalidateQueries({ queryKey: ['allBadges'] });
      toast({ 
        title: 'Succès', 
        description: `Badge ${data.is_hidden ? 'masqué' : 'rendu visible'} avec succès.` 
      });
    },
    onError: (error) => {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: `Impossible de modifier la visibilité du badge: ${error.message}` 
      });
    },
  });
};

// Delete a badge
const deleteBadge = async (badgeId: string) => {
    // Manually delete related entries in user_badges first
    const { error: userBadgeError } = await supabase
        .from('user_badges')
        .delete()
        .eq('badge_id', badgeId);

    if (userBadgeError) {
        throw new Error(`Failed to remove badge from users: ${userBadgeError.message}`);
    }

    const { error: badgeError } = await supabase
        .from('badges')
        .delete()
        .eq('id', badgeId);
    
    if (badgeError) {
        throw new Error(`Failed to delete badge: ${badgeError.message}`);
    }
};

export const useDeleteBadge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBadges'] });
      queryClient.invalidateQueries({ queryKey: ['allBadges'] });
      toast({ title: 'Succès', description: 'Badge supprimé avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de supprimer le badge: ${error.message}` });
    },
  });
};
