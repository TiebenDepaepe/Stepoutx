-- Migration: Add new columns for restructured registration form and make obsolete required columns nullable
ALTER TABLE inschrijvingen
  ADD COLUMN IF NOT EXISTS geboortedatum text,
  ADD COLUMN IF NOT EXISTS huidige_bezigheid text,
  ADD COLUMN IF NOT EXISTS studie_uitleg text,
  ADD COLUMN IF NOT EXISTS werk_uitleg text,
  ADD COLUMN IF NOT EXISTS bezigheid_anders_uitleg text,
  ADD COLUMN IF NOT EXISTS nieuwe_groep text,
  ADD COLUMN IF NOT EXISTS nieuwe_groep_extra text,
  ADD COLUMN IF NOT EXISTS rol_vriendengroep text,
  ADD COLUMN IF NOT EXISTS rol_vriendengroep_extra text,
  ADD COLUMN IF NOT EXISTS sociaal_meerdaagse text,
  ADD COLUMN IF NOT EXISTS sociaal_meerdaagse_extra text,
  ADD COLUMN IF NOT EXISTS vrije_tijd_interesses text[],
  ADD COLUMN IF NOT EXISTS vrije_tijd_anders text,
  ADD COLUMN IF NOT EXISTS extra_info_groep text,
  ADD COLUMN IF NOT EXISTS vrienden_ingeschreven boolean,
  ADD COLUMN IF NOT EXISTS vrienden_namen text;

ALTER TABLE inschrijvingen
  ALTER COLUMN groepsrol DROP NOT NULL,
  ALTER COLUMN spannendst DROP NOT NULL,
  ALTER COLUMN ongemakkelijk DROP NOT NULL,
  ALTER COLUMN waarom_passen DROP NOT NULL,
  ALTER COLUMN wat_spreekt_aan DROP NOT NULL,
  ALTER COLUMN sportiviteit DROP NOT NULL,
  ALTER COLUMN sociale_interactie DROP NOT NULL,
  ALTER COLUMN zelfstandigheid DROP NOT NULL,
  ALTER COLUMN leeftijd DROP NOT NULL;
