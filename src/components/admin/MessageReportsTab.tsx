
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface MessageReport {
  id: string;
  reporter_id: string;
  message_id: string;
  reason: string;
  details: string;
  status: string;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  reporter_profile: { username: string } | null;
  message: {
    content: string;
    sender_id: string;
    sender_profile: { username: string } | null;
  } | null;
}

const MessageReportsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['admin-message-reports'],
    queryFn: async () => {
      console.log('Fetching message reports...');
      
      const { data, error } = await supabase
        .from('message_reports')
        .select(`
          *,
          reporter_profile:profiles!reporter_id(username),
          message:messages(
            content,
            sender_id,
            sender_profile:profiles(username)
          )
        `)
        .order('created_at', { ascending: false });

      console.log('Message reports query result:', { data, error });

      if (error) {
        console.error('Error fetching message reports:', error);
        throw error;
      }
      
      return data as MessageReport[];
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status, notes }: { reportId: string; status: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('message_reports')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-message-reports'] });
      toast({
        title: "Signalement mis à jour",
        description: "Le statut du signalement a été modifié avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating message report:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le signalement.",
        variant: "destructive",
      });
    }
  });

  const handleUpdateStatus = (reportId: string, status: string) => {
    const notes = adminNotes[reportId] || '';
    updateReportMutation.mutate({ reportId, status, notes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Résolu</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="text-gray-600"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des signalements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Message reports tab error:', error);
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Erreur lors du chargement des signalements</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Signalements de messages</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {reports.length} signalement{reports.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun signalement de message</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Message de @{report.message?.sender_profile?.username || 'Utilisateur supprimé'}
                  </CardTitle>
                  {getStatusBadge(report.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Signalé par @{report.reporter_profile?.username || 'Utilisateur supprimé'} • {new Date(report.created_at).toLocaleDateString('fr-FR')}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message signalé :</h4>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700">{report.message?.content || 'Message supprimé'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Raison :</h4>
                  <p className="text-gray-700">{report.reason}</p>
                </div>

                {report.details && (
                  <div>
                    <h4 className="font-medium mb-2">Détails :</h4>
                    <p className="text-gray-700">{report.details}</p>
                  </div>
                )}

                {report.admin_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes administrateur :</h4>
                    <p className="text-gray-700">{report.admin_notes}</p>
                  </div>
                )}

                {report.status === 'pending' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Notes administrateur (optionnel) :</label>
                      <Textarea
                        placeholder="Ajouter une note..."
                        value={adminNotes[report.id] || ''}
                        onChange={(e) => setAdminNotes(prev => ({ ...prev, [report.id]: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updateReportMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme résolu
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                        variant="outline"
                        disabled={updateReportMutation.isPending}
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

export default MessageReportsTab;
