import { createClient } from '@supabase/supabase-js';

// Fallback values for production builds (GitHub Pages)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lrdjjzlodcazirutcruj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__fx1m4oCWSz0_n_VEkVXSw_yjDzyJiC';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'stepout-auth-token',
  },
});

export type SupabaseClient = typeof supabase;
