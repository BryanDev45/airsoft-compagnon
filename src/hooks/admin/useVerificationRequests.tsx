
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
      // First, update the request status to trigger notifications
      const { error: updateError } = await supabase
        .from('verification_requests')
        .update({ 
          status, 
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, update the user's verified status and grant badge
      if (status === 'approved') {
        const { data: requestData, error: requestError } = await supabase
          .from('verification_requests')
          .select('user_id')
          .eq('id', requestId)
          .single();

        if (requestError) {
          console.error("Error fetching request details for approval:", requestError.message);
        } else if (requestData) {
          const { user_id } = requestData;

          // Update user's profile to be verified
          await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', user_id);

          // Find and assign the 'Profil vérifié' badge
          const { data: badge, error: badgeError } = await supabase
            .from('badges')
            .select('id')
            .eq('name', 'Profil vérifié')
            .single();

          if (badgeError) {
            console.error('Error fetching "Profil vérifié" badge:', badgeError.message);
            toast({
              title: "Erreur de badge",
              description: "L'utilisateur a été vérifié mais le badge 'Profil vérifié' n'a pas pu être trouvé.",
              variant: "destructive",
            });
          } else if (badge) {
            const { error: assignError } = await supabase
              .from('user_badges')
              .insert({ user_id: user_id, badge_id: badge.id, date: new Date().toISOString().split('T')[0] });
            
            if (assignError) {
              console.error("Error assigning 'Profil vérifié' badge:", assignError.message);
              toast({
                title: "Erreur de badge",
                description: "L'utilisateur a été vérifié mais le badge n'a pas pu lui être attribué.",
                variant: "destructive",
              });
            }
          }
        }
      }

      // After processing (approval or rejection), delete the request
      if (status === 'approved' || status === 'rejected') {
        const { error: deleteError } = await supabase
          .from('verification_requests')
          .delete()
          .eq('id', requestId);

        if (deleteError) {
          console.error('Error deleting verification request:', deleteError);
          // Don't throw here as the main operation succeeded
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });
      
      const actionText = variables.status === 'approved' ? 'approuvée' : 'rejetée';
      toast({
        title: "Demande mise à jour",
        description: `La demande de vérification a été ${actionText} avec succès.`
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la demande.",
        variant: "destructive"
      });
    }
  });

  return {
    requests,
    isLoading,
    updateRequest: updateRequestMutation.mutateAsync
  };
};
