
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface VerificationRequest {
  id: string;
  status: string;
  created_at: string;
  front_id_document: string;
  back_id_document: string;
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
          *,
          user_profile:profiles(username, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Document d'identité (recto):</strong>
                <div className="mt-2">
                  <a 
                    href={request.front_id_document} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir le document recto
                  </a>
                </div>
              </div>
              <div>
                <strong>Document d'identité (verso):</strong>
                <div className="mt-2">
                  <a 
                    href={request.back_id_document} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir le document verso
                  </a>
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
