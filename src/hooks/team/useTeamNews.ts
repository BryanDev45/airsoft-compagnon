
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamNews, TeamNewsFormData } from '@/types/team';

// Fetch news for a team
const fetchTeamNews = async (teamId: string): Promise<TeamNews[]> => {
  const { data, error } = await supabase
    .from('team_news')
    .select('*, author:author_id(id, username, avatar)')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as any[];
};

// Upload images to storage
const uploadNewsImages = async (teamId: string, newsId: string, files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${index}.${fileExt}`;
    const filePath = `${teamId}/${newsId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-news-images')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('team-news-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
};


export const useTeamNews = (teamId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['teamNews', teamId];

  const newsQuery = useQuery({
    queryKey,
    queryFn: () => fetchTeamNews(teamId),
    enabled: !!teamId,
  });

  const createNewsMutation = useMutation({
    mutationFn: async ({ title, content, images: imageFiles }: TeamNewsFormData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data: newsData, error: newsError } = await supabase
            .from('team_news')
            .insert({ team_id: teamId, author_id: user.id, title, content, images: [] })
            .select()
            .single();

        if (newsError) throw new Error(newsError.message);

        let imageUrls: string[] = [];
        if (imageFiles && imageFiles.length > 0) {
            imageUrls = await uploadNewsImages(teamId, newsData.id, Array.from(imageFiles));
        }

        if (imageUrls.length > 0) {
            const { data: updatedNews, error: updateError } = await supabase
                .from('team_news')
                .update({ images: imageUrls })
                .eq('id', newsData.id)
                .select()
                .single();

            if (updateError) throw new Error(updateError.message);
            return updatedNews;
        }

        return newsData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: 'Succès', description: 'Actualité créée avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de créer l'actualité: ${error.message}` });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, title, content, images: newImageFiles, existingImages }: TeamNewsFormData & { id: string }) => {
        let allImageUrls = existingImages || [];

        if (newImageFiles && newImageFiles.length > 0) {
            const uploadedUrls = await uploadNewsImages(teamId, id, Array.from(newImageFiles));
            allImageUrls = [...allImageUrls, ...uploadedUrls];
        }

        const { data, error } = await supabase
            .from('team_news')
            .update({ title, content, images: allImageUrls, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw new Error(error.message);
        return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: 'Succès', description: 'Actualité mise à jour avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de mettre à jour l'actualité: ${error.message}` });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId: string) => {
        // Note: This doesn't delete images from storage to keep it simple.
        const { error } = await supabase
            .from('team_news')
            .delete()
            .eq('id', newsId);
        
        if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: 'Succès', description: 'Actualité supprimée avec succès.' });
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erreur', description: `Impossible de supprimer l'actualité: ${error.message}` });
    },
  });

  return { newsQuery, createNewsMutation, updateNewsMutation, deleteNewsMutation };
};
