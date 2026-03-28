import { supabase } from '@/lib/supabase';

const TABLE_NAME = 'nieuwsbrief';

export interface NieuwsbriefEmail {
  id: string;
  created_at: string;
  email: string;
}

export interface NieuwsbriefResponse {
  data: NieuwsbriefEmail[] | null;
  error: Error | null;
}

/**
 * Subscribe an email to the newsletter
 * Returns error if email already exists (unique constraint)
 */
export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; error: Error | null; isDuplicate: boolean }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    // Supabase unique constraint violation code
    const isDuplicate = error.code === '23505';
    return {
      success: false,
      error: new Error(isDuplicate ? 'Dit e-mailadres is al ingeschreven.' : error.message),
      isDuplicate,
    };
  }

  return { success: true, error: null, isDuplicate: false };
}

/**
 * Fetch all newsletter emails ordered by creation date (newest first)
 * Requires authenticated user (admin)
 */
export async function getAllNieuwsbriefEmails(): Promise<NieuwsbriefResponse> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching nieuwsbrief emails:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}
