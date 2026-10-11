-- Escuadra · espacio PRIVADO para las fotos de evidencias (Supabase Storage)
-- Pega esto en Supabase → SQL Editor → New query → Run. Solo se corre una vez.
-- Cada usuario solo puede ver, subir y borrar las fotos de su propia carpeta (la carpeta lleva su id).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidencias', 'evidencias', false, 3145728, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "escuadra evidencias: ver lo mío" on storage.objects;
drop policy if exists "escuadra evidencias: subir lo mío" on storage.objects;
drop policy if exists "escuadra evidencias: borrar lo mío" on storage.objects;

create policy "escuadra evidencias: ver lo mío" on storage.objects for select to authenticated
  using (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
create policy "escuadra evidencias: subir lo mío" on storage.objects for insert to authenticated
  with check (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
create policy "escuadra evidencias: borrar lo mío" on storage.objects for delete to authenticated
  using (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
