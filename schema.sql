-- Escuadra · base de datos en Supabase
-- Pega TODO esto en Supabase → SQL Editor → New query → Run. Solo se corre una vez.
-- Cada fila es un "documento" de la app (configuración, grupo, lista de un día, actividad, planeación…).
-- Las reglas RLS hacen que SOLO tu usuario pueda leer o escribir tus datos.

create table if not exists public.escuadra_docs (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  key        text        not null,
  data       jsonb,
  deleted    boolean     not null default false,
  client_ts  timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create index if not exists escuadra_docs_user_updated on public.escuadra_docs (user_id, updated_at);

-- updated_at lo pone el servidor (sirve para bajar solo lo nuevo)
create or replace function public.escuadra_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

drop trigger if exists escuadra_docs_touch on public.escuadra_docs;
create trigger escuadra_docs_touch before insert or update on public.escuadra_docs
for each row execute function public.escuadra_touch();

alter table public.escuadra_docs enable row level security;

drop policy if exists "escuadra: leer lo mío"     on public.escuadra_docs;
drop policy if exists "escuadra: crear lo mío"    on public.escuadra_docs;
drop policy if exists "escuadra: editar lo mío"   on public.escuadra_docs;
drop policy if exists "escuadra: borrar lo mío"   on public.escuadra_docs;

create policy "escuadra: leer lo mío"   on public.escuadra_docs for select using (auth.uid() = user_id);
create policy "escuadra: crear lo mío"  on public.escuadra_docs for insert with check (auth.uid() = user_id);
create policy "escuadra: editar lo mío" on public.escuadra_docs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "escuadra: borrar lo mío" on public.escuadra_docs for delete using (auth.uid() = user_id);
