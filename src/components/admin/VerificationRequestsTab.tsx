import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, CheckCircle, XCircle, UserCheck, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface VerificationRequest {
  id: string;
  user_id: string;
  front_id_document: string;
  back_id_document: string;
  status: string;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  user_profile: { username: string; email: string } | null;
}

const VerificationRequestsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['admin-verification-requests'],
    queryFn: async () => {
      console.log('Fetching verification requests...');
      
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          user_profile:profiles!user_id(username, email)
        `)
        .order('created_at', { ascending: false });

      console.log('Verification requests query result:', { data, error });

      if (error) {
        console.error('Error fetching verification requests:', error);
        throw error;
      }
      
      return (data || []) as VerificationRequest[];
    }
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, notes }: { requestId: string; status: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Si approuvé, mettre à jour le profil utilisateur
      if (status === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', request.user_id);

          if (profileError) throw profileError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] });
      toast({
        title: "Demande mise à jour",
        description: "Le statut de la demande a été modifié avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating verification request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la demande.",
        variant: "destructive",
      });
    }
  });

  const handleUpdateStatus = (requestId: string, status: string) => {
    const notes = adminNotes[requestId] || '';
    updateRequestMutation.mutate({ requestId, status, notes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Verification requests tab error:', error);
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Erreur lors du chargement des demandes</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Demandes de vérification</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {requests.length} demande{requests.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune demande de vérification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Demande de @{request.user_profile?.username || 'Utilisateur supprimé'}
                  </CardTitle>
                  {getStatusBadge(request.status)}
                </div>
                <div className="text-sm text-gray-600">
                  {request.user_profile?.email || 'Email indisponible'} • Demandé le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Documents d'identité :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Recto :</p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a 
                          href={request.front_id_document} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Voir le document recto
                        </a>
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Verso :</p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a 
                          href={request.back_id_document} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Voir le document verso
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {request.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes administrateur :</h4>
                    <p className="text-gray-700">{request.admin_notes}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Notes administrateur (optionnel) :</label>
                      <Textarea
                        placeholder="Ajouter une note..."
                        value={adminNotes[request.id] || ''}
                        onChange={(e) => setAdminNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(request.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updateRequestMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        variant="destructive"
                        disabled={updateRequestMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationRequestsTab;
