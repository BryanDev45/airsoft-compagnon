
import React from 'react';
import ResponsiveReportCard from './reports/ResponsiveReportCard';
import UserReportsEmpty from './reports/UserReportsEmpty';
import ResolveReportDialog from './ResolveReportDialog';
import { useUserReports } from '@/hooks/admin/useUserReports';

const UserReportsTab = () => {
  const {
    reports,
    isLoading,
    resolveDialogOpen,
    setResolveDialogOpen,
    selectedReportId,
    updateReportMutation,
    handleViewProfile,
    handleResolveClick,
    handleResolveConfirm,
    handleDismiss
  } = useUserReports();

  if (isLoading) {
    return (
      <div className="flex justify-center p-4 sm:p-8">
        <div className="text-center">
          <div className="h-8 w-8 sm:h-12 sm:w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
      {reports.map((report) => (
        <ResponsiveReportCard
          key={report.id}
          report={report}
          type="user"
          onResolveClick={handleResolveClick}
          onDismiss={handleDismiss}
          onViewProfile={handleViewProfile}
          isLoading={updateReportMutation.isP}
        />
      ))}
      
      {reports.length === 0 && <UserReportsEmpty />}

      <ResolveReportDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onConfirm={handleResolveConfirm}
        isLoading={updateReportMutation.isPending}
        title="Résoudre le signalement d'utilisateur"
        description="Ajoutez un commentaire sur les actions prises concernant cet utilisateur signalé."
      />
    </div>
  );
};

export default UserReportsTab;
