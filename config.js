/* Conexión opcional con Supabase.
   Si llenas estos dos valores, TODOS tus dispositivos se conectan solos (solo tendrás que iniciar sesión).
   Si los dejas vacíos, los capturas en la app: Ajustes → Sincronización.
   La "anon/publishable key" es pública por diseño; tus datos los protege la contraseña + las reglas RLS de schema.sql. */
window.ESCUADRA_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
