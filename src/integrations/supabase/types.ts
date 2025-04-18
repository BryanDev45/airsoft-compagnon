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
      equipment: {
        Row: {
          brand: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
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
          power?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "game_participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          country: string | null
          created_at: string | null
          date: string
          department: string | null
          description: string | null
          duration: string | null
          id: string
          image: string | null
          lat: number | null
          lng: number | null
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          participants: number | null
          price: number | null
          status: string | null
          title: string
          type: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date: string
          department?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image?: string | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          participants?: number | null
          price?: number | null
          status?: string | null
          title: string
          type?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date?: string
          department?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          image?: string | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          participants?: number | null
          price?: number | null
          status?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          firstname: string | null
          id: string
          is_team_leader: boolean | null
          is_verified: boolean | null
          join_date: string | null
          lastname: string | null
          location: string | null
          team: string | null
          team_id: string | null
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          id: string
          is_team_leader?: boolean | null
          is_verified?: boolean | null
          join_date?: string | null
          lastname?: string | null
          location?: string | null
          team?: string | null
          team_id?: string | null
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          firstname?: string | null
          id?: string
          is_team_leader?: boolean | null
          is_verified?: boolean | null
          join_date?: string | null
          lastname?: string | null
          location?: string | null
          team?: string | null
          team_id?: string | null
          username?: string | null
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
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
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
      teams: {
        Row: {
          banner: string | null
          contact: string | null
          created_at: string | null
          description: string | null
          game_count: number | null
          id: string
          is_association: boolean | null
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
          game_count?: number | null
          id?: string
          is_association?: boolean | null
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
          game_count?: number | null
          id?: string
          is_association?: boolean | null
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
      user_stats: {
        Row: {
          accuracy: string | null
          bomb_defusal: number | null
          created_at: string | null
          favorite_role: string | null
          flags_captured: number | null
          games_organized: number | null
          games_played: number | null
          hostage_rescue: number | null
          level: string | null
          objectives_completed: number | null
          preferred_game_type: string | null
          reputation: number | null
          tactical_awareness: string | null
          teamwork: string | null
          time_played: string | null
          updated_at: string | null
          user_id: string
          vip_protection: number | null
          win_rate: string | null
        }
        Insert: {
          accuracy?: string | null
          bomb_defusal?: number | null
          created_at?: string | null
          favorite_role?: string | null
          flags_captured?: number | null
          games_organized?: number | null
          games_played?: number | null
          hostage_rescue?: number | null
          level?: string | null
          objectives_completed?: number | null
          preferred_game_type?: string | null
          reputation?: number | null
          tactical_awareness?: string | null
          teamwork?: string | null
          time_played?: string | null
          updated_at?: string | null
          user_id: string
          vip_protection?: number | null
          win_rate?: string | null
        }
        Update: {
          accuracy?: string | null
          bomb_defusal?: number | null
          created_at?: string | null
          favorite_role?: string | null
          flags_captured?: number | null
          games_organized?: number | null
          games_played?: number | null
          hostage_rescue?: number | null
          level?: string | null
          objectives_completed?: number | null
          preferred_game_type?: string | null
          reputation?: number | null
          tactical_awareness?: string | null
          teamwork?: string | null
          time_played?: string | null
          updated_at?: string | null
          user_id?: string
          vip_protection?: number | null
          win_rate?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
