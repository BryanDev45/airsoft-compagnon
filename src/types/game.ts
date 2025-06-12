
import { Profile } from './profile';

export interface GameData {
  id: string;
  title: string;
  description: string;
  rules: string;
  date: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  address: string;
  city: string;
  zip_code: string;
  max_players: number;
  price?: number;
  game_type: string;
  manual_validation: boolean;
  has_toilets: boolean;
  has_parking: boolean;
  has_equipment_rental: boolean;
  aeg_fps_min?: number;
  aeg_fps_max?: number;
  dmr_fps_max?: number;
  eye_protection_required: boolean;
  full_face_protection_required: boolean;
  hpa_allowed: boolean;
  polarstar_allowed: boolean;
  tracers_allowed: boolean;
  grenades_allowed: boolean;
  smokes_allowed: boolean;
  pyro_allowed: boolean;
  is_private: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  created_by: string;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  creator?: Profile;
}

export interface GameParticipant {
  id: string;
  game_id: string;
  user_id: string;
  status: string;
  role: string;
  created_at: string;
  profile: Profile | null;
}

export interface GameComment {
  id: string;
  user_id: string;
  game_id: string;
  content: string;
  created_at: string;
  profile: Profile | null;
}
