/**
 * ═══════════════════════════════════════════════════════════════
 *  UPLA — Arquitectura de Software
 *  config.js  |  Configuración global compartida
 * ═══════════════════════════════════════════════════════════════
 *
 *  INSTRUCCIONES DE CONFIGURACIÓN SUPABASE:
 *  ─────────────────────────────────────────
 *  1. Ve a https://supabase.com y crea un proyecto
 *  2. Settings → API → copia Project URL y anon public key
 *  3. Reemplaza los valores SUPABASE_URL y SUPABASE_ANON_KEY
 *
 *  SQL PARA CREAR LAS TABLAS (ejecutar en SQL Editor):
 *  ─────────────────────────────────────────────────────
 *
 *  -- TABLA SEMANAS
 *  CREATE TABLE semanas (
 *    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *    numero_semana INTEGER NOT NULL,
 *    titulo        TEXT NOT NULL,
 *    descripcion   TEXT,
 *    created_at    TIMESTAMPTZ DEFAULT NOW()
 *  );
 *
 *  -- TABLA ARCHIVOS
 *  CREATE TABLE archivos (
 *    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *    semana_id  UUID REFERENCES semanas(id) ON DELETE CASCADE,
 *    nombre     TEXT NOT NULL,
 *    tipo       TEXT NOT NULL,
 *    url        TEXT NOT NULL,
 *    created_at TIMESTAMPTZ DEFAULT NOW()
 *  );
 *
 *  -- TABLA PERFIL
 *  CREATE TABLE perfil (
 *    id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *    nombre    TEXT,
 *    bio       TEXT,
 *    foto_url  TEXT,
 *    github    TEXT,
 *    linkedin  TEXT,
 *    correo    TEXT,
 *    carrera   TEXT DEFAULT 'Ingeniería de Sistemas',
 *    ubicacion TEXT DEFAULT 'Huancayo, Perú'
 *  );
 *
 *  -- TABLA PROYECTOS
 *  CREATE TABLE proyectos (
 *    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *    nombre       TEXT NOT NULL,
 *    descripcion  TEXT,
 *    tecnologias  TEXT,
 *    estado       TEXT DEFAULT 'En desarrollo',
 *    url          TEXT,
 *    created_at   TIMESTAMPTZ DEFAULT NOW()
 *  );
 *
 *  -- TABLA ACTIVIDAD
 *  CREATE TABLE actividad (
 *    id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *    fecha   DATE NOT NULL UNIQUE,
 *    nivel   INTEGER DEFAULT 0,
 *    detalle TEXT
 *  );
 *
 *  -- ROW LEVEL SECURITY
 *  ALTER TABLE semanas   ENABLE ROW LEVEL SECURITY;
 *  ALTER TABLE archivos  ENABLE ROW LEVEL SECURITY;
 *  ALTER TABLE perfil    ENABLE ROW LEVEL SECURITY;
 *  ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
 *  ALTER TABLE actividad ENABLE ROW LEVEL SECURITY;
 *
 *  -- POLÍTICAS (lectura pública / escritura solo admin)
 *  CREATE POLICY "pub_read_semanas"   ON semanas   FOR SELECT USING (true);
 *  CREATE POLICY "auth_write_semanas" ON semanas   FOR ALL    USING (auth.role()='authenticated');
 *  CREATE POLICY "pub_read_archivos"  ON archivos  FOR SELECT USING (true);
 *  CREATE POLICY "auth_write_archivos" ON archivos FOR ALL    USING (auth.role()='authenticated');
 *  CREATE POLICY "pub_read_perfil"    ON perfil    FOR SELECT USING (true);
 *  CREATE POLICY "auth_write_perfil"  ON perfil    FOR ALL    USING (auth.role()='authenticated');
 *  CREATE POLICY "pub_read_proyectos" ON proyectos FOR SELECT USING (true);
 *  CREATE POLICY "auth_write_proyectos" ON proyectos FOR ALL  USING (auth.role()='authenticated');
 *  CREATE POLICY "pub_read_actividad" ON actividad  FOR SELECT USING (true);
 *  CREATE POLICY "auth_write_actividad" ON actividad FOR ALL   USING (auth.role()='authenticated');
 *
 *  STORAGE:
 *  ─────────────────────────────────────────────────────
 *  Storage → New Bucket → nombre: "archivos-curso" → Public
 *  Storage → New Bucket → nombre: "fotos-perfil"   → Public
 *  Policies de cada bucket:
 *    SELECT: true (público)
 *    INSERT/DELETE: (auth.role() = 'authenticated')
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIGURACIÓN ───────────────────────────────────────────
const SUPABASE_URL      = 'https://aciktgjujhftdrtuvmca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaWt0Z2p1amhmdGRydHV2bWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzkyNzYsImV4cCI6MjA5MjExNTI3Nn0.8xoayByfku_mswQIsLCs68N4Hd9LZcmpAWFEnTCaD-A';
const BUCKET_ARCHIVOS   = 'archivos-curso';
const BUCKET_FOTOS      = 'fotos-perfil';

// ─── CLIENTE SUPABASE ────────────────────────────────────────
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── ESTADO GLOBAL ───────────────────────────────────────────
const APP = {
  usuario: null,
  tema: localStorage.getItem('tema') || 'dark',
};

// ─── TEMA ────────────────────────────────────────────────────
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  APP.tema = tema;
  localStorage.setItem('tema', tema);
}

// ─── HELPERS ─────────────────────────────────────────────────
const escHtml = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const escAttr = s => String(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const esperar = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);

function formatearTamaño(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1048576).toFixed(1)} MB`;
}

function detectarTipo(nombre) {
  const ext = nombre.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg','jpeg','png','gif','webp','svg','bmp','ico'].includes(ext)) return 'imagen';
  if (['doc','docx'].includes(ext)) return 'word';
  if (['xls','xlsx','csv'].includes(ext)) return 'excel';
  return 'otro';
}

function obtenerIconoTipo(tipo) {
  const mapa = {
    pdf:    { icon: 'fa-solid fa-file-pdf',   label: 'PDF',    color: 'pdf'   },
    imagen: { icon: 'fa-solid fa-image',       label: 'Imagen', color: 'imagen'},
    word:   { icon: 'fa-solid fa-file-word',   label: 'Word',   color: 'word'  },
    excel:  { icon: 'fa-solid fa-file-excel',  label: 'Excel',  color: 'excel' },
    otro:   { icon: 'fa-solid fa-file',        label: 'Archivo',color: 'otro'  },
  };
  return mapa[tipo] || mapa.otro;
}

// ─── TOAST ───────────────────────────────────────────────────
function mostrarToast(msg, tipo = 'info') {
  const c = $('toastContainer') || (() => {
    const d = document.createElement('div');
    d.id = 'toastContainer';
    d.className = 'toast-container';
    document.body.appendChild(d);
    return d;
  })();
  const iconos = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info', warn:'fa-triangle-exclamation' };
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  t.innerHTML = `<i class="fa-solid ${iconos[tipo]||iconos.info} toast-icon"></i><span>${escHtml(msg)}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(()=>t.remove(),300); }, 3000);
}

// ─── AUTH HELPERS ─────────────────────────────────────────────
async function verificarSesion() {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    APP.usuario = session.user;
    return true;
  }
  return false;
}

async function cerrarSesion() {
  await sb.auth.signOut();
  APP.usuario = null;
  mostrarToast('Sesión cerrada.', 'info');
  setTimeout(() => window.location.href = 'index.html', 800);
}

// ─── NAVBAR RENDERER ─────────────────────────────────────────
function renderNavbar(paginaActiva) {
  const nav = $('navbar');
  if (!nav) return;

  const links = [
    { href: 'index.html',    label: 'Home',     icon: 'fa-house'         },
    { href: 'semanas.html',  label: 'Semanas',  icon: 'fa-layer-group'   },
    { href: 'sobre-mi.html', label: 'Sobre mí', icon: 'fa-user-circle'   },
  ];

  const adminLink = APP.usuario
    ? `<a href="admin.html" class="nav-link ${paginaActiva==='admin'?'active':''}">
         <i class="fa-solid fa-shield-halved"></i> Admin
       </a>`
    : '';

  const temaIcon = APP.tema === 'dark' ? 'fa-sun' : 'fa-moon';

  nav.innerHTML = `
    <div class="nav-brand">
      <div class="nav-logo">
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
          <polygon points="25,3 47,15 47,35 25,47 3,35 3,15" fill="none" stroke="url(#ng)" stroke-width="1.5"/>
          <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="url(#ng)" font-family="Syne,sans-serif" font-size="11" font-weight="800">UPLA</text>
          <defs><linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00ff87"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient></defs>
        </svg>
      </div>
      <div class="nav-brand-text">
        <span class="brand-name">Arquitectura de software</span>
        <span class="brand-sub">UPLA 2026</span>
      </div>
    </div>

    <button class="nav-hamburger" id="navHamburger" aria-label="Menú">
      <span></span><span></span><span></span>
    </button>

    <div class="nav-menu" id="navMenu">
      ${links.map(l => `
        <a href="${l.href}" class="nav-link ${paginaActiva===l.label.toLowerCase().replace(' ','').replace('í','i')?'active':''}">
          <i class="fa-solid ${l.icon}"></i> ${l.label}
        </a>`).join('')}
      ${adminLink}
    </div>

    <div class="nav-actions">
      <button class="btn-tema" id="btnTema" title="Cambiar tema">
        <i class="fa-solid ${temaIcon}"></i>
      </button>
      ${APP.usuario
        ? `<div class="nav-user">
             <span class="user-dot"></span>
             <span class="user-label">Admin</span>
             <button class="btn-logout-nav" id="btnLogoutNav"><i class="fa-solid fa-right-from-bracket"></i></button>
           </div>`
        : `<button class="btn-nav-login" id="btnNavLogin">
             <i class="fa-solid fa-lock"></i> Login
           </button>`
      }
    </div>
  `;

  // Hamburger
  $('navHamburger')?.addEventListener('click', () => {
    $('navMenu')?.classList.toggle('open');
  });

  // Tema
  $('btnTema')?.addEventListener('click', () => {
    const nuevo = APP.tema === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevo);
    $('btnTema').querySelector('i').className = `fa-solid ${nuevo==='dark'?'fa-sun':'fa-moon'}`;
  });

  // Logout
  $('btnLogoutNav')?.addEventListener('click', cerrarSesion);

  // Login
  $('btnNavLogin')?.addEventListener('click', () => {
    $('modalLogin')?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
}

// ─── MODAL LOGIN (compartido) ────────────────────────────────
function renderModalLogin(onSuccess) {
  const existing = $('modalLogin');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modalLogin';
  modal.className = 'modal-overlay hidden';
  modal.innerHTML = `
    <div class="modal-card login-card">
      <button class="modal-close" id="closeLoginModal"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-header">
        <div class="modal-icon"><i class="fa-solid fa-shield-halved"></i></div>
        <h2>Acceso Admin</h2>
        <p>Solo administradores autorizados</p>
      </div>
      <form id="formLogin" class="modal-form">
        <div class="input-group">
          <label>Email</label>
          <div class="input-wrap">
            <i class="fa-solid fa-envelope"></i>
            <input type="email" id="loginEmail" placeholder="admin@upla.edu.pe" required/>
          </div>
        </div>
        <div class="input-group">
          <label>Contraseña</label>
          <div class="input-wrap">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="loginPassword" placeholder="••••••••" required/>
            <button type="button" id="togglePass" class="btn-icon-sm"><i class="fa-solid fa-eye"></i></button>
          </div>
        </div>
        <div class="login-error hidden" id="loginError">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span id="loginErrMsg">Credenciales incorrectas</span>
        </div>
        <button type="submit" class="btn-primary btn-block" id="loginSubmit">
          <span id="loginSubmitText">Ingresar</span>
          <i class="fa-solid fa-spinner fa-spin hidden" id="loginSpinner"></i>
        </button>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const cerrar = () => { modal.classList.add('hidden'); document.body.style.overflow=''; };
  $('closeLoginModal').addEventListener('click', cerrar);
  modal.addEventListener('click', e => { if(e.target===modal) cerrar(); });

  $('togglePass').addEventListener('click', () => {
    const inp = $('loginPassword');
    inp.type = inp.type==='password' ? 'text' : 'password';
    $('togglePass').querySelector('i').className = `fa-solid ${inp.type==='password'?'fa-eye':'fa-eye-slash'}`;
  });

  $('formLogin').addEventListener('submit', async e => {
    e.preventDefault();
    $('loginError').classList.add('hidden');
    $('loginSubmitText').classList.add('hidden');
    $('loginSpinner').classList.remove('hidden');
    $('loginSubmit').disabled = true;
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: $('loginEmail').value.trim(),
        password: $('loginPassword').value,
      });
      if (error) throw error;
      APP.usuario = data.user;
      cerrar();
      mostrarToast('Bienvenido, Administrador.', 'success');
      if (typeof onSuccess === 'function') onSuccess(data.user);
    } catch {
      $('loginErrMsg').textContent = 'Email o contraseña incorrectos.';
      $('loginError').classList.remove('hidden');
    } finally {
      $('loginSubmitText').classList.remove('hidden');
      $('loginSpinner').classList.add('hidden');
      $('loginSubmit').disabled = false;
    }
  });
}

// ─── FOOTER (compartido) ─────────────────────────────────────
function renderFooter() {
  const f = $('mainFooter');
  if (!f) return;
  f.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">UPLA</span>
        <span class="footer-tagline">Arquitectura de Software · 2026</span>
      </div>
      <div class="footer-socials">
        <a href="#" class="social-btn facebook" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#" class="social-btn linkedin" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="#" class="social-btn github"   title="GitHub"><i class="fa-brands fa-github"></i></a>
      </div>
      <div class="footer-info">
        <a href="mailto:info@upla.edu.pe"><i class="fa-solid fa-envelope"></i> info@upla.edu.pe</a>
        <span><i class="fa-solid fa-location-dot"></i> Huancayo, Junín, Perú</span>
        <span class="copyright">© ${new Date().getFullYear()} Universidad Peruana Los Andes</span>
      </div>
    </div>`;
}

// ─── PREVIEW MODAL ───────────────────────────────────────────
function abrirPreview(url, nombre, tipo) {
  let pm = $('previewModal');
  if (!pm) {
    pm = document.createElement('div');
    pm.id = 'previewModal';
    pm.className = 'modal-overlay hidden';
    pm.innerHTML = `
      <div class="modal-card preview-card">
        <div class="preview-bar">
          <span id="previewNombre">archivo</span>
          <div class="preview-bar-actions">
            <a id="previewDl" href="#" class="btn-icon-sm" title="Descargar"><i class="fa-solid fa-download"></i></a>
            <button id="closePreviewModal" class="btn-icon-sm"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <div id="previewContent" class="preview-content"></div>
      </div>`;
    document.body.appendChild(pm);
    pm.addEventListener('click', e => { if(e.target===pm) pm.classList.add('hidden'); });
    $('closePreviewModal').addEventListener('click', () => pm.classList.add('hidden'));
  }
  $('previewNombre').textContent = nombre;
  $('previewDl').href = url;
  $('previewDl').download = nombre;
  const body = $('previewContent');
  body.innerHTML = '';
  if (tipo === 'pdf') {
    body.innerHTML = `<iframe src="${url}" title="${escHtml(nombre)}"></iframe>`;
  } else if (tipo === 'imagen') {
    body.innerHTML = `<img src="${url}" alt="${escHtml(nombre)}" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px"/>`;
  } else if (tipo === 'word' || tipo === 'excel') {
    body.innerHTML = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true"></iframe>`;
  } else {
    body.innerHTML = `<div class="preview-unsupported">
      <i class="fa-solid fa-file-circle-question"></i>
      <p>Vista previa no disponible</p>
      <a href="${url}" download="${escHtml(nombre)}" class="btn-primary"><i class="fa-solid fa-download"></i> Descargar</a>
    </div>`;
  }
  pm.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// ─── INIT GLOBAL ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  aplicarTema(APP.tema);
  await verificarSesion();
  renderFooter();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
      document.body.style.overflow = '';
    }
  });
});
