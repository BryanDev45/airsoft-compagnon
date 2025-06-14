
export interface Participant {
  id: string;
  username: string;
  avatar?: string;
}

export interface LastMessage {
  content: string;
  created_at: string;
  sender_name: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'team';
  name?: string;
  participants: Participant[];
  lastMessage?: LastMessage;
  unread_count: number;
}

export interface ConversationData {
  id: string;
  type: 'direct' | 'team';
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetails {
  id: string;
  type: 'direct' | 'team';
  name?: string;
  participants?: Participant[];
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  created_at: string;
  is_deleted: boolean;
}
