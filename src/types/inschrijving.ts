export interface Inschrijving {
  id: string;
  created_at: string;
  
  // Personal info
  naam: string;
  leeftijd: number;
  woonplaats: string;
  gsm: string;
  email: string;
  instagram: string | null;
  
  // Availability & Motivation
  beschikbaarheid: string[];
  motivatie: string;
  
  // Goals & Personality
  doelen: string[];
  persoonlijkheid: string[];
  groepsrol: string;
  
  // Questions
  spannendst: string;
  ongemakkelijk: string;
  waarom_passen: string;
  wat_spreekt_aan: string;
  
  // Self ratings
  sportiviteit: string;
  sociale_interactie: string;
  zelfstandigheid: string;

  // New questions for Part 4
  km_wandelen?: string | null;
  meerdere_dagen_wandelen?: string | null;
  bereid_trainen?: string | null;
  fysieke_uitdaging?: string | null;
  lichamelijke_klachten?: string | null;
  reactie_regen_moeheid?: string | null;
  omgang_trager_wandelen?: string | null;
  eigen_moeheid?: string | null;
  omgang_groepsbeslissing?: string | null;
  omgang_irritaties_conflicten?: string | null;
  ergernissen_anderen?: string | null;
  type_persoon_botsen?: string | null;
  behoefte_groep_moeilijk?: string | null;
  reden_stoppen?: string | null;
  
  // Medical
  medisch: boolean;
  medisch_uitleg: string | null;
  
  // Emergency contact
  noodcontact_naam: string;
  noodcontact_gsm: string;
  
  // Media (stored in 'uploads' bucket)
  foto_url: string | null;
  video_url: string | null;
  
  // Admin fields (optional - for future use)
  status?: 'nieuw' | 'beoordeeld' | 'goedgekeurd' | 'afgewezen';
  notities?: string | null;
}

// For displaying in the admin list - derived from Inschrijving
export interface InschrijvingListItem {
  id: string;
  created_at: string;
  naam: string;
  email: string;
  leeftijd: number;
  woonplaats: string;
  status?: 'nieuw' | 'beoordeeld' | 'goedgekeurd' | 'afgewezen';
}
