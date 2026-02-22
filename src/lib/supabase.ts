import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lrdjjzlodcazirutcruj.supabase.co';
const supabaseKey = 'sb_publishable__fx1m4oCWSz0_n_VEkVXSw_yjDzyJiC';

export const supabase = createClient(supabaseUrl, supabaseKey);
