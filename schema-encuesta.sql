-- Escuadra · encuesta anónima (corre esto una vez en Supabase → SQL Editor → Run)
-- Cualquiera con el enlace puede RESPONDER; solo tú puedes LEER y BORRAR. No se guarda nombre ni número de lista.
create table if not exists public.escuadra_encuesta (
  id        bigint generated always as identity primary key,
  owner     uuid not null references auth.users(id) on delete cascade,
  encuesta  text not null check (length(encuesta) <= 60),
  resp      jsonb not null check (pg_column_size(resp) < 4000),
  creado    timestamptz not null default now()
);
create index if not exists escuadra_encuesta_owner on public.escuadra_encuesta (owner, encuesta);
alter table public.escuadra_encuesta enable row level security;
drop policy if exists "encuesta: responder" on public.escuadra_encuesta;
drop policy if exists "encuesta: leer lo mío" on public.escuadra_encuesta;
drop policy if exists "encuesta: borrar lo mío" on public.escuadra_encuesta;
create policy "encuesta: responder" on public.escuadra_encuesta for insert to anon, authenticated with check (true);
create policy "encuesta: leer lo mío" on public.escuadra_encuesta for select using (auth.uid() = owner);
create policy "encuesta: borrar lo mío" on public.escuadra_encuesta for delete using (auth.uid() = owner);
