import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserReport {
  id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  reporter_profile: {
    username: string;
  } | null;
  reported_profile: {
    username: string;
  } | null;
}

const UserReportsTab = () => {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['user-reports'],
    queryFn: async (): Promise<UserReport[]> => {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          id,
          reason,
          details,
          status,
          created_at,
          admin_notes,
          reporter_id,
          reported_user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately to avoid join issues
      const reportsWithProfiles = await Promise.all(
        (data || []).map(async (report) => {
          // Fetch reporter profile
          const { data: reporterProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', report.reporter_id)
            .single();

          // Fetch reported user profile
          const { data: reportedProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', report.reported_user_id)
            .single();

          return {
            ...report,
            reporter_profile: reporterProfile,
            reported_profile: reportedProfile
          };
        })
      );

      return reportsWithProfiles;
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status, adminNotes }: { reportId: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('user_reports')
        .update({ 
          status, 
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-reports'] });
      toast({
        title: "Rapport mis à jour",
        description: "Le statut du rapport a été mis à jour avec succès."
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des rapports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(report.status)}
                Rapport d'utilisateur
              </CardTitle>
              <Badge className={getStatusBadge(report.status)}>
                {report.status === 'pending' ? 'En attente' : 
                 report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
              </Badge>
            </div>
            <CardDescription>
              Signalé par: {report.reporter_profile?.username || 'Utilisateur supprimé'} • 
              Utilisateur signalé: {report.reported_profile?.username || 'Utilisateur supprimé'} • 
              {new Date(report.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Raison:</strong> {report.reason}
            </div>
            {report.details && (
              <div>
                <strong>Détails:</strong> {report.details}
              </div>
            )}
            {report.admin_notes && (
              <div>
                <strong>Notes admin:</strong> {report.admin_notes}
              </div>
            )}
            {report.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => updateReportMutation.mutate({ 
                    reportId: report.id, 
                    status: 'resolved',
                    adminNotes: 'Action prise contre l\'utilisateur' 
                  })}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Résoudre
                </Button>
                <Button
                  onClick={() => updateReportMutation.mutate({ 
                    reportId: report.id, 
                    status: 'dismissed',
                    adminNotes: 'Rapport rejeté après vérification' 
                  })}
                  variant="outline"
                  size="sm"
                >
                  Rejeter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {reports.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rapport d'utilisateur trouvé</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserReportsTab;
