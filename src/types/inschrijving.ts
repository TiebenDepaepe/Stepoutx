export interface Inschrijving {
  id: string;
  created_at: string;
  
  // Personal info
  naam: string;
  leeftijd?: number | null;
  geboortedatum?: string | null;
  woonplaats: string;
  gsm: string;
  email: string;
  instagram: string | null;
  huidige_bezigheid?: string | null;
  studie_uitleg?: string | null;
  werk_uitleg?: string | null;
  bezigheid_anders_uitleg?: string | null;
  expeditie_voorkeur?: string | null;
  
  // Availability & Motivation
  beschikbaarheid: string[];
  motivatie: string;
  
  // Goals & Personality
  doelen: string[];
  persoonlijkheid: string[];
  groepsrol?: string | null;
  nieuwe_groep?: string | null;
  nieuwe_groep_extra?: string | null;
  rol_vriendengroep?: string | null;
  rol_vriendengroep_extra?: string | null;
  sociaal_meerdaagse?: string | null;
  sociaal_meerdaagse_extra?: string | null;
  vrije_tijd_interesses?: string[] | null;
  vrije_tijd_anders?: string | null;
  
  // Questions (legacy & active)
  spannendst?: string | null;
  ongemakkelijk?: string | null;
  waarom_passen?: string | null;
  wat_spreekt_aan?: string | null;
  extra_info_groep?: string | null;
  
  // Self ratings (legacy)
  sportiviteit?: string | null;
  sociale_interactie?: string | null;
  zelfstandigheid?: string | null;

  // Wandelen & Fysiek
  km_wandelen?: string | null;
  meerdere_dagen_wandelen?: string | null;
  fysieke_uitdaging?: string | null;
  reactie_regen_moeheid?: string | null;
  omgang_trager_wandelen?: string | null;
  eigen_moeheid?: string | null;
  omgang_groepsbeslissing?: string | null;
  omgang_irritaties_conflicten?: string | null;
  ergernissen_anderen?: string | null;
  type_persoon_botsen?: string | null;
  behoefte_groep_moeilijk?: string | null;
  reden_stoppen?: string | null;
  
  // Vrienden
  vrienden_ingeschreven?: boolean | null;
  vrienden_namen?: string | null;
  
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
