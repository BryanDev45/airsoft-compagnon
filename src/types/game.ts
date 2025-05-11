
import { Profile } from './profile';

export interface GameData {
  id: string;
  title: string;
  description: string;
  rules: string;
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  city: string;
  zip_code: string;
  max_players: number;
  price: number | null;
  game_type: string;
  created_by: string;
  latitude?: number;
  longitude?: number;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  aeg_fps_min?: number;
  aeg_fps_max?: number;
  dmr_fps_max?: number;
  eye_protection_required?: boolean;
  full_face_protection_required?: boolean;
  has_toilets?: boolean;
  has_parking?: boolean;
  has_equipment_rental?: boolean;
  manual_validation?: boolean;
  is_private?: boolean;
  creator?: Profile | null;
}

export interface GameParticipant {
  id: string;
  game_id: string;
  user_id: string;
  role?: string;
  status?: string;
  profile: Profile | null;
}

export interface GameComment {
  id: string;
  content: string;
  created_at: string;
  game_id: string;
  user_id: string;
  profile?: Profile | null;
  user?: {
    username: string;
    avatar: string;
  };
}
