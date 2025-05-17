
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
}

export interface TeamMember {
  id: string;
  user_id?: string;
  role?: string;
  status?: string;
  profiles?: {
    id: string;
    username?: string;
    avatar?: string;
  };
}
