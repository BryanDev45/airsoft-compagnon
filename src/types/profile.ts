
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
  team_logo: string | null;
  is_team_leader: boolean | null;
  is_verified: boolean | null;
  newsletter_subscribed: boolean | null;
}

export interface UserStats {
  user_id: string;
  games_played: number;
  games_organized: number;
  reputation: number;
  preferred_game_type: string;
  favorite_role: string;
  level: string;
  created_at: string;
  updated_at: string;
}
