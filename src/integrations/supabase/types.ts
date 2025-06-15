export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airsoft_games: {
        Row: {
          address: string
          aeg_fps_max: number | null
          aeg_fps_min: number | null
          city: string
          created_at: string | null
          created_by: string
          date: string
          description: string
          dmr_fps_max: number | null
          end_date: string | null
          end_time: string
          eye_protection_required: boolean | null
          full_face_protection_required: boolean | null
          game_type: string
          grenades_allowed: boolean | null
          has_equipment_rental: boolean | null
          has_parking: boolean | null
          has_toilets: boolean | null
          hpa_allowed: boolean | null
          id: string
          is_private: boolean | null
          latitude: number | null
          longitude: number | null
          manual_validation: boolean | null
          max_players: number
          Picture1: string | null
          Picture2: string | null
          Picture3: string | null
          Picture4: string | null
          Picture5: string | null
          polarstar_allowed: boolean | null
          price: number | null
          pyro_allowed: boolean | null
          rules: string
          smokes_allowed: boolean | null
          start_time: string
          title: string
          tracers_allowed: boolean | null
          zip_code: string
        }
        Insert: {
          address: string
          aeg_fps_max?: number | null
          aeg_fps_min?: number | null
          city: string
          created_at?: string | null
          created_by: string
          date: string
          description: string
          dmr_fps_max?: number | null
          end_date?: string | null
          end_time: string
          eye_protection_required?: boolean | null
          full_face_protection_required?: boolean | null
          game_type: string
          grenades_allowed?: boolean | null
          has_equipment_rental?: boolean | null
          has_parking?: boolean | null
          has_toilets?: boolean | null
          hpa_allowed?: boolean | null
          id?: string
          is_private?: boolean | null
          latitude?: number | null
          longitude?: number | null
          manual_validation?: boolean | null
          max_players: number
          Picture1?: string | null
          Picture2?: string | null
          Picture3?: string | null
          Picture4?: string | null
          Picture5?: string | null
          polarstar_allowed?: boolean | null
          price?: number | null
          pyro_allowed?: boolean | null
          rules: string
          smokes_allowed?: boolean | null
          start_time: string
          title: string
          tracers_allowed?: boolean | null
          zip_code: string
        }
        Update: {
          address?: string
          aeg_fps_max?: number | null
          aeg_fps_min?: number | null
          city?: string
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string
          dmr_fps_max?: number | null
          end_date?: string | null
          end_time?: string
          eye_protection_required?: boolean | null
          full_face_protection_required?: boolean | null
          game_type?: string
          grenades_allowed?: boolean | null
          has_equipment_rental?: boolean | null
          has_parking?: boolean | null
          has_toilets?: boolean | null
          hpa_allowed?: boolean | null
          id?: string
          is_private?: boolean | null
          latitude?: number | null
          longitude?: number | null
          manual_validation?: boolean | null
          max_players?: number
          Picture1?: string | null
          Picture2?: string | null
          Picture3?: string | null
          Picture4?: string | null
          Picture5?: string | null
          polarstar_allowed?: boolean | null
          price?: number | null
          pyro_allowed?: boolean | null
          rules?: string
          smokes_allowed?: boolean | null
          start_time?: string
          title?: string
          tracers_allowed?: boolean | null
          zip_code?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          background_color: string | null
          border_color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          background_color?: string | null
          border_color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          background_color?: string | null
          border_color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          team_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          team_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          team_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          brand: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          name: string | null
          power: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          power?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          power?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      game_comments: {
        Row: {
          content: string
          created_at: string
          game_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          game_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          game_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_comments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "airsoft_games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_participants: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      glossary: {
        Row: {
          category: string
          created_at: string
          definition: string
          id: string
          term: string
        }
        Insert: {
          category: string
          created_at?: string
          definition: string
          id?: string
          term: string
        }
        Update: {
          category?: string
          created_at?: string
          definition?: string
          id?: string
          term?: string
        }
        Relationships: []
      }
      message_read_status: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          details: string | null
          id: string
          message_id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          id?: string
          message_id: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          id?: string
          message_id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          logo: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          Admin: boolean | null
          age: number | null
          avatar: string | null
          Ban: boolean | null
          ban_date: string | null
          ban_reason: string | null
          banned_by: string | null
          banner: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          firstname: string | null
          friends_list_public: boolean | null
          id: string
          is_team_leader: boolean | null
          is_verified: boolean | null
          join_date: string | null
          lastname: string | null
          location: string | null
          newsletter_subscribed: boolean | null
          phone_number: string | null
          reputation: number | null
          spoken_language: string | null
          team: string | null
          team_id: string | null
          username: string | null
        }
        Insert: {
          Admin?: boolean | null
          age?: number | null
          avatar?: string | null
          Ban?: boolean | null
          ban_date?: string | null
          ban_reason?: string | null
          banned_by?: string | null
          banner?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          friends_list_public?: boolean | null
          id: string
          is_team_leader?: boolean | null
          is_verified?: boolean | null
          join_date?: string | null
          lastname?: string | null
          location?: string | null
          newsletter_subscribed?: boolean | null
          phone_number?: string | null
          reputation?: number | null
          spoken_language?: string | null
          team?: string | null
          team_id?: string | null
          username?: string | null
        }
        Update: {
          Admin?: boolean | null
          age?: number | null
          avatar?: string | null
          Ban?: boolean | null
          ban_date?: string | null
          ban_reason?: string | null
          banned_by?: string | null
          banner?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          friends_list_public?: boolean | null
          id?: string
          is_team_leader?: boolean | null
          is_verified?: boolean | null
          join_date?: string | null
          lastname?: string | null
          location?: string | null
          newsletter_subscribed?: boolean | null
          phone_number?: string | null
          reputation?: number | null
          spoken_language?: string | null
          team?: string | null
          team_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          players: string
          rules: string[]
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          id?: string
          players: string
          rules: string[]
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          players?: string
          rules?: string[]
          title?: string
          type?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          city: string
          created_at: string | null
          created_by: string
          email: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          phone: string | null
          picture1: string | null
          picture2: string | null
          picture3: string | null
          picture4: string | null
          picture5: string | null
          store_type: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          created_by: string
          email?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          phone?: string | null
          picture1?: string | null
          picture2?: string | null
          picture3?: string | null
          picture4?: string | null
          picture5?: string | null
          store_type?: string | null
          website?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          created_by?: string
          email?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
          picture1?: string | null
          picture2?: string | null
          picture3?: string | null
          picture4?: string | null
          picture5?: string | null
          store_type?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      team_fields: {
        Row: {
          address: string | null
          coordinates: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          team_id: string | null
        }
        Insert: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          team_id?: string | null
        }
        Update: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_fields_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          id: string
          invited_user_id: string
          inviter_user_id: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_user_id: string
          inviter_user_id: string
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_user_id?: string
          inviter_user_id?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          association_role: string | null
          game_role: string | null
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          association_role?: string | null
          game_role?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          association_role?: string | null
          game_role?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_ratings: {
        Row: {
          created_at: string
          id: string
          rater_id: string
          rating: number
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          rater_id: string
          rating: number
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          rater_id?: string
          rating?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_ratings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          banner: string | null
          contact: string | null
          created_at: string | null
          description: string | null
          founded: number | null
          game_count: number | null
          id: string
          is_association: boolean | null
          is_recruiting: boolean | null
          leader_id: string | null
          location: string | null
          logo: string | null
          member_count: number | null
          name: string
          rating: number | null
        }
        Insert: {
          banner?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          founded?: number | null
          game_count?: number | null
          id?: string
          is_association?: boolean | null
          is_recruiting?: boolean | null
          leader_id?: string | null
          location?: string | null
          logo?: string | null
          member_count?: number | null
          name: string
          rating?: number | null
        }
        Update: {
          banner?: string | null
          contact?: string | null
          created_at?: string | null
          description?: string | null
          founded?: number | null
          game_count?: number | null
          id?: string
          is_association?: boolean | null
          is_recruiting?: boolean | null
          leader_id?: string | null
          location?: string | null
          logo?: string | null
          member_count?: number | null
          name?: string
          rating?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          created_at: string | null
          date: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          created_at: string
          id: string
          is_online: boolean
          last_seen: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          created_at: string
          id: string
          rated_id: string
          rater_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          rated_id: string
          rater_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          rated_id?: string
          rater_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          favorite_role: string | null
          games_organized: number | null
          games_played: number | null
          level: string | null
          preferred_game_type: string | null
          reputation: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favorite_role?: string | null
          games_organized?: number | null
          games_played?: number | null
          level?: string | null
          preferred_game_type?: string | null
          reputation?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          favorite_role?: string | null
          games_organized?: number | null
          games_played?: number | null
          level?: string | null
          preferred_game_type?: string | null
          reputation?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          back_id_document: string
          created_at: string
          face_photo: string | null
          front_id_document: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          back_id_document: string
          created_at?: string
          face_photo?: string | null
          front_id_document: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          back_id_document?: string
          created_at?: string
          face_photo?: string | null
          front_id_document?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_ban_low_reputation_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      check_friendship_status: {
        Args: { p_user_id: string; p_friend_id: string }
        Returns: string
      }
      count_unread_messages: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      create_direct_conversation: {
        Args: { other_user_id: string }
        Returns: string
      }
      get_average_rating: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_conversations: {
        Args: { user_uuid: string }
        Returns: {
          conversation_id: string
        }[]
      }
      get_user_conversations_secure: {
        Args: { user_uuid: string }
        Returns: {
          conversation_id: string
        }[]
      }
      get_user_rating: {
        Args: { p_rater_id: string; p_rated_id: string }
        Returns: number
      }
      insert_user_rating: {
        Args: { p_rater_id: string; p_rated_id: string; p_rating: number }
        Returns: undefined
      }
      is_conversation_participant: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_conversation_participant_secure: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_online: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      mark_conversation_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      mark_message_as_read: {
        Args: { p_message_id: string; p_user_id: string }
        Returns: undefined
      }
      update_user_location: {
        Args: { p_user_id: string; p_location: string }
        Returns: undefined
      }
      update_user_presence: {
        Args: { p_user_id: string; p_is_online: boolean }
        Returns: undefined
      }
      update_user_rating: {
        Args: { p_rater_id: string; p_rated_id: string; p_rating: number }
        Returns: undefined
      }
      update_user_reputation: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_user_stats: {
        Args: {
          p_user_id: string
          p_preferred_game_type: string
          p_favorite_role: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
