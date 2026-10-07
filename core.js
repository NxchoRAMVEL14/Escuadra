/* Escuadra · núcleo: utilidades, almacenamiento local, sincronización con Supabase y cálculos. */
(function () {
  'use strict';
  const E = window.E = window.E || {};
  const LS_DOCS = 'escuadra.docs.v1';
  const LS_META = 'escuadra.meta.v1';
  const EPOCH = '2000-01-01T00:00:00.000Z';
  const SUPA_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  E.XLSX_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

  /* ---------------- utilidades ---------------- */
  const u = E.u = {
    esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    uid(p) { return (p || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },
    now() { return new Date().toISOString(); },
    pad(n) { return String(n).padStart(2, '0'); },
    ymd(d) { return d.getFullYear() + '-' + u.pad(d.getMonth() + 1) + '-' + u.pad(d.getDate()); },
    parse(s) { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); },
    today() { return u.ymd(new Date()); },
    addDays(s, n) { const d = u.parse(s); d.setDate(d.getDate() + n); return u.ymd(d); },
    diffDays(a, b) { return Math.round((u.parse(b) - u.parse(a)) / 86400000); },
    dow(s) { return u.parse(s).getDay(); },
    DIAS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    DIAS3: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    MESES: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); },
    fLarga(s) { const d = u.parse(s); return u.DIAS[d.getDay()].toLowerCase() + ' ' + d.getDate() + ' de ' + u.MESES[d.getMonth()]; },
    fLargaA(s) { return u.fLarga(s) + ' de ' + u.parse(s).getFullYear(); },
    fFecha(s) { const d = u.parse(s); return u.pad(d.getDate()) + ' de ' + u.MESES[d.getMonth()] + ' de ' + d.getFullYear(); },
    fCorta(s) { const d = u.parse(s); return d.getDate() + ' ' + u.MESES[d.getMonth()].slice(0, 3); },
    fDM(s) { const d = u.parse(s); return u.pad(d.getDate()) + '/' + u.pad(d.getMonth() + 1); },
    round(n, d) { const f = Math.pow(10, d || 0); return Math.round((Number(n) + Number.EPSILON) * f) / f; },
    get(o, path) { return String(path).split('.').reduce((a, k) => a == null ? undefined : a[k], o); },
    set(o, path, v) {
      const ks = String(path).split('.'); let a = o;
      for (let i = 0; i < ks.length - 1; i++) { const k = ks[i]; if (a[k] == null || typeof a[k] !== 'object') a[k] = /^\d+$/.test(ks[i + 1]) ? [] : {}; a = a[k]; }
      a[ks[ks.length - 1]] = v;
    },
    clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
    norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, ' ').trim(); },
    toast(msg, kind, ms) {
      const box = document.getElementById('toasts'); if (!box) { console.log(msg); return; }
      const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg; box.appendChild(t);
      setTimeout(() => t.remove(), ms || 3400);
    },
    async copy(text) {
      try { await navigator.clipboard.writeText(text); return true; } catch (e) {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) { } ta.remove(); return ok;
      }
    },
    download(name, content, mime) {
      const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/octet-stream' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    },
    loadScript(src) {
      return new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = src; s.async = true;
        s.onload = () => res(); s.onerror = () => rej(new Error('No se pudo cargar ' + src + ' (¿sin internet?)'));
        document.head.appendChild(s);
      });
    }
  };

  /* ---------------- almacenamiento por documentos ---------------- */
  const S = E.store = {
    docs: {}, listeners: [],
    load() { try { this.docs = JSON.parse(localStorage.getItem(LS_DOCS) || '{}') || {}; } catch (e) { this.docs = {}; } },
    persist() { try { localStorage.setItem(LS_DOCS, JSON.stringify(this.docs)); } catch (e) { u.toast('No se pudo guardar en este dispositivo: ' + e.message, 'err', 6000); } },
    get(key) { const d = this.docs[key]; return d && !d.deleted ? d.data : undefined; },
    put(key, data, opt) {
      this.docs[key] = { data: data, ts: u.now(), dirty: true, deleted: false };
      this.persist(); if (E.sync) E.sync.schedule(); if (!(opt && opt.silent)) this.emit(key);
    },
    seed(key, data) { if (!this.docs[key]) this.docs[key] = { data: data, ts: EPOCH, dirty: false, deleted: false }; },
    del(key) {
      if (!this.docs[key]) return;
      this.docs[key] = { data: null, ts: u.now(), dirty: true, deleted: true };
      this.persist(); if (E.sync) E.sync.schedule(); this.emit(key);
    },
    keys(prefix) { return Object.keys(this.docs).filter(k => k.indexOf(prefix) === 0 && !this.docs[k].deleted); },
    list(prefix) { return this.keys(prefix).map(k => this.docs[k].data).filter(Boolean); },
    update(key, fn, fallback) { const cur = u.clone(this.get(key) !== undefined ? this.get(key) : fallback); const r = fn(cur); this.put(key, r === undefined ? cur : r); },
    on(fn) { this.listeners.push(fn); },
    emit(key) { this.listeners.forEach(f => { try { f(key); } catch (e) { console.error(e); } }); },
    dirtyCount() { return Object.values(this.docs).filter(d => d.dirty).length; }
  };

  /* ---------------- sincronización (Supabase, última escritura gana) ---------------- */
  const Y = E.sync = {
    client: null, user: null, state: 'local', msg: 'Solo en este dispositivo', timer: null, busy: false, started: false,
    meta() { try { return JSON.parse(localStorage.getItem(LS_META) || '{}') || {}; } catch (e) { return {}; } },
    setMeta(m) { localStorage.setItem(LS_META, JSON.stringify(Object.assign(this.meta(), m))); },
    creds() { const c = window.ESCUADRA_CONFIG || {}; const m = this.meta(); return { url: String(c.supabaseUrl || m.url || '').trim(), key: String(c.supabaseAnonKey || m.key || '').trim() }; },
    setState(s, msg) { this.state = s; this.msg = msg; S.emit('__sync'); },
    // traduce los errores de Supabase a qué paso de la guía revisar
    explica(e) {
      const m = String((e && (e.message || e.error_description)) || e || '');
      if (/escuadra_docs|42P01|does not exist|schema cache/i.test(m)) return 'Falta crear la tabla: corre el SQL del paso 2.';
      if (/Invalid login credentials/i.test(m)) return 'Correo o contraseña incorrectos (paso 3).';
      if (/Email not confirmed/i.test(m)) return 'Tu usuario no está confirmado: créalo con "Auto Confirm User" (paso 3).';
      if (/Invalid API key|No API key|apikey|JWT/i.test(m)) return 'La llave no es la correcta: copia la "anon public" o "publishable" (paso 5).';
      if (/Failed to fetch|NetworkError|Load failed|ERR_NAME/i.test(m)) return 'No se pudo llegar a Supabase: revisa la URL (paso 5) o tu internet.';
      return m;
    },
    async init() {
      const cr = this.creds();
      if (!cr.url || !cr.key) { this.setState('local', 'Solo en este dispositivo · conecta Supabase en Ajustes'); return; }
      try {
        if (!window.supabase) await u.loadScript(SUPA_CDN);
        this.client = window.supabase.createClient(cr.url, cr.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'escuadra-auth' } });
        const r = await this.client.auth.getSession();
        this.user = (r.data && r.data.session && r.data.session.user) || null;
        this.client.auth.onAuthStateChange((_e, session) => {
          const prev = this.user; this.user = (session && session.user) || null;
          if (this.user && !prev) this.now(); if (!this.user) this.setState('auth', 'Inicia sesión para sincronizar');
        });
        if (this.user) this.now(); else this.setState('auth', 'Inicia sesión para sincronizar');
        if (!this.started) {
          this.started = true;
          window.addEventListener('online', () => this.now());
          setInterval(() => this.now(), 90000);
          document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.now(); });
        }
      } catch (e) { console.error(e); this.setState('error', 'No se pudo conectar con Supabase: ' + this.explica(e)); }
    },
    schedule() { clearTimeout(this.timer); this.timer = setTimeout(() => this.now(), 2500); },
    async login(email, pw) {
      if (!this.client) await this.init();
      if (!this.client) throw new Error('Primero guarda la URL y la llave de Supabase');
      const r = await this.client.auth.signInWithPassword({ email: email, password: pw });
      if (r.error) throw r.error;
      this.user = r.data.user; await this.now();
    },
    async logout() { if (this.client) await this.client.auth.signOut(); this.user = null; this.setState('auth', 'Sesión cerrada'); },
    async now() {
      if (!this.client || !this.user || this.busy) return;
      if (!navigator.onLine) { this.setState('offline', 'Sin internet · ' + S.dirtyCount() + ' cambios por subir'); return; }
      this.busy = true; this.setState('syncing', 'Sincronizando…');
      try {
        await this.pull(); await this.push();
        this.setMeta({ lastSyncAt: u.now() });
        this.setState('ok', 'Sincronizado ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
      } catch (e) { console.error(e); this.setState('error', 'Error al sincronizar: ' + this.explica(e)); }
      finally { this.busy = false; }
    },
    async pull() {
      let since = this.meta().lastPull || '1970-01-01T00:00:00Z'; let changed = false;
      for (let page = 0; page < 50; page++) {
        const r = await this.client.from('escuadra_docs').select('key,data,deleted,client_ts,updated_at').gt('updated_at', since).order('updated_at', { ascending: true }).limit(1000);
        if (r.error) throw r.error;
        const rows = r.data || [];
        rows.forEach(row => {
          const loc = S.docs[row.key]; const rts = Date.parse(row.client_ts); const lts = loc ? Date.parse(loc.ts) : 0;
          if (!loc || (!loc.dirty && rts !== lts) || (loc.dirty && rts > lts)) {
            S.docs[row.key] = { data: row.data, ts: new Date(rts).toISOString(), dirty: false, deleted: !!row.deleted }; changed = true;
          }
        });
        if (rows.length) since = rows[rows.length - 1].updated_at;
        if (rows.length < 1000) break;
      }
      this.setMeta({ lastPull: since });
      if (changed) { S.persist(); S.emit('__pull'); }
    },
    async push() {
      const entries = Object.entries(S.docs).filter(e => e[1].dirty);
      for (let i = 0; i < entries.length; i += 200) {
        const chunk = entries.slice(i, i + 200);
        const rows = chunk.map(e => ({ user_id: this.user.id, key: e[0], data: e[1].data, deleted: !!e[1].deleted, client_ts: e[1].ts }));
        const r = await this.client.from('escuadra_docs').upsert(rows, { onConflict: 'user_id,key' });
        if (r.error) throw r.error;
        chunk.forEach(e => { const cur = S.docs[e[0]]; if (cur && cur.ts === e[1].ts) cur.dirty = false; });
      }
      if (entries.length) S.persist();
    }
  };

  E.SCHEMA_SQL = `-- Escuadra · base de datos en Supabase
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
create policy "escuadra: borrar lo mío" on public.escuadra_docs for delete using (auth.uid() = user_id);`;

  /* ---------------- acceso a datos ---------------- */
  const D = E.data = {
    cfg() { const raw = S.get('config') || {}; const d = E.DEFAULTS.config; return Object.assign({}, d, raw, { pond: Object.assign({}, d.pond, raw.pond || {}) }); },
    parciales() { return S.get('parciales') || E.DEFAULTS.parciales; },
    grupos() { return S.list('grupo:').sort((a, b) => String(a.id).localeCompare(String(b.id))); },
    grupo(id) { return S.get('grupo:' + id); },
    grupoActual() { const c = D.cfg(); return D.grupo(c.grupoActivo) || D.grupos()[0] || null; },
    alumnos(g, todos) { return ((g && g.alumnos) || []).filter(a => todos || a.activo !== false).slice().sort((a, b) => a.num - b.num); },
    alumno(g, id) { return ((g && g.alumnos) || []).find(a => a.id === id); },
    submodulo(g, pid) {
      if (!g) return null; const m = E.PROGRAMA.modulos[g.modulo]; const n = g.submodulos && g.submodulos[pid];
      if (!m || !n || !m.sub[n]) return null;
      return Object.assign({ num: n, modulo: g.modulo, moduloNombre: m.nombre }, m.sub[n]);
    },
    manual(g, pid) { const m = (S.get('manual:' + g.id) || {})[pid]; return m || { activo: false, alumnos: {} }; },
    planes(gid) { return S.list('plan:').filter(p => !gid || p.grupoId === gid).sort((a, b) => String(a.parcial).localeCompare(String(b.parcial))); },
    mejoras() { return S.get('mejoras') || []; },
    favs() { return S.get('favs') || []; }
  };

  /* ---------------- cálculos ---------------- */
  const C = E.calc = {
    parcial(pid) { return D.parciales().find(p => p.id === pid); },
    parcialActual(f) { f = f || u.today(); const ps = D.parciales(); return ps.find(p => f >= p.inicio && f <= p.fin) || ps.find(p => f < p.inicio) || ps[ps.length - 1]; },
    bloquesDia(g, f) { const d = u.dow(f); return ((g && g.horario) || []).filter(b => Number(b.dia) === d).sort((a, b) => String(a.inicio).localeCompare(String(b.inicio))); },
    horasDia(g, f) { return C.bloquesDia(g, f).reduce((a, b) => a + Number(b.horas || 0), 0); },
    esAsueto(f) { return D.parciales().some(p => (p.asuetos || []).indexOf(f) >= 0); },
    enParcial(f) { return D.parciales().some(p => f >= p.inicio && f <= p.fin); },
    esClase(g, f) { return !!g && C.horasDia(g, f) > 0 && !C.esAsueto(f) && C.enParcial(f) && (!g.inicioDocente || f >= g.inicioDocente); },
    inicioEfectivo(g, p) { return g && g.inicioDocente && g.inicioDocente > p.inicio ? g.inicioDocente : p.inicio; },
    clases(g, p) {
      const out = []; if (!g || !p) return out;
      for (let f = C.inicioEfectivo(g, p); f <= p.fin; f = u.addDays(f, 1)) { const h = C.horasDia(g, f); if (h > 0 && !C.esAsueto(f)) out.push({ fecha: f, horas: h }); }
      return out;
    },
    siguienteClase(g, f) { for (let i = 1; i <= 150; i++) { const d = u.addDays(f, i); if (C.esClase(g, d)) return d; } return null; },
    claseAnterior(g, f) { for (let i = 1; i <= 150; i++) { const d = u.addDays(f, -i); if (C.esClase(g, d)) return d; } return null; },
    fechaListaDefault(g, hoy) { if (C.esClase(g, hoy)) return hoy; return C.claseAnterior(g, hoy) || C.siguienteClase(g, hoy) || hoy; },
    horas(g, p) {
      const cl = C.clases(g, p), hoy = u.today(); const sm = D.submodulo(g, p.id);
      let disp = 0, imp = 0, di = 0; cl.forEach(c => { disp += c.horas; if (c.fecha <= hoy) { imp += c.horas; di++; } });
      return { disp: disp, imp: imp, dias: cl.length, diasImp: di, programa: sm ? sm.horas : null };
    },
    fechasRegistradas(g, p) { const pre = 'asis:' + g.id + ':'; return S.keys(pre).map(k => k.slice(pre.length)).filter(f => f >= p.inicio && f <= p.fin).sort(); },
    fechasLista(g, p) { const set = {}; C.clases(g, p).forEach(c => { set[c.fecha] = 1; }); C.fechasRegistradas(g, p).forEach(f => { set[f] = 1; }); return Object.keys(set).sort(); },
    cuenta(st) { const c = D.cfg(); return st === 'A' || (st === 'R' && c.retardoCuenta) || (st === 'J' && c.justCuenta); },
    asis(g, p, aid) {
      const c = D.cfg(); const r = { ses: 0, a: 0, f: 0, ret: 0, j: 0, hs: 0, ha: 0, hf: 0, racha: 0, pct: null, fechasF: [] };
      C.fechasRegistradas(g, p).forEach(f => {
        const doc = S.get('asis:' + g.id + ':' + f) || {}; const st = doc[aid] || 'A'; const h = C.horasDia(g, f) || 1;
        r.ses++; r.hs += h; if (st === 'R') r.ret++; if (st === 'J') r.j++;
        if (C.cuenta(st)) { r.a++; r.ha += h; r.racha = 0; } else { r.f++; r.hf += h; r.racha++; r.fechasF.push(f); }
      });
      if (r.ses) r.pct = c.conteoActa === 'horas' ? r.ha / r.hs * 100 : r.a / r.ses * 100;
      return r;
    },
    partRegistrada(g, p) { const pre = 'part:' + g.id + ':'; return S.keys(pre).some(k => { const f = k.slice(pre.length); return f >= p.inicio && f <= p.fin; }); },
    part(g, p, aid) {
      const pre = 'part:' + g.id + ':'; let n = 0;
      S.keys(pre).forEach(k => { const f = k.slice(pre.length); if (f < p.inicio || f > p.fin) return; n += Number((S.get(k) || {})[aid] || 0); });
      return n;
    },
    acts(g, pid) {
      return S.list('act:' + g.id + ':').filter(a => a.parcial === pid)
        .sort((a, b) => String(a.fecha || '9999').localeCompare(String(b.fecha || '9999')) || String(a.nombre).localeCompare(String(b.nombre)));
    },
    // puntos máximos de una actividad (ej. examen de 94 puntos); 100 si no se indica
    maxPts(a) { const m = Number(a && a.max); return m > 0 ? m : 100; },
    // calificación de una actividad convertida a base 100 (null si no tiene)
    nota(a, aid) { const v = a && a.notas && a.notas[aid]; if (v === '' || v == null || isNaN(Number(v))) return null; return Math.max(0, Math.min(100, Number(v) / C.maxPts(a) * 100)); },
    actStats(a, al) {
      let cap = 0, s = 0; al.forEach(x => { const v = C.nota(a, x.id); if (v != null) { cap++; s += v; } });
      return { capturadas: cap, faltan: al.length - cap, prom: cap ? s / cap : null };
    },
    promCat(g, pid, cat, aid) {
      const c = D.cfg(); const as = C.acts(g, pid).filter(a => a.categoria === cat && a.cuenta !== false);
      if (!as.length) return null; let sw = 0, s = 0;
      const hoy = u.today();
      as.forEach(a => {
        const w = Number(a.peso || 1); let v = C.nota(a, aid);
        // vacío = 0 solo si ya pasó la fecha de entrega; si no, aún no cuenta
        if (v == null) { if (!c.vaciasCero || !a.fecha || a.fecha >= hoy) return; v = 0; }
        s += v * w; sw += w;
      });
      return sw ? s / sw : null;
    },
    cal(g, pid, aid) {
      const c = D.cfg(); const p = C.parcial(pid); const man = D.manual(g, pid);
      if (man.activo) {
        const r = (man.alumnos || {})[aid] || {};
        return { manual: true, final: (r.cal === '' || r.cal == null) ? null : Number(r.cal), asis: r.asis, fal: r.fal, enCurso: false, comp: {} };
      }
      const comp = { examen: C.promCat(g, pid, 'examen', aid), trabajos: C.promCat(g, pid, 'trabajos', aid) };
      const as = C.asis(g, p, aid); comp.asistencia = as.pct;
      const np = C.part(g, p, aid); comp.participacion = C.partRegistrada(g, p) ? Math.min(100, np / (Number(c.metaPart) || 10) * 100) : null;
      let sw = 0, s = 0; const falta = [];
      ['examen', 'trabajos', 'asistencia', 'participacion'].forEach(k => { const w = Number(c.pond[k] || 0); if (!w) return; if (comp[k] == null) { falta.push(k); return; } s += comp[k] * w; sw += w; });
      const final = sw ? u.round(s / sw, 0) : null;
      return { manual: false, comp: comp, final: final, enCurso: falta.length > 0, falta: falta, np: np, as: as };
    },
    finalSem(g, aid) {
      const v = D.parciales().map(p => C.cal(g, p.id, aid).final); const ok = v.filter(x => x != null);
      return { parciales: v, final: ok.length ? u.round(ok.reduce((a, b) => a + b, 0) / ok.length, 0) : null, completo: ok.length === v.length };
    },
    escala(v) { return Number(D.cfg().escalaActa) === 10 ? u.round(v / 10, 1) : v; },
    actaFila(g, aid) {
      const c = D.cfg(); const row = [];
      D.parciales().forEach(p => {
        const k = C.cal(g, p.id, aid); let as = '', fa = '';
        if (k.manual) { as = k.asis == null ? '' : k.asis; fa = k.fal == null ? '' : k.fal; }
        else { const a = C.asis(g, p, aid); if (a.ses) { as = c.conteoActa === 'horas' ? a.ha : a.a; fa = c.conteoActa === 'horas' ? a.hf : a.f; } }
        row.push(k.final == null ? '' : C.escala(k.final), as, fa);
      });
      const fs = C.finalSem(g, aid); row.push(fs.final == null ? '' : C.escala(fs.final));
      return row;
    },
    riesgos(g, p) {
      const c = D.cfg(); const out = []; if (!g || !p) return out;
      D.alumnos(g).forEach(a => {
        const as = C.asis(g, p, a.id);
        if (as.racha >= 2) out.push({ id: a.id, nombre: a.nombre, kind: 'bad', txt: as.racha + ' faltas seguidas' });
        else if (as.ses >= 3 && as.pct != null && as.pct < c.minAsis) out.push({ id: a.id, nombre: a.nombre, kind: 'warn', txt: 'Asistencia ' + Math.round(as.pct) + '%' });
        const k = C.cal(g, p.id, a.id);
        if (!k.manual && k.final != null && k.final < c.minAprob && C.acts(g, p.id).length) out.push({ id: a.id, nombre: a.nombre, kind: 'bad', txt: 'Va en ' + k.final + (k.enCurso ? '*' : '') });
      });
      return out;
    },
    avisos(hoy) {
      const out = []; const ps = D.parciales(); const g = D.grupoActual();
      ps.forEach(p => {
        const dc = u.diffDays(hoy, p.captura);
        if (dc >= 0 && dc <= 7) out.push({ key: 'cap-' + p.id, nivel: dc <= 2 ? 'bad' : 'warn', txt: (dc === 0 ? 'Hoy' : 'En ' + dc + (dc === 1 ? ' día' : ' días')) + ' capturas calificaciones del ' + p.nombre + ' (' + u.fCorta(p.captura) + ').' });
        const df = u.diffDays(hoy, p.fin);
        if (df >= 0 && df <= 5) out.push({ key: 'fin-' + p.id, nivel: 'warn', txt: 'El ' + p.nombre + ' cierra el ' + u.fLarga(p.fin) + ': aplica examen y cierra proyecto y bitácora.' });
        const di = u.diffDays(hoy, p.inicio);
        if (g && di > 0 && di <= 7 && !D.planes(g.id).some(pl => pl.parcial === p.id)) out.push({ key: 'plan-' + p.id, nivel: 'info', txt: 'El ' + p.nombre + ' inicia en ' + di + ' días y aún no tiene planeación.' });
      });
      const man = u.addDays(hoy, 1); if (C.esAsueto(man)) out.push({ key: 'asu-' + man, nivel: 'info', txt: 'Mañana es asueto: no hay clases.' });
      return out;
    }
  };

  /* ---------------- planeaciones ---------------- */
  const ORD = { P1: '1er', P2: '2do', P3: '3er' };
  E.planes = {
    nueva(g, pid) {
      const p = C.parcial(pid); const sm = D.submodulo(g, pid); const m = E.PROGRAMA.modulos[g.modulo]; const c = D.cfg();
      if (!sm) throw new Error('Configura el submódulo de este parcial en Ajustes → Grupo.');
      const h = C.horas(g, p).disp; const ap = Math.max(1, Math.round(h * 0.1)), ci = Math.max(1, Math.round(h * 0.17)), de = Math.max(0, h - ap - ci);
      const ei = Math.round(h * 0.25);
      return {
        id: u.uid('plan'), grupoId: g.id, parcial: pid, modulo: g.modulo, sm: sm.num, estado: 'Borrador', origen: 'Generada desde el programa 2024',
        ident: { parcialTxt: ORD[pid] || pid, elaboracion: 'Individual', docente: c.docente, fechas: u.fFecha(p.inicio) + ' al ' + u.fFecha(p.fin), grupoTxt: g.grupo, horasMD: h, horasEI: ei, horasTot: h + ei },
        resModulo: m.resultados.slice(), resSM: (m.resultados[Number(sm.num)] || sm.nombre) + '.',
        proceso: sm.ac.map(a => a.titulo), desarrollo: [].concat.apply([], sm.ac.map(a => a.desarrollo || [])),
        transv: { fund: ['Pensamiento Matemático'], amp: [], hvyt: ['Colaboración y trabajo en equipo', 'Resolución de problemas'], cocends: [] },
        paec: '', paecEvid: '', uac: [{}, {}, {}],
        estrategia: { diag: 'Cuestionario diagnóstico', form: 'Supervisión y retroalimentación durante las prácticas', sum: 'Evaluación práctica del producto final y defensa' },
        practicas: ['Demostrativa: ', 'Guiada: ', 'Supervisada: ', 'Autónoma: '],
        secuencia: {
          apertura: { periodo: '', horas: ap, ei: '', desc: '', tecnicas: [], evidencias: [], eval: { H: true }, instr: { Exa: true }, otro: '', pond: 10 },
          desarrollo: { periodo: '', horas: de, ei: '', desc: '', tecnicas: [], evidencias: [], eval: { C: true, H: true }, instr: { LC: true }, otro: '', pond: 40 },
          cierre: { periodo: '', horas: ci, ei: '', desc: '', tecnicas: [], evidencias: [], eval: { A: true, H: true }, instr: { R: true }, otro: '', pond: 50 }
        },
        recursos: { material: ['FreeCAD 1.x'], equipo: ['Computadoras del plantel con FreeCAD'], fuentes: [E.FUENTE_PROGRAMA].concat(m.fuentes || []) },
        valida: { elaboro: c.docente, reviso: '', avalo: '' }, notas: ''
      };
    },
    ajustarHoras(pl) {
      const g = D.grupo(pl.grupoId) || D.grupoActual(); const p = C.parcial(pl.parcial); if (!g || !p) return pl;
      const disp = C.horas(g, p).disp; const s = pl.secuencia || {}; const ks = ['apertura', 'desarrollo', 'cierre'];
      const tot = ks.reduce((a, k) => a + Number((s[k] || {}).horas || 0), 0) || 1;
      let acc = 0; ks.forEach(k => { s[k] = s[k] || {}; if (k !== 'desarrollo') { s[k].horas = Math.max(1, Math.round(Number(s[k].horas || 0) / tot * disp)); acc += s[k].horas; } });
      s.desarrollo.horas = Math.max(0, disp - acc);
      const ei = Math.round(disp * 0.25);
      pl.ident = Object.assign({}, pl.ident, { horasMD: disp, horasEI: ei, horasTot: disp + ei });
      return pl;
    },
    validar(pl) {
      const out = []; const g = D.grupo(pl.grupoId); const p = C.parcial(pl.parcial); const m = E.PROGRAMA.modulos[pl.modulo]; const sm = m && m.sub[pl.sm];
      if (!sm) { out.push({ n: 'bad', t: 'El submódulo no existe en el programa.' }); return out; }
      out.push({ n: 'ok', t: 'Módulo ' + pl.modulo + ' "' + m.nombre + '" y Submódulo ' + pl.sm + ' "' + sm.nombre + '" según el programa 2024 (p. ' + m.pag + ').' });
      const s = pl.secuencia || {}; const ks = ['apertura', 'desarrollo', 'cierre'];
      const pond = ks.reduce((a, k) => a + Number((s[k] || {}).pond || 0), 0);
      out.push(pond === 100 ? { n: 'ok', t: 'Las ponderaciones suman 100 %.' } : { n: 'bad', t: 'Las ponderaciones suman ' + pond + ' % (deben sumar 100 %).' });
      const hs = ks.reduce((a, k) => a + Number((s[k] || {}).horas || 0), 0); const md = Number((pl.ident || {}).horasMD || 0);
      if (hs !== md) out.push({ n: 'warn', t: 'Los momentos suman ' + hs + ' h y la identificación dice ' + md + ' h de mediación docente.' });
      if (g && p) {
        const h = C.horas(g, p);
        if (hs > h.disp) out.push({ n: 'bad', t: 'Planeaste ' + hs + ' h, pero tu calendario solo tiene ' + h.disp + ' h de clase en el ' + p.nombre + '. Usa "Ajustar horas".' });
        else out.push({ n: 'ok', t: 'Cabe en tu calendario: ' + hs + ' de ' + h.disp + ' h disponibles.' });
        if (sm.horas && h.disp < sm.horas) out.push({ n: 'info', t: 'El programa marca ' + sm.horas + ' h para este submódulo y tu calendario da ' + h.disp + ' h: prioriza las actividades clave.' });
      }
      const proc = u.norm((pl.proceso || []).join(' | '));
      const faltan = sm.ac.filter(a => proc.indexOf(u.norm(a.titulo).slice(0, 30)) < 0);
      out.push(faltan.length ? { n: 'warn', t: 'No aparecen estas actividades clave del programa: ' + faltan.map(a => '"' + a.titulo + '"').join(', ') + '.' } : { n: 'ok', t: 'Incluye las ' + sm.ac.length + ' actividades clave del submódulo.' });
      if (!(pl.desarrollo || []).length) out.push({ n: 'bad', t: '"Desarrollo de la competencia" está vacío.' });
      const tv = pl.transv || {};
      if (!(tv.hvyt || []).length) out.push({ n: 'warn', t: 'Marca al menos una Habilidad para la Vida y el Trabajo.' });
      if (!(tv.fund || []).length) out.push({ n: 'warn', t: 'Marca al menos un recurso del Currículum fundamental.' });
      if (!pl.paec) out.push({ n: 'warn', t: 'Falta el nombre de la evidencia articuladora o PAEC.' });
      if (!(pl.ident || {}).fechas) out.push({ n: 'warn', t: 'Faltan las fechas de inicio y cierre.' });
      const cp = D.cfg().pond;
      out.push({ n: 'info', t: 'Tu calificación real es Examen ' + cp.examen + ' · Libreta/Proyecto/Bitácora ' + cp.trabajos + ' · Asistencia ' + cp.asistencia + ' · Participación ' + cp.participacion + '. La planeación pondera por momento didáctico; si coordinación pide que coincidan, ajústalo aquí.' });
      return out;
    }
  };

  /* ---------------- datos iniciales ---------------- */
  E.seed = function () {
    S.seed('config', {});
    S.seed('parciales', u.clone(E.DEFAULTS.parciales));
    S.seed('grupo:3AMEC', u.clone(E.DEFAULTS.grupo3AMEC));
    S.seed('manual:3AMEC', { P1: { activo: true, alumnos: {} } });
    (E.PLAN_SEEDS || []).forEach(p => S.seed('plan:' + p.id, u.clone(p)));
    S.persist();
  };

  // Repara una importación equivocada: renglones de código pegados como nombres de alumnos.
  E.esNombreRaro = n => /[\[\]{}"]|:\s*\[|^\s*[\],]+\s*$/.test(String(n || ''));
  E.reparar = function () {
    let total = 0;
    S.keys('grupo:').forEach(k => {
      const g = S.get(k); if (!g || !Array.isArray(g.alumnos)) return;
      const malos = g.alumnos.filter(a => E.esNombreRaro(a.nombre)); if (!malos.length) return;
      total += malos.length;
      S.update(k, gr => {
        gr.alumnos = gr.alumnos.filter(a => !E.esNombreRaro(a.nombre));
        // quienes esa importación dejó como baja vuelven a estar activos con su número original
        gr.alumnos.forEach(a => { if (a.activo === false && Number(a.num) >= 900) { a.activo = true; a.num = Number(a.num) - 900; } });
      });
    });
    if (total) setTimeout(() => u.toast('Reparé tu lista: quité ' + total + ' renglones que no eran alumnos.', 'ok', 7000), 800);
    // v1.4: lugar de cada bloque; este semestre los viernes (4 h) son en el centro de cómputo
    const g3 = S.get('grupo:3AMEC');
    if (g3 && Array.isArray(g3.horario) && g3.horario.length && !g3.horario.some(b => b.lugar)) {
      S.update('grupo:3AMEC', gr => { gr.horario.forEach(b => { b.lugar = Number(b.dia) === 5 ? 'computo' : 'aula'; }); });
    }
    return total;
  };

  /* ---------------- notificaciones del sistema ---------------- */
  E.notify = {
    async pedir() {
      if (!('Notification' in window)) { u.toast('Este navegador no permite notificaciones', 'err'); return; }
      const r = await Notification.requestPermission();
      u.toast(r === 'granted' ? 'Notificaciones activadas' : 'No se activaron las notificaciones', r === 'granted' ? 'ok' : 'err');
      if (r === 'granted') E.notify.check(true);
      if (E.render) E.render();
    },
    check(force) {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const hoy = u.today(); let sent = {}; try { sent = JSON.parse(localStorage.getItem('escuadra.notif') || '{}'); } catch (e) { }
      C.avisos(hoy).forEach(m => {
        const k = m.key + '@' + hoy; if (sent[k] && !force) return; sent[k] = 1;
        const show = () => { try { new Notification('Escuadra', { body: m.txt, icon: 'icon-192.png', tag: m.key }); } catch (e) { } };
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification('Escuadra', { body: m.txt, icon: 'icon-192.png', tag: m.key })).catch(show);
        } else show();
      });
      localStorage.setItem('escuadra.notif', JSON.stringify(sent));
    }
  };
})();
