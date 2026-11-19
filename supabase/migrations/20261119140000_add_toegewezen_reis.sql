-- Migration: Add toegewezen_reis column to inschrijvingen for trip week assignment
ALTER TABLE inschrijvingen
  ADD COLUMN IF NOT EXISTS toegewezen_reis text;
