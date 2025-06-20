
import React from 'react';
import ResponsiveReportCard from './reports/ResponsiveReportCard';
import MessageReportsEmpty from './reports/MessageReportsEmpty';
import ResolveReportDialog from './ResolveReportDialog';
import ViewConversationDialog from './ViewConversationDialog';
import { useMessageReports } from '@/hooks/admin/useMessageReports';

const MessageReportsTab = () => {
  const {
    reports,
    isLoading,
    resolveDialogOpen,
    setResolveDialogOpen,
    selectedReportId,
    viewConversationDialogOpen,
    setViewConversationDialogOpen,
    selectedConversationId,
    updateReportMutation,
    handleViewProfile,
    handleResolveClick,
    handleResolveConfirm,
    handleDismiss,
    handleViewConversation
  } = useMessageReports();

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
          type="message"
          onResolveClick={handleResolveClick}
          onDismiss={handleDismiss}
          onViewProfile={handleViewProfile}
          onViewConversation={handleViewConversation}
          isLoading={updateReportMutation.isPending}
        />
      ))}
      
      {reports.length === 0 && <MessageReportsEmpty />}

      <ResolveReportDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        onConfirm={handleResolveConfirm}
        isLoading={updateReportMutation.isPending}
        title="Résoudre le signalement de message"
        description="Ajoutez un commentaire sur les actions prises concernant ce message signalé."
      />

      <ViewConversationDialog
        open={viewConversationDialogOpen}
        onOpenChange={setViewConversationDialogOpen}
        conversationId={selectedConversationId}
      />
    </div>
  );
};

export default MessageReportsTab;
