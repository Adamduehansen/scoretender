export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      score: {
        Row: {
          id: number
          name: string | null
          score: number | null
        }
        Insert: {
          id?: number
          name?: string | null
          score?: number | null
        }
        Update: {
          id?: number
          name?: string | null
          score?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
