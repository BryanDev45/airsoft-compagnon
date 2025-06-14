
import { Conversation, Message } from '@/types/messaging';

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
};

export const truncateMessage = (text: string, maxLength: number = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getConversationName = (conversation: Conversation) => {
  if (conversation.type === 'team') {
    return conversation.name || 'Conversation d\'équipe';
  }
  const otherParticipant = conversation.participants[0];
  return otherParticipant?.username || 'Utilisateur';
};

export const getConversationAvatar = (conversation: Conversation) => {
  if (conversation.type === 'direct') {
    const otherParticipant = conversation.participants[0];
    return otherParticipant?.avatar;
  }
  return null;
};

export const sortConversations = (conversations: Conversation[]) => {
  return conversations.sort((a, b) => {
    // Prioriser les conversations avec des messages non lus
    if (a.unread_count > 0 && b.unread_count === 0) return -1;
    if (b.unread_count > 0 && a.unread_count === 0) return 1;
    
    // Ensuite trier par dernière activité
    if (a.lastMessage && b.lastMessage) {
      return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
    } else if (a.lastMessage) {
      return -1;
    } else if (b.lastMessage) {
      return 1;
    }
    
    return 0;
  });
};
