
export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  birth_date: string | null;
  age: number | null;
  join_date: string | null;
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  location: string | null;
  team: string | null;
  team_id: string | null;
  is_team_leader: boolean | null;
  is_verified: boolean | null;
}

export interface UserStats {
  user_id: string;
  games_played: number | null;
  games_organized: number | null;
  reputation: number | null;
  preferred_game_type: string | null;
  favorite_role: string | null;
  level: string | null;
  updated_at: string | null;
  created_at: string | null;
}

export interface Equipment {
  id: string;
  user_id: string | null;
  type: string;
  name: string | null;
  brand: string | null;
  power: string | null;
  description: string | null;
  image: string | null;
  created_at: string | null;
}

export interface UserGame {
  id: string;
  title: string;
  date: string;
  location: string | null;
  status: string | null;
  image: string | null;
  participants: number | null;
  max_participants: number | null;
}

export interface UserBadge {
  id: string;
  badge_id: string | null;
  user_id: string | null;
  date: string | null;
  created_at: string | null;
  badge?: {
    id: string;
    name: string;
    icon: string | null;
    background_color: string | null;
    border_color: string | null;
    description: string | null;
  };
}
