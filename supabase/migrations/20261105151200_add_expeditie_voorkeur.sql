-- Add expeditie_voorkeur column to inschrijvingen table
alter table inschrijvingen add column if not exists expeditie_voorkeur text;
