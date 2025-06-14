
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MessageReport {
  id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  reporter_profile: {
    username: string;
  } | null;
  message: {
    content: string;
    conversation_id: string;
    sender_profile: {
      username: string;
    } | null;
  } | null;
}

export const useMessageReports = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [viewConversationDialogOpen, setViewConversationDialogOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['message-reports'],
    queryFn: async (): Promise<MessageReport[]> => {
      const { data, error } = await supabase
        .from('message_reports')
        .select(`
          id,
          reason,
          details,
          status,
          created_at,
          admin_notes,
          reporter_id,
          message_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles and messages separately to avoid join issues
      const reportsWithProfiles = await Promise.all(
        (data || []).map(async (report) => {
          // Fetch reporter profile
          const { data: reporterProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', report.reporter_id)
            .single();

          // Fetch message and sender profile
          const { data: message } = await supabase
            .from('messages')
            .select('content, sender_id, conversation_id')
            .eq('id', report.message_id)
            .single();

          let senderProfile = null;
          if (message?.sender_id) {
            const { data: sender } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', message.sender_id)
              .single();
            senderProfile = sender;
          }

          return {
            ...report,
            reporter_profile: reporterProfile,
            message: message ? {
              content: message.content,
              conversation_id: message.conversation_id,
              sender_profile: senderProfile
            } : null
          };
        })
      );

      return reportsWithProfiles;
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status, adminNotes }: { reportId: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('message_reports')
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
      queryClient.invalidateQueries({ queryKey: ['message-reports'] });
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

  const handleViewConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setViewConversationDialogOpen(true);
  };

  return {
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
  };
};
