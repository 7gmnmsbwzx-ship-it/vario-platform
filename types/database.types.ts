// Supabase Database Types
// Auto-generated types for type-safe database operations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          theme_id: string
          is_public: boolean
          custom_domain: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          theme_id?: string
          is_public?: boolean
          custom_domain?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          theme_id?: string
          is_public?: boolean
          custom_domain?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          user_id: string
          type: BlockType
          content: Json
          order_index: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: BlockType
          content: Json
          order_index?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: BlockType
          content?: Json
          order_index?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          config: Json
          is_premium: boolean
          preview_image_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          config: Json
          is_premium?: boolean
          preview_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          config?: Json
          is_premium?: boolean
          preview_image_url?: string | null
          created_at?: string
        }
      }
      page_analytics: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json
          visitor_id: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data?: Json
          visitor_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json
          visitor_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          visitor_id: string
          messages: Json
          tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          visitor_id: string
          messages?: Json
          tokens_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          visitor_id?: string
          messages?: Json
          tokens_used?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_analytics_summary: {
        Row: {
          user_id: string
          total_page_views: number
          total_block_clicks: number
          total_ai_chats: number
          unique_visitors: number
          active_days: number
          last_activity: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      block_type: 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'
    }
  }
}

export type BlockType = Database['public']['Enums']['block_type']
export type UserProfile = Database['public']['Tables']['users_profile']['Row']
export type Block = Database['public']['Tables']['blocks']['Row']
export type Theme = Database['public']['Tables']['themes']['Row']
export type PageAnalytics = Database['public']['Tables']['page_analytics']['Row']
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AnalyticsSummary = Database['public']['Views']['user_analytics_summary']['Row']
