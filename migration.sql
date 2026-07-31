-- SQL Migration to update the inschrijvingen table with the new Deel 4 questions

ALTER TABLE inschrijvingen 
  ADD COLUMN IF NOT EXISTS km_wandelen text,
  ADD COLUMN IF NOT EXISTS meerdere_dagen_wandelen text,
  ADD COLUMN IF NOT EXISTS bereid_trainen text,
  ADD COLUMN IF NOT EXISTS fysieke_uitdaging text,
  ADD COLUMN IF NOT EXISTS reactie_regen_moeheid text,
  ADD COLUMN IF NOT EXISTS omgang_trager_wandelen text,
  ADD COLUMN IF NOT EXISTS eigen_moeheid text,
  ADD COLUMN IF NOT EXISTS omgang_groepsbeslissing text,
  ADD COLUMN IF NOT EXISTS omgang_irritaties_conflicten text,
  ADD COLUMN IF NOT EXISTS ergernissen_anderen text,
  ADD COLUMN IF NOT EXISTS type_persoon_botsen text,
  ADD COLUMN IF NOT EXISTS behoefte_groep_moeilijk text,
  ADD COLUMN IF NOT EXISTS reden_stoppen text,
  ADD COLUMN IF NOT EXISTS lichamelijke_klachten text;
