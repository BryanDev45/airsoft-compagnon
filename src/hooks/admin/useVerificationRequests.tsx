
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getVerificationImagesSignedUrls } from '@/utils/verificationImageUtils';

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
    firstname: string | null;
    lastname: string | null;
    birth_date: string | null;
  } | null;
  // Signed URLs for display
  frontIdUrl?: string | null;
  backIdUrl?: string | null;
  facePhotoUrl?: string | null;
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

      // Fetch user profiles and generate signed URLs
      const requestsWithProfilesAndUrls = await Promise.all(
        (data || []).map(async (request) => {
          // Fetch user profile with additional fields
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, email, firstname, lastname, birth_date')
            .eq('id', request.user_id)
            .single();

          // Generate signed URLs for images
          const { frontIdUrl, backIdUrl, facePhotoUrl } = await getVerificationImagesSignedUrls(
            request.front_id_document,
            request.back_id_document,
            request.face_photo
          );

          return {
            ...request,
            user_profile: userProfile,
            frontIdUrl,
            backIdUrl,
            facePhotoUrl,
          };
        })
      );

      return requestsWithProfilesAndUrls;
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, adminNotes }: { requestId: string; status: string; adminNotes?: string }) => {
      // Get user_id for this request before processing
      const { data: requestData, error: fetchError } = await supabase
        .from('verification_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!requestData) throw new Error('Request not found');

      if (status === 'approved') {
        // Update user's verified status
        await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('id', requestData.user_id);

        // Create approval notification
        await supabase
          .from('notifications')
          .insert({
            user_id: requestData.user_id,
            type: 'verification_approved',
            title: 'Compte vérifié',
            message: 'Félicitations ! Votre demande de vérification a été approuvée. Votre compte est maintenant vérifié et vous avez reçu le badge de profil vérifié.',
            link: '/profile'
          });
      } else if (status === 'rejected') {
        // Create rejection notification with reason
        await supabase
          .from('notifications')
          .insert({
            user_id: requestData.user_id,
            type: 'verification_rejected',
            title: 'Demande de vérification refusée',
            message: `Votre demande de vérification a été refusée. Raison : ${adminNotes || 'Aucune raison spécifiée'}. Vous pouvez soumettre une nouvelle demande en corrigeant les problèmes mentionnés.`,
            link: '/profile?tab=verification'
          });
      }

      // Delete the verification request from the database
      const { error: deleteError } = await supabase
        .from('verification_requests')
        .delete()
        .eq('id', requestId);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });
      toast({
        title: "Demande traitée",
        description: "La demande de vérification a été traitée et supprimée avec succès."
      });
    }
  });

  return {
    requests,
    isLoading,
    updateRequest: updateRequestMutation.mutate
  };
};
