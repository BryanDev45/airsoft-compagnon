export interface TeamData {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  location?: string;
  contact?: string;
  leader_id?: string;
  is_recruiting?: boolean;
  founded?: number;
  is_association?: boolean;
  members?: TeamMember[];
  news?: TeamNews[];
}

export interface TeamMember {
  id: string;
  user_id?: string;
  role?: string;
  game_role?: string;
  association_role?: string;
  status?: string;
  profiles?: {
    id: string;
    username?: string;
    avatar?: string;
  };
}

export interface TeamNews {
  id: string;
  team_id: string;
  author_id: string;
  title: string;
  content: string;
  images: string[] | null;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    username: string | null;
    avatar: string | null;
  };
}

export interface TeamNewsFormData {
  title: string;
  content: string;
  images?: FileList;
  existingImages?: string[];
}
