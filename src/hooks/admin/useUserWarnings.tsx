
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAddUserWarning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ warnedUserId, reason, context }: { warnedUserId: string; reason: string; context?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié");

        const { error } = await supabase
            .from('user_warnings')
            .insert({
                warned_user_id: warnedUserId,
                admin_id: user.id,
                reason,
                context
            });
        
        if (error) throw error;
    },
    onSuccess: () => {
        toast({
            title: "Avertissement envoyé",
            description: "L'utilisateur a été averti avec succès et a reçu une notification.",
        });
        queryClient.invalidateQueries({ queryKey: ['user-warnings'] });
        queryClient.invalidateQueries({ queryKey: ['user-reports'] });
    },
    onError: (error) => {
        toast({
            title: "Erreur",
            description: `Une erreur est survenue lors de l'envoi de l'avertissement: ${error.message}`,
            variant: "destructive",
        });
    }
  });
};

export const useDeleteUserWarning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (warningId: string) => {
      const { error } = await supabase
        .from('user_warnings')
        .delete()
        .eq('id', warningId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Avertissement supprimé",
        description: "L'avertissement a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-warnings'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la suppression de l'avertissement: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
