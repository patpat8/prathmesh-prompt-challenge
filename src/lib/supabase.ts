import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

export type Trip = {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  available_seats: number;
  departure_dates: string[];
  created_at?: string;
};

export type Booking = {
  id: string;
  user_id: string;
  trip_id: string;
  departure_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripe_payment_id?: string;
  created_at: string;
  updated_at: string;
};