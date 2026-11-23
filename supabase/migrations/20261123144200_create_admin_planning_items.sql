-- Migration: Create admin_planning_items table for prioritized to-do/planning list in Admin Dashboard
CREATE TABLE IF NOT EXISTS public.admin_planning_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titel text NOT NULL,
  notitie text NOT NULL DEFAULT '',
  voltooid boolean NOT NULL DEFAULT false,
  positie integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_planning_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_planning_items'
      AND policyname = 'Authenticated full access admin_planning_items'
  ) THEN
    CREATE POLICY "Authenticated full access admin_planning_items"
      ON public.admin_planning_items
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
