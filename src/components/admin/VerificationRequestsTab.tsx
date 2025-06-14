import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VerificationRequest {
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

const VerificationRequestsTab = () => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <CheckCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des demandes...</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                Demande de vérification
              </CardTitle>
              <Badge className={getStatusBadge(request.status)}>
                {request.status === 'pending' ? 'En attente' : 
                 request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
              </Badge>
            </div>
            <CardDescription>
              Utilisateur: {request.user_profile?.username || 'Utilisateur supprimé'} • 
              Email: {request.user_profile?.email || 'N/A'} • 
              {new Date(request.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="space-y-2">
                <strong className="block">Document d'identité (recto):</strong>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={request.front_id_document} 
                    alt="Document d'identité recto"
                    className="w-full h-48 object-contain bg-gray-50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                            <div class="text-center">
                              <div class="mb-2">⚠️</div>
                              <div class="text-sm">Image non disponible</div>
                              <a href="${request.front_id_document}" target="_blank" class="text-blue-600 hover:underline text-xs">Ouvrir le lien</a>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <strong className="block">Document d'identité (verso):</strong>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={request.back_id_document} 
                    alt="Document d'identité verso"
                    className="w-full h-48 object-contain bg-gray-50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                            <div class="text-center">
                              <div class="mb-2">⚠️</div>
                              <div class="text-sm">Image non disponible</div>
                              <a href="${request.back_id_document}" target="_blank" class="text-blue-600 hover:underline text-xs">Ouvrir le lien</a>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <strong className="block">Photo du visage:</strong>
                <div className="border rounded-lg overflow-hidden">
                  {request.face_photo ? (
                    <img 
                      src={request.face_photo} 
                      alt="Photo du visage"
                      className="w-full h-48 object-contain bg-gray-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                              <div class="text-center">
                                <div class="mb-2">⚠️</div>
                                <div class="text-sm">Image non disponible</div>
                                <a href="${request.face_photo}" target="_blank" class="text-blue-600 hover:underline text-xs">Ouvrir le lien</a>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-sm">Aucune photo du visage</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {request.admin_notes && (
              <div>
                <strong>Notes admin:</strong> {request.admin_notes}
              </div>
            )}
            
            {request.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => updateRequestMutation.mutate({ 
                    requestId: request.id, 
                    status: 'approved',
                    adminNotes: 'Documents vérifiés et approuvés' 
                  })}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approuver
                </Button>
                <Button
                  onClick={() => updateRequestMutation.mutate({ 
                    requestId: request.id, 
                    status: 'rejected',
                    adminNotes: 'Documents non conformes ou illisibles' 
                  })}
                  variant="destructive"
                  size="sm"
                >
                  Rejeter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {requests.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande de vérification trouvée</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationRequestsTab;
