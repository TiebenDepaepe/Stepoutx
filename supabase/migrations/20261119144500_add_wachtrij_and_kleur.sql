-- Migration: Add wachtrij_reis and beoordeling_kleur columns to inschrijvingen
ALTER TABLE inschrijvingen
  ADD COLUMN IF NOT EXISTS wachtrij_reis text,
  ADD COLUMN IF NOT EXISTS beoordeling_kleur text;
