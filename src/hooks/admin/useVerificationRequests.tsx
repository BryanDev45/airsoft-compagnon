
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VerificationRequest {
  id: string;
  status: string;
  created_at: string;
  front_id_document: string;
  back_id_document: string;
  face_photo?: string;
  admin_notes?: string;
  user_profile: {
    username: string;
    email: string;
  } | null;
}

export const useVerificationRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['verification-requests'],
    queryFn: async (): Promise<VerificationRequest[]> => {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          id,
          status,
          created_at,
          front_id_document,
          back_id_document,
          face_photo,
          admin_notes,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately to avoid join issues
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          // Fetch user profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', request.user_id)
            .single();

          return {
            ...request,
            user_profile: userProfile
          };
        })
      );

      return requestsWithProfiles;
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, adminNotes }: { requestId: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('verification_requests')
        .update({ 
          status, 
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      // If approved, update the user's verified status
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { data } = await supabase
            .from('verification_requests')
            .select('user_id')
            .eq('id', requestId)
            .single();

          if (data) {
            await supabase
              .from('profiles')
              .update({ is_verified: true })
              .eq('id', data.user_id);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });
      toast({
        title: "Demande mise à jour",
        description: "Le statut de la demande a été mis à jour avec succès."
      });
    }
  });

  return {
    requests,
    isLoading,
    updateRequest: updateRequestMutation.mutate
  };
};
