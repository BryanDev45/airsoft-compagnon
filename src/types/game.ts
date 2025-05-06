
import type { Profile } from './profile';

export interface GameData {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  address: string;
  city: string;
  zip_code: string;
  max_players: number;
  price: number | null;
  created_by: string;
  game_type: string;
  rules: string;
  latitude: number | null;
  longitude: number | null;
  has_toilets: boolean | null;
  has_parking: boolean | null;
  has_equipment_rental: boolean | null;
  eye_protection_required: boolean | null;
  full_face_protection_required: boolean | null;
  is_private: boolean | null;
  manual_validation: boolean | null;
  aeg_fps_min: number | null;
  aeg_fps_max: number | null;
  dmr_fps_max: number | null;
  creator?: Profile | null;
  Picture1?: string | null;
  Picture2?: string | null;
  Picture3?: string | null;
  Picture4?: string | null;
  Picture5?: string | null;
}

export interface GameParticipant {
  id: string;
  user_id: string;
  game_id: string;
  role: string;
  status: string;
  created_at: string | null;
  profile?: Profile | null;
}

export interface Comment {
  author: string;
  avatar: string;
  date: string;
  content: string;
}
