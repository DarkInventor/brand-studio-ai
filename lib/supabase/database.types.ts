export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brand_kits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          primary_color: string
          secondary_color: string
          brand_tone: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          primary_color: string
          secondary_color: string
          brand_tone?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          primary_color?: string
          secondary_color?: string
          brand_tone?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          brand_kit_id: string
          caption: string
          image_url: string
          status: string
          scheduled_for: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_kit_id: string
          caption: string
          image_url: string
          status?: string
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_kit_id?: string
          caption?: string
          image_url?: string
          status?: string
          scheduled_for?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      scheduled_posts: {
        Row: {
          id: string
          post_id: string
          brand_kit_id: string
          date: string
          time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          brand_kit_id: string
          date: string
          time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          brand_kit_id?: string
          date?: string
          time?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type BrandKit = Database["public"]["Tables"]["brand_kits"]["Row"]
export type Post = Database["public"]["Tables"]["posts"]["Row"]
