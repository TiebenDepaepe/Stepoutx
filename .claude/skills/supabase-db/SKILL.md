---
name: supabase-db
description: Use for ANY database or Supabase work on this project — reading or querying the `inschrijvingen` table, adding/changing columns, schema changes, migrations, RLS policies, the `uploads` storage bucket, or debugging Supabase connection and permission errors. All of it goes through the Supabase CLI against the linked project, never through the dashboard UI. Triggers on: database, db, Supabase, tabel, kolom, veld toevoegen, migratie, migration, schema, RLS, policy, inschrijvingen, registraties, storage bucket, "query de data", "wat staat er in de database".
---

# Supabase database work

Everything in this project's database is done with the Supabase CLI against the
**linked remote project**. Do not tell the user to click around in the Supabase
dashboard, and do not run raw SQL in the dashboard SQL editor — schema changes
made there are invisible to git and will be silently overwritten by the next
`db push`.

**Project ref**: `lrdjjzlodcazirutcruj` (matches `VITE_SUPABASE_URL`)
**Postgres**: 17
**Main table**: `inschrijvingen` — full column list is in [CLAUDE.md](../../../CLAUDE.md)

## Golden rules

1. **Always pass `--linked`** on `db query`. The CLI defaults to `--local`,
   which needs Docker and a running local Postgres — this project has none, so
   without the flag every command fails with a confusing connection error.
2. **Schema changes go through migration files**, committed to git. Never edit
   the schema by hand.
3. **Never run `supabase db reset`** — it is a local-database command, but if it
   ever gets pointed at the remote it destroys all registrations. The repo's
   permission rules already force a confirmation prompt for it.
4. **Never ask for, echo, or store the user's access token or database
   password.** If auth fails, have the user run `supabase login` themselves.

## Step 0 — preflight (run this first, every time)

```bash
supabase --version                 # is the CLI installed?
supabase projects list             # is the user authenticated?
cat supabase/.temp/project-ref     # is this repo linked?
```

Interpret the results:

- `command not found` → go to **Install** below.
- `projects list` fails with an auth error → go to **Log in** below.
- No `project-ref` file → go to **Link** below.
- All three fine → go straight to the task.

## Install

Prefer not installing software on someone's machine. If the CLI is missing,
just prefix every command with `npx`:

```bash
npx supabase projects list
```

If the user does want it installed permanently, on macOS:

```bash
brew install supabase/tap/supabase
```

## Log in

```bash
supabase login
```

This opens a browser and requires being signed in on supabase.com with a
personal account that has access to the StepOut project. If the browser asks for
a password, it is the **Supabase account password** — the user retrieves it from
their own password manager (on iPhone/Mac: the Wachtwoorden app / iCloud
Sleutelhanger, search for "supabase"). Never ask them to paste it to you.

Alternative for headless environments: the user creates a token at
https://supabase.com/dashboard/account/tokens and exports
`SUPABASE_ACCESS_TOKEN` in their own shell profile. Tokens are never committed.

## Link

Once per machine:

```bash
supabase link --project-ref lrdjjzlodcazirutcruj
```

This may prompt for the **database password**, which is a different thing from
the account password above. It lives in the Supabase dashboard under Project
Settings → Database. If the user does not have it, they can skip the prompt —
linking still works, and everything in **Reading data** below works without it.
Only `db pull` / `db dump` genuinely need it.

## Reading data

`db query --linked` goes through the Management API, so it needs only
`supabase login` — no database password, no Docker.

```bash
# how many registrations, grouped by status
supabase db query --linked "select status, count(*) from inschrijvingen group by status"

# recent registrations, readable columns only
supabase db query --linked \
  "select naam, leeftijd, woonplaats, email, status, created_at
   from inschrijvingen order by created_at desc limit 20"

# inspect the actual live columns of a table
supabase db query --linked \
  "select column_name, data_type, is_nullable
   from information_schema.columns
   where table_name = 'inschrijvingen' order by ordinal_position"
```

Output defaults to JSON when an agent is driving. Add `--output table` or
`--output csv` when the result is meant for a human to read.

The rows contain applicants' real names, phone numbers, emails and medical
notes. Show the user only the columns they asked about, and do not paste full
dumps of personal data into chat or into files.

## Changing the schema

There is currently **no `supabase/migrations/` directory** — the remote schema
was built before migrations were adopted. The first schema change must therefore
start with a baseline:

```bash
supabase db pull                   # writes the current remote schema as the first migration
git add supabase/migrations && git commit -m "chore: baseline supabase schema"
```

After that, every change follows the same loop:

```bash
supabase migration new add_dieet_column      # creates supabase/migrations/<ts>_add_dieet_column.sql
# edit that file, write plain SQL:
#   alter table inschrijvingen add column dieet text;
supabase migration list                      # confirm what is local vs already applied remotely
supabase db push                             # apply to the hosted project
```

Then commit the migration file. Reviewable, reproducible, and in git.

### A schema change is rarely only a schema change

Adding or renaming a column in `inschrijvingen` usually means touching the app
too. Check whether these need updating (the full checklist is in CLAUDE.md under
"Adding New Form Fields"):

- `src/types/inschrijving.ts` — the TypeScript interface
- `src/lib/validation.ts` — the Zod schema
- `src/sections/ContactAndSignup.tsx` — the multi-step form
- `src/hooks/useFormSubmit.ts` — the insert payload
- `src/components/admin/InschrijvingDetail.tsx` — the admin display

## RLS and storage

Registrations are inserted by anonymous visitors from the public form, while
reading them requires an authenticated admin. The `uploads` bucket (`photos/`,
`videos/`) is authenticated-only for the same reason. If a change touches who
can read or write what, write it as SQL in a migration like any other change,
and state plainly in your summary that the access rules changed.

Quick check on what policies exist right now:

```bash
supabase db query --linked \
  "select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public'"

supabase db advisors --linked        # security + performance warnings
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `failed to connect ... localhost:54322` | `--linked` was omitted, CLI tried the local DB | add `--linked` |
| `Access token not provided` / 401 | not logged in | user runs `supabase login` |
| `Cannot find project ref` | repo not linked on this machine | `supabase link --project-ref lrdjjzlodcazirutcruj` |
| `db pull` asks for a password and none is known | that is the database password, not the account one | grab it in dashboard → Project Settings → Database, or skip `db pull` and use `db query` |
| App works locally but not on the live site | env vars, not the database | check `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` and the CSP `connect-src` in `index.html` |

Never commit `supabase/.temp/` — it is per-machine state and is already
gitignored.
