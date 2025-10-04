export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_account_secrets: {
        Row: {
          ad_account_id: string
          created_at: string | null
          encrypted_access_token: string | null
          encrypted_refresh_token: string | null
          encryption_key: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          ad_account_id: string
          created_at?: string | null
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          encryption_key?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          ad_account_id?: string
          created_at?: string | null
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string | null
          encryption_key?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_account_secrets_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: true
            referencedRelation: "ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_accounts: {
        Row: {
          account_id: string
          account_name: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          organization_id: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at: string | null
        }
        Insert: {
          account_id: string
          account_name: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          organization_id?: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          account_name?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          organization_id?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          condition: Database["public"]["Enums"]["alert_condition"]
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          metric: string
          name: string
          notification_types:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          organization_id: string | null
          threshold_value: number
          updated_at: string | null
        }
        Insert: {
          condition: Database["public"]["Enums"]["alert_condition"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metric: string
          name: string
          notification_types?:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          organization_id?: string | null
          threshold_value: number
          updated_at?: string | null
        }
        Update: {
          condition?: Database["public"]["Enums"]["alert_condition"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metric?: string
          name?: string
          notification_types?:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          organization_id?: string | null
          threshold_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attribution_settings: {
        Row: {
          created_at: string | null
          id: string
          lookback_window_days: number | null
          model: Database["public"]["Enums"]["attribution_model"] | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lookback_window_days?: number | null
          model?: Database["public"]["Enums"]["attribution_model"] | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lookback_window_days?: number | null
          model?: Database["public"]["Enums"]["attribution_model"] | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attribution_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_metrics: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          impressions: number | null
          revenue: number | null
          spend: number | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          impressions?: number | null
          revenue?: number | null
          spend?: number | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          impressions?: number | null
          revenue?: number | null
          spend?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_account_id: string | null
          budget: number | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          organization_id: string | null
          platform_campaign_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ad_account_id?: string | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          organization_id?: string | null
          platform_campaign_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ad_account_id?: string | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          platform_campaign_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: false
            referencedRelation: "ad_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          name: string
          organization_id: string | null
          recipients: string[]
          report_config: Json
          schedule_cron: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          name: string
          organization_id?: string | null
          recipients: string[]
          report_config: Json
          schedule_cron: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          name?: string
          organization_id?: string | null
          recipients?: string[]
          report_config?: Json
          schedule_cron?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ad_account_tokens: {
        Args: { p_ad_account_id: string }
        Returns: {
          access_token: string
          refresh_token: string
        }[]
      }
      store_ad_account_tokens: {
        Args: {
          p_access_token: string
          p_ad_account_id: string
          p_refresh_token: string
        }
        Returns: string
      }
    }
    Enums: {
      alert_condition:
        | "greater_than"
        | "less_than"
        | "equals"
        | "percentage_change"
      attribution_model: "first_touch" | "last_touch" | "linear" | "time_decay"
      campaign_status: "active" | "paused" | "completed" | "draft"
      notification_type: "email" | "sms" | "slack"
      platform_type:
        | "google_ads"
        | "facebook_ads"
        | "linkedin_ads"
        | "twitter_ads"
        | "tiktok_ads"
        | "other"
      user_role: "admin" | "viewer" | "billing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_condition: [
        "greater_than",
        "less_than",
        "equals",
        "percentage_change",
      ],
      attribution_model: ["first_touch", "last_touch", "linear", "time_decay"],
      campaign_status: ["active", "paused", "completed", "draft"],
      notification_type: ["email", "sms", "slack"],
      platform_type: [
        "google_ads",
        "facebook_ads",
        "linkedin_ads",
        "twitter_ads",
        "tiktok_ads",
        "other",
      ],
      user_role: ["admin", "viewer", "billing"],
    },
  },
} as const
