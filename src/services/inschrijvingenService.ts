import { supabase } from '@/lib/supabase';
import type { Inschrijving } from '@/types/inschrijving';

const TABLE_NAME = 'inschrijvingen';
const STORAGE_BUCKET = 'uploads';

export interface InschrijvingenResponse {
  data: Inschrijving[] | null;
  error: Error | null;
}

export interface InschrijvingResponse {
  data: Inschrijving | null;
  error: Error | null;
}

/**
 * Fetch all inschrijvingen ordered by creation date (newest first)
 */
export async function getAllInschrijvingen(): Promise<InschrijvingenResponse> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inschrijvingen:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Fetch a single inschrijving by ID
 */
export async function getInschrijvingById(id: string): Promise<InschrijvingResponse> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching inschrijving:', error);
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}

/**
 * Update the status of an inschrijving
 * Note: This requires the 'status' column to exist in the table
 */
export async function updateInschrijvingStatus(
  id: string, 
  status: NonNullable<Inschrijving['status']>
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Add or update notes for an inschrijving
 * Note: This requires the 'notities' column to exist in the table
 */
export async function updateInschrijvingNotities(
  id: string, 
  notities: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ notities })
    .eq('id', id);

  if (error) {
    console.error('Error updating notities:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Get the public URL for a stored file
 * The files are stored in 'uploads' bucket with paths like 'photos/filename.jpg'
 */
export function getMediaUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Get status label in Dutch
 */
export function getStatusLabel(status: NonNullable<Inschrijving['status']>): string {
  const labels: Record<NonNullable<Inschrijving['status']>, string> = {
    'nieuw': 'Nieuw',
    'beoordeeld': 'Beoordeeld',
    'goedgekeurd': 'Goedgekeurd',
    'afgewezen': 'Afgewezen',
  };
  return labels[status];
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: NonNullable<Inschrijving['status']>): string {
  const colors: Record<NonNullable<Inschrijving['status']>, string> = {
    'nieuw': 'bg-blue-100 text-blue-800 border-blue-200',
    'beoordeeld': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'goedgekeurd': 'bg-green-100 text-green-800 border-green-200',
    'afgewezen': 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status];
}
