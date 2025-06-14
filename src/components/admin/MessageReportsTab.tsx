
import React from 'react';
import MessageReportCard from './reports/MessageReportCard';
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
    return <div className="flex justify-center p-8">Chargement des rapports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <MessageReportCard
          key={report.id}
          report={report}
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
