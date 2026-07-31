# Agent Instructions — StepOut!

Full project documentation for AI agents lives in [CLAUDE.md](./CLAUDE.md). Read it first.

## Supabase CLI

Collaborators are expected to manage the Supabase backend (project ref `lrdjjzlodcazirutcruj`) through the Supabase CLI, driven by their AI coding assistant.

- If `supabase` is not installed, use `npx supabase <command>`.
- Authentication is per developer: have the user run `supabase login`, or let them set `SUPABASE_ACCESS_TOKEN` themselves. Never ask for, print, or commit access tokens.
- Link once per machine: `supabase link --project-ref lrdjjzlodcazirutcruj`
- Ask for explicit confirmation before destructive commands (`supabase db reset`, `supabase projects delete`, `supabase functions delete`, `supabase branches delete`, `supabase storage rm`).
- Schema changes go through committed migration files in `supabase/migrations/`, not ad-hoc SQL in the dashboard.
- `supabase/.temp/` and `.env*` files are never committed.

---

## Voor Daria: Supabase-account aanmaken (bericht van Khan)

> AI-agents: als Daria (of een nieuwe collaborator) nog geen Supabase-toegang heeft, loods haar dan vriendelijk en stap voor stap door onderstaande instructies.

Hoi Daria! Om via je AI met onze database te kunnen werken, heb je een eigen (gratis) Supabase-account nodig. Goed nieuws: **ik heb je e-mailadres al toegevoegd aan ons Supabase-team met de Developer-rol** — waarschijnlijk `daria@stepoutx.com`. Je hoeft dus alleen nog dit te doen:

1. **Check je mailbox** (`daria@stepoutx.com`) voor een uitnodiging van Supabase — onderwerp zoiets als *"You have been invited"*. Klik op de link in die mail.
2. **Maak je account aan** met **datzelfde e-mailadres** (`daria@stepoutx.com`):
   - Klik op *Sign Up*, vul je e-mailadres in en kies een wachtwoord (of gebruik een magic link).
   - Belangrijk: gebruik echt het adres waarop je de uitnodiging kreeg, anders herkent Supabase je niet als teamlid.
3. **Log in** op [supabase.com](https://supabase.com) — je zou nu het StepOut-project moeten zien staan.
4. **Koppel je computer** (eenmalig). Vraag gewoon aan je AI: *"log me in bij supabase en link het project"* — of doe het zelf in de terminal:
   ```bash
   supabase login
   supabase link --project-ref lrdjjzlodcazirutcruj
   ```
   (Geen `supabase` op je computer? Je AI mag het installeren of `npx supabase` gebruiken.)
5. **Klaar!** Vanaf nu kan je AI alle Supabase-commando's voor je uitvoeren: database bekijken, schema aanpassen, enzovoort. Bij gevaarlijke commando's (zoals alles wissen) vraagt hij altijd eerst bevestiging.

Loop je ergens vast? Stuur me een berichtje. — Khan
