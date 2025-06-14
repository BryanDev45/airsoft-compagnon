
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MoreVertical, Users, Flag } from 'lucide-react';
import { ConversationDetails } from '@/types/messaging';
import { useAuth } from '@/hooks/useAuth';
import { useIsUserOnline } from '@/hooks/messaging/useUserPresence';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  conversation?: ConversationDetails;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');

  console.log('ChatHeader conversation data:', conversation);
  console.log('Current user:', user);

  const handleReportConversation = async () => {
    if (!user?.id || !conversation?.id || !reportReason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez préciser la raison du signalement.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, we'll report the conversation by finding recent messages
      // In a real implementation, you might want a separate conversation_reports table
      const { data: recentMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (messagesError) throw messagesError;

      if (recentMessages && recentMessages.length > 0) {
        const { error: reportError } = await supabase
          .from('message_reports')
          .insert({
            reporter_id: user.id,
            message_id: recentMessages[0].id,
            reason: 'Conversation inappropriée',
            details: reportReason
          });

        if (reportError) throw reportError;

        toast({
          title: "Signalement envoyé",
          description: "Votre signalement a été transmis aux modérateurs.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de signaler une conversation vide.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error reporting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le signalement.",
        variant: "destructive",
      });
    }

    setShowReportDialog(false);
    setReportReason('');
  };

  const getConversationTitle = () => {
    if (!conversation) return 'Conversation';
    
    if (conversation.type === 'team' && conversation.name) {
      return conversation.name;
    }
    
    // Pour les conversations directes, trouver l'autre participant
    const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);
    console.log('Other participant:', otherParticipant);
    return otherParticipant?.username || 'Conversation';
  };

  const getConversationAvatar = () => {
    if (!conversation) return undefined;
    
    if (conversation.type === 'team') {
      return undefined; // Forcer le fallback pour les équipes
    }
    
    // Pour les conversations directes, récupérer l'avatar de l'autre participant
    const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);
    console.log('Avatar for participant:', otherParticipant?.avatar);
    return otherParticipant?.avatar;
  };

  // Get the other participant for direct conversations to check their online status
  const otherParticipant = conversation?.type === 'direct' 
    ? conversation.participants?.find(p => p.id !== user?.id)
    : null;

  const { data: isOtherUserOnline = false } = useIsUserOnline(otherParticipant?.id);

  const renderAvatarContent = () => {
    if (!conversation) return 'C';
    
    if (conversation.type === 'team') {
      // Pour les conversations d'équipe, afficher l'icône Users
      return <Users className="h-6 w-6 md:h-7 md:w-7" />;
    } else {
      // Pour les conversations directes, afficher les initiales de l'interlocuteur
      const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);
      const displayName = otherParticipant?.username || 'U';
      return displayName.charAt(0).toUpperCase();
    }
  };

  const renderOnlineStatus = () => {
    if (conversation?.type === 'team') {
      // Pour les équipes, toujours afficher "En ligne" en vert
      return (
        <p className="text-xs md:text-sm text-green-600 font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          En ligne
        </p>
      );
    } else {
      // Pour les conversations directes, afficher le vrai statut
      return (
        <p className={`text-xs md:text-sm font-medium flex items-center gap-2 ${
          isOtherUserOnline ? 'text-green-600' : 'text-red-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isOtherUserOnline 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-red-500'
          }`}></div>
          {isOtherUserOnline ? 'En ligne' : 'Hors ligne'}
        </p>
      );
    }
  };

  const title = getConversationTitle();
  const avatarSrc = getConversationAvatar();

  console.log('Computed title:', title);
  console.log('Computed avatar src:', avatarSrc);
  console.log('Other user online status:', isOtherUserOnline);

  return (
    <>
      <div className="flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="lg:hidden hover:bg-gray-100 rounded-full flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-white shadow-lg flex-shrink-0">
              {conversation?.type !== 'team' && avatarSrc && <AvatarImage src={avatarSrc} />}
              <AvatarFallback className={`text-white font-semibold text-sm md:text-lg ${
                conversation?.type === 'team' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-airsoft-red to-red-600'
              }`}>
                {renderAvatarContent()}
              </AvatarFallback>
            </Avatar>
            
            {/* Online status indicator sur l'avatar pour les conversations directes */}
            {conversation?.type === 'direct' && (
              <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-sm ${
                isOtherUserOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-gray-900 text-lg md:text-xl truncate">{title}</h2>
            {renderOnlineStatus()}
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full h-10 w-10 md:h-12 md:w-12">
                <MoreVertical className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                <Flag className="mr-2 h-4 w-4" />
                Signaler cette conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Signaler cette conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez indiquer la raison pour laquelle vous souhaitez signaler cette conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Décrivez le problème..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReportConversation}>
              Envoyer le signalement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHeader;
