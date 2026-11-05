-- Migration: Remove bereid_trainen and lichamelijke_klachten from inschrijvingen table
alter table inschrijvingen
  drop column if exists bereid_trainen,
  drop column if exists lichamelijke_klachten;
