-- Migration: Create reis_begeleiders table to store the assigned leader (begeleider) per trip week
CREATE TABLE IF NOT EXISTS public.reis_begeleiders (
  week text PRIMARY KEY,
  begeleider text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reis_begeleiders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reis_begeleiders'
      AND policyname = 'Authenticated full access reis_begeleiders'
  ) THEN
    CREATE POLICY "Authenticated full access reis_begeleiders"
      ON public.reis_begeleiders
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
