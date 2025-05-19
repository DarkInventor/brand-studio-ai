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
          instagram_access_token: string | null
          email: string | null // Added email field
          stripe_customer_id: string | null // Added for Stripe integration
          is_subscribed: boolean | null // Track subscription status
          subscription_status: string | null // Active, canceled, etc.
          subscription_period_end: string | null // When current period ends
          subscription_plan: string | null // Which plan they're on
          credits: number | null // Added credits field
          instagram_id?: string | null
          instagram_username?: string | null
          instagram_name?: string | null
          instagram_profile_picture_url?: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          instagram_access_token?: string | null
          email?: string | null
          stripe_customer_id?: string | null
          is_subscribed?: boolean | null
          subscription_status?: string | null
          subscription_period_end?: string | null
          subscription_plan?: string | null
          credits?: number | null // Added credits field
          instagram_id?: string | null
          instagram_username?: string | null
          instagram_name?: string | null
          instagram_profile_picture_url?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          instagram_access_token?: string | null
          email?: string | null
          stripe_customer_id?: string | null
          is_subscribed?: boolean | null
          subscription_status?: string | null
          subscription_period_end?: string | null
          subscription_plan?: string | null
          credits?: number | null // Added credits field
          instagram_id?: string | null
          instagram_username?: string | null
          instagram_name?: string | null
          instagram_profile_picture_url?: string | null
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
          type: string // 'image' | 'video'
          video_url: string | null
          video_duration: number | null
          aspect_ratio: string | null
          quality: string | null
          platform: string // 'instagram' | 'twitter' | 'linkedin' | etc.
          tweet_post: string | null
          tweet_thread: string | null // store as JSON string
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
          type?: string
          video_url?: string | null
          video_duration?: number | null
          aspect_ratio?: string | null
          quality?: string | null
          platform: string // 'instagram' | 'twitter' | 'linkedin' | etc.
          tweet_post?: string | null
          tweet_thread?: string | null
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
          type?: string
          video_url?: string | null
          video_duration?: number | null
          aspect_ratio?: string | null
          quality?: string | null
          platform?: string // 'instagram' | 'twitter' | 'linkedin' | etc.
          tweet_post?: string | null
          tweet_thread?: string | null
        }
      }
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
      analytics_feedback: {
        Row: {
          id: string
          user_id: string
          time_range: string
          brand_consistency_score: number
          caption_quality_score: number
          content_suggestions: Json
          brand_consistency_feedback: string
          caption_quality_feedback: string
          overall_strategy: string
          brand_kit_optimizations: Json
          post_count: number | null
          brand_kit_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          time_range: string
          brand_consistency_score?: number
          caption_quality_score?: number
          content_suggestions?: Json
          brand_consistency_feedback?: string
          caption_quality_feedback?: string
          overall_strategy?: string
          brand_kit_optimizations?: Json
          post_count?: number | null
          brand_kit_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          time_range?: string
          brand_consistency_score?: number
          caption_quality_score?: number
          content_suggestions?: Json
          brand_consistency_feedback?: string
          caption_quality_feedback?: string
          overall_strategy?: string
          brand_kit_optimizations?: Json
          post_count?: number | null
          brand_kit_count?: number | null
          created_at?: string
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
export type ScheduledPost = Database["public"]["Tables"]["scheduled_posts"]["Row"]
export type AnalyticsFeedback = Database["public"]["Tables"]["analytics_feedback"]["Row"]

// Stripe related types
export interface StripeSubscription {
  id: string
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "trialing" | "unpaid"
  current_period_end: string
  cancel_at_period_end: boolean
  plan: {
    id: string
    name: string
    amount: number
    currency: string
    interval: "month" | "year"
  }
}

// Update the PricingPlan interface to include productId
export interface PricingPlan {
  id?: string
  name: string
  description: string
  price: string
  interval: "month" | "year"
  features: PricingFeature[]
  cta: string
  popular?: boolean
  imagesPerMonth: string
  stripePriceId: string
  productId: string // Added Stripe product ID
}

export interface PricingFeature {
  name: string
  included: boolean
  tooltip?: string
}
