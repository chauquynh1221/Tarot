export interface Database {
  public: {
    Tables: {
      tarot_cards: {
        Row: {
          id: string;
          name: string;
          number: number;
          arcana: 'major' | 'minor';
          suit: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
          image: string;
          description: string;
          detailed_meaning: string;
          upright: string[];
          reversed: string[];
          keywords: string[];
          element: string | null;
          zodiac: string | null;
          yes_no: 'yes' | 'no' | 'maybe';
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          number: number;
          arcana: 'major' | 'minor';
          suit?: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
          image: string;
          description: string;
          detailed_meaning: string;
          upright: string[];
          reversed: string[];
          keywords: string[];
          element?: string | null;
          zodiac?: string | null;
          yes_no: 'yes' | 'no' | 'maybe';
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          id: string;
          name: string;
          number: number;
          arcana: 'major' | 'minor';
          suit: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
          image: string;
          description: string;
          detailed_meaning: string;
          upright: string[];
          reversed: string[];
          keywords: string[];
          element: string | null;
          zodiac: string | null;
          yes_no: 'yes' | 'no' | 'maybe';
          slug: string;
          updated_at: string;
        }>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type for a single tarot card row
export type TarotCardRow = Database['public']['Tables']['tarot_cards']['Row'];
