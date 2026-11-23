-- Migration: Add notities column to reis_begeleiders for per-week trip notes
ALTER TABLE public.reis_begeleiders
  ADD COLUMN IF NOT EXISTS notities text NOT NULL DEFAULT '';
