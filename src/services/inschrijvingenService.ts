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

// Cache for signed URLs to avoid regenerating them on every selection
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_BUFFER_MS = 5 * 60 * 1000; // 5 minutes buffer before expiry

/**
 * Get a signed URL for a stored file (for private buckets)
 * Uses caching to avoid regenerating URLs unnecessarily
 * Signed URLs are valid for 1 hour by default
 */
async function getSignedMediaUrl(filePath: string): Promise<string | null> {
  // Check cache first
  const cached = signedUrlCache.get(filePath);
  const now = Date.now();
  
  if (cached && cached.expiresAt > now + CACHE_BUFFER_MS) {
    return cached.url;
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  // Cache the new URL with expiry time
  const expiresAt = now + 3600 * 1000;
  signedUrlCache.set(filePath, { url: data.signedUrl, expiresAt });

  return data.signedUrl;
}

/**
 * Clear the signed URL cache (useful for logout or memory management)
 */
export function clearSignedUrlCache(): void {
  signedUrlCache.clear();
}

/**
 * Process inschrijving data to convert file paths to signed URLs
 * Only processes when file paths exist
 */
async function processInschrijving(data: Inschrijving): Promise<Inschrijving> {
  const [foto_url, video_url] = await Promise.all([
    data.foto_url ? getSignedMediaUrl(data.foto_url) : null,
    data.video_url ? getSignedMediaUrl(data.video_url) : null,
  ]);

  return {
    ...data,
    foto_url,
    video_url,
  };
}

/**
 * Fetch all inschrijvingen ordered by creation date (newest first)
 * NOTE: This does NOT include signed URLs for media files to save egress.
 * Use getInschrijvingWithMedia() when you need the actual media URLs.
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

  // Return data WITHOUT processing media URLs - the list view doesn't need them
  // This significantly reduces egress since we don't hit storage for every item
  return { data, error: null };
}

/**
 * Fetch a single inschrijving with media URLs generated
 * Use this when viewing a single registration's details
 */
export async function getInschrijvingWithMedia(inschrijving: Inschrijving): Promise<Inschrijving> {
  return processInschrijving(inschrijving);
}

/**
 * Fetch a single inschrijving by ID with media URLs
 * Uses caching to avoid regenerating URLs unnecessarily
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

  // Convert file paths to signed URLs with caching
  const processedData = data ? await processInschrijving(data) : null;

  return { data: processedData, error: null };
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
 * Assign one or more inschrijvingen to a trip week (or pass null to unassign).
 * Preserves the original beschikbaarheid array.
 */
export async function updateInschrijvingenToegewezenReis(
  ids: string[],
  toegewezen_reis: string | null
): Promise<{ success: boolean; error: Error | null }> {
  if (ids.length === 0) {
    return { success: true, error: null };
  }

  // Wanneer iemand definitief in een reis wordt geplaatst, haal diegene uit een eventuele wachtrij
  const updatePayload = toegewezen_reis
    ? { toegewezen_reis, wachtrij_reis: null }
    : { toegewezen_reis: null };

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(updatePayload)
    .in('id', ids);

  if (error) {
    console.error('Error updating toegewezen_reis:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Place one or more inschrijvingen on the waiting list (wachtrij) for a trip week (or pass null to remove from waitlist).
 */
export async function updateInschrijvingenWachtrijReis(
  ids: string[],
  wachtrij_reis: string | null
): Promise<{ success: boolean; error: Error | null }> {
  if (ids.length === 0) {
    return { success: true, error: null };
  }

  const updatePayload = wachtrij_reis
    ? { wachtrij_reis, toegewezen_reis: null }
    : { wachtrij_reis: null };

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(updatePayload)
    .in('id', ids);

  if (error) {
    console.error('Error updating wachtrij_reis:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Set green/orange/red evaluation dot ('groen' | 'oranje' | 'rood' | null) for one or more inschrijvingen.
 */
export async function updateInschrijvingenBeoordelingKleur(
  ids: string[],
  beoordeling_kleur: 'groen' | 'oranje' | 'rood' | null
): Promise<{ success: boolean; error: Error | null }> {
  if (ids.length === 0) {
    return { success: true, error: null };
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ beoordeling_kleur })
    .in('id', ids);

  if (error) {
    console.error('Error updating beoordeling_kleur:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
}

/**
 * Save notes for one or more inschrijvingen IDs (e.g. deduplicated person rows).
 */
export async function updateInschrijvingenNotitiesBulk(
  ids: string[],
  notities: string
): Promise<{ success: boolean; error: Error | null }> {
  if (ids.length === 0) {
    return { success: true, error: null };
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ notities })
    .in('id', ids);

  if (error) {
    console.error('Error updating notities bulk:', error);
    return { success: false, error: new Error(error.message) };
  }

  return { success: true, error: null };
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
