
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ResolveReportDialog from './ResolveReportDialog';
import UserReportCard from './reports/UserReportCard';
import UserReportsEmpty from './reports/UserReportsEmpty';
import WarnUserDialog from './WarnUserDialog';
import { useAddUserWarning } from '@/hooks/admin/useUserWarnings';

export interface UserReport {
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
  reported_user_id: string;
}

const UserReportsTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [selectedUserToWarn, setSelectedUserToWarn] = useState<{ id: string; username: string; report: UserReport } | null>(null);

  const addUserWarningMutation = useAddUserWarning();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['user-reports'],
    queryFn: async (): Promise<UserReport[]> => {
      // Optimized query - fetch all data in one go to avoid N+1 problem
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
          reported_user_id,
          reporter_profile:profiles!user_reports_reporter_id_fkey(username),
          reported_profile:profiles!user_reports_reported_user_id_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }

      return (data || []).map(report => ({
        ...report,
        reporter_profile: Array.isArray(report.reporter_profile) 
          ? report.reporter_profile[0] 
          : report.reporter_profile,
        reported_profile: Array.isArray(report.reported_profile) 
          ? report.reported_profile[0] 
          : report.reported_profile,
      }));
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
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

  const handleWarnClick = (report: UserReport) => {
    if (report.reported_profile && report.reported_user_id) {
        setSelectedUserToWarn({ id: report.reported_user_id, username: report.reported_profile.username, report: report });
        setWarnDialogOpen(true);
    }
  };

  const handleWarnConfirm = (reason: string) => {
    if (selectedUserToWarn) {
        const reporterUsername = selectedUserToWarn.report.reporter_profile?.username || 'un utilisateur';
        const reportReason = selectedUserToWarn.report.reason;
        const context = `Signalement par ${reporterUsername}. Raison : "${reportReason}"`;

        addUserWarningMutation.mutate({
            warnedUserId: selectedUserToWarn.id,
            reason: reason,
            context: context
        }, {
            onSuccess: () => {
                setWarnDialogOpen(false);
                setSelectedUserToWarn(null);
            }
        });
    }
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
          onWarnClick={handleWarnClick}
          isLoading={updateReportMutation.isPending || addUserWarningMutation.isPending}
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

      <WarnUserDialog
        open={warnDialogOpen}
        onOpenChange={setWarnDialogOpen}
        onConfirm={handleWarnConfirm}
        isLoading={addUserWarningMutation.isPending}
        username={selectedUserToWarn?.username || ''}
      />
    </div>
  );
};

export default UserReportsTab;
