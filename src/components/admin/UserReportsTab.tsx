
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ResolveReportDialog from './ResolveReportDialog';
import UserReportCard from './reports/UserReportCard';
import UserReportsEmpty from './reports/UserReportsEmpty';

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
  const navigate = useNavigate();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

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
      setResolveDialogOpen(false);
      setSelectedReportId(null);
    }
  });

  const handleViewProfile = (username: string) => {
    if (username) {
      navigate(`/user/${username}`);
    }
  };

  const handleResolveClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setResolveDialogOpen(true);
  };

  const handleResolveConfirm = (adminNotes: string) => {
    if (selectedReportId) {
      updateReportMutation.mutate({ 
        reportId: selectedReportId, 
        status: 'resolved',
        adminNotes
      });
    }
  };

  const handleDismiss = (reportId: string) => {
    updateReportMutation.mutate({ 
      reportId, 
      status: 'dismissed',
      adminNotes: 'Rapport rejeté après vérification' 
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des rapports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <UserReportCard
          key={report.id}
          report={report}
          onResolveClick={handleResolveClick}
          onDismiss={handleDismiss}
          onViewProfile={handleViewProfile}
          isLoading={updateReportMutation.isPending}
        />
      ))}
      
      {reports.length === 0 && <UserReportsEmpty />}

      <ResolveReportDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onConfirm={handleResolveConfirm}
        isLoading={updateReportMutation.isPending}
        title="Résoudre le signalement d'utilisateur"
        description="Ajoutez un commentaire sur les actions prises concernant ce signalement d'utilisateur."
      />
    </div>
  );
};

export default UserReportsTab;
