# 📚 Arquitectura de Software — UPLA

<div align="center">

![UPLA](https://img.shields.io/badge/UPLA-Universidad%20Peruana%20Los%20Andes-00ff87?style=for-the-badge)
![Estado](https://img.shields.io/badge/Estado-Activo-00ff87?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Repositorio académico de materiales semanales del curso de Arquitectura de Software**

[🌐 Ver demo](#) · [🐛 Reportar error](../../issues) · [💡 Sugerir mejora](../../issues)

</div>

---

## 📋 Tabla de contenidos

- [Vista previa](#-vista-previa)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Configuración de Supabase](#-configuración-de-supabase)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Base de datos](#-base-de-datos)
- [Uso del sistema](#-uso-del-sistema)
- [Capturas de pantalla](#-capturas-de-pantalla)

---

## 🖼️ Vista previa

> Plataforma web tipo portafolio profesional para gestionar y visualizar materiales académicos del curso de Arquitectura de Software de la Universidad Peruana Los Andes (UPLA).

**Páginas disponibles:**
- 🏠 `index.html` — Home con buscador global y estadísticas
- 📅 `semanas.html` — Repositorio de semanas con filtros avanzados
- 👤 `sobre-mi.html` — Perfil estilo GitHub con calendario de actividad
- 🔐 `admin.html` — Panel de administración protegido

---

## ✨ Características

### Públicas (sin login)
- ✅ Visualizar todas las semanas del curso en tarjetas
- ✅ Filtrar archivos por tipo: PDF, Imágenes, Word, Excel, Otros
- ✅ Ordenar semanas por número o nombre
- ✅ **Búsqueda global** en tiempo real
- ✅ **Vista previa** de PDF e imágenes sin descargar
- ✅ Descargar cualquier archivo
- ✅ Ver perfil del estudiante estilo GitHub
- ✅ **Calendario de actividad** tipo heatmap
- ✅ Ver proyectos del portafolio
- ✅ **Modo oscuro / claro** con toggle
- ✅ Diseño 100% responsive

### Admin (con login)
- ✅ Crear, editar y eliminar semanas
- ✅ Subir archivos con **drag & drop** y barra de progreso
- ✅ Eliminar archivos del storage
- ✅ Editar perfil y cambiar foto
- ✅ Agregar, editar y eliminar proyectos
- ✅ Dashboard con estadísticas en tiempo real
- ✅ **Protección de ruta** — sin login no se accede al panel

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica de todas las páginas |
| **CSS3** | Estilos, variables, animaciones, responsive |
| **JavaScript (Vanilla)** | Lógica, DOM, eventos, fetch |
| **Supabase Auth** | Autenticación del administrador |
| **Supabase Database** | PostgreSQL para semanas, archivos, perfil, proyectos |
| **Supabase Storage** | Almacenamiento de archivos y fotos |
| **Font Awesome 6** | Iconografía |
| **Google Fonts** | Tipografías (Syne, DM Mono, Outfit) |
| **Vercel** | Hosting y despliegue continuo |

---

## 📁 Estructura del proyecto

```
arquitectura-software-upla/
│
├── index.html          # Página principal (Home)
├── semanas.html        # Repositorio de semanas
├── sobre-mi.html       # Perfil del estudiante
├── admin.html          # Panel de administración
│
├── styles.css          # Estilos globales + tema oscuro/claro
├── config.js           # Configuración Supabase + helpers compartidos
│
└── README.md           # Este archivo
```

---

## ⚙️ Configuración de Supabase

### Paso 1 — Crear cuenta y proyecto

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Haz clic en **"New project"**
3. Completa:
   - **Name:** `arquitectura-software-upla`
   - **Database Password:** elige una contraseña segura (guárdala)
   - **Region:** `South America (São Paulo)` ← mejor latencia desde Perú
4. Espera ~2 minutos a que el proyecto se inicialice

---

### Paso 2 — Obtener credenciales

1. En tu proyecto, ve a **Settings** (ícono de engranaje) → **API**
2. Copia estos dos valores:

```
Project URL:  https://xxxxxxxxxxx.supabase.co
anon public:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Abre el archivo `config.js` y reemplaza:

```js
const SUPABASE_URL      = 'https://xxxxxxxxxxx.supabase.co';  // ← tu URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJI...';                  // ← tu anon key
```

---

### Paso 3 — Crear las tablas

1. En tu proyecto de Supabase, ve a **SQL Editor** → **New query**
2. Pega y ejecuta el siguiente SQL completo:

```sql
-- ═══════════════════════════════════════════
--  TABLAS
-- ═══════════════════════════════════════════

CREATE TABLE semanas (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_semana INTEGER NOT NULL,
  titulo        TEXT NOT NULL,
  descripcion   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE archivos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  semana_id  UUID REFERENCES semanas(id) ON DELETE CASCADE,
  nombre     TEXT NOT NULL,
  tipo       TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE perfil (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre    TEXT,
  bio       TEXT,
  foto_url  TEXT,
  github    TEXT,
  linkedin  TEXT,
  correo    TEXT,
  carrera   TEXT DEFAULT 'Ingeniería de Sistemas',
  ubicacion TEXT DEFAULT 'Huancayo, Perú'
);

CREATE TABLE proyectos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre       TEXT NOT NULL,
  descripcion  TEXT,
  tecnologias  TEXT,
  estado       TEXT DEFAULT 'En desarrollo',
  url          TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE actividad (
  id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha   DATE NOT NULL UNIQUE,
  nivel   INTEGER DEFAULT 0,
  detalle TEXT
);

-- ═══════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════

ALTER TABLE semanas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfil    ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
--  POLÍTICAS: lectura pública / escritura admin
-- ═══════════════════════════════════════════

-- SEMANAS
CREATE POLICY "lectura_publica_semanas"
  ON semanas FOR SELECT USING (true);
CREATE POLICY "escritura_admin_semanas"
  ON semanas FOR ALL USING (auth.role() = 'authenticated');

-- ARCHIVOS
CREATE POLICY "lectura_publica_archivos"
  ON archivos FOR SELECT USING (true);
CREATE POLICY "escritura_admin_archivos"
  ON archivos FOR ALL USING (auth.role() = 'authenticated');

-- PERFIL
CREATE POLICY "lectura_publica_perfil"
  ON perfil FOR SELECT USING (true);
CREATE POLICY "escritura_admin_perfil"
  ON perfil FOR ALL USING (auth.role() = 'authenticated');

-- PROYECTOS
CREATE POLICY "lectura_publica_proyectos"
  ON proyectos FOR SELECT USING (true);
CREATE POLICY "escritura_admin_proyectos"
  ON proyectos FOR ALL USING (auth.role() = 'authenticated');

-- ACTIVIDAD
CREATE POLICY "lectura_publica_actividad"
  ON actividad FOR SELECT USING (true);
CREATE POLICY "escritura_admin_actividad"
  ON actividad FOR ALL USING (auth.role() = 'authenticated');
```

3. Haz clic en **Run** (▶️). Deberías ver "Success" en verde.

---

### Paso 4 — Crear los buckets de Storage

#### Bucket 1: archivos del curso

1. Ve a **Storage** en el menú lateral → **New bucket**
2. Configura:
   - **Name:** `archivos-curso`
   - **Public bucket:** ✅ activado
3. Haz clic en **Create bucket**
4. Ahora ve a **Policies** del bucket y agrega estas políticas:

| Operación | Política |
|---|---|
| SELECT | `true` (cualquiera puede leer) |
| INSERT | `(auth.role() = 'authenticated')` |
| DELETE | `(auth.role() = 'authenticated')` |

#### Bucket 2: fotos de perfil

1. **New bucket** → Name: `fotos-perfil` → Public: ✅
2. Mismas políticas que el bucket anterior

---

### Paso 5 — Crear el usuario administrador

1. Ve a **Authentication** → **Users** → **Add user**
2. Completa:
   - **Email:** el correo que quieras usar para el login (ej: `admin@upla.edu.pe`)
   - **Password:** una contraseña segura
3. Haz clic en **Create user**
4. ¡Listo! Esas son tus credenciales para el panel admin de la web

---

## 🚀 Despliegue en Vercel

### Paso 1 — Subir el proyecto a GitHub

```bash
# 1. Inicializar git en tu carpeta del proyecto
git init

# 2. Agregar todos los archivos
git add .

# 3. Primer commit
git commit -m "feat: portafolio arquitectura de software UPLA"

# 4. Crear repositorio en GitHub (hazlo desde github.com)
#    Nombre sugerido: arquitectura-software-upla

# 5. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/arquitectura-software-upla.git
git branch -M main
git push -u origin main
```

> **Tip:** Si es tu primera vez con Git, instálalo desde [git-scm.com](https://git-scm.com)

---

### Paso 2 — Conectar con Vercel

1. Ve a [https://vercel.com](https://vercel.com) y crea una cuenta gratuita (puedes entrar con GitHub)
2. En el dashboard de Vercel, haz clic en **"Add New Project"**
3. Selecciona **"Import Git Repository"**
4. Busca y selecciona tu repositorio `arquitectura-software-upla`
5. Haz clic en **"Import"**

---

### Paso 3 — Configurar el proyecto en Vercel

En la pantalla de configuración:

| Campo | Valor |
|---|---|
| **Framework Preset** | `Other` |
| **Root Directory** | `.` (dejar en blanco) |
| **Build Command** | *(dejar vacío)* |
| **Output Directory** | *(dejar vacío)* |
| **Install Command** | *(dejar vacío)* |

> ⚠️ No necesitas build ni instalación porque es HTML/CSS/JS puro.

6. Haz clic en **"Deploy"**
7. Espera ~30 segundos. Vercel te dará una URL como:
   ```
   https://arquitectura-software-upla.vercel.app
   ```

---

### Paso 4 — (Opcional) Dominio personalizado

Si tienes un dominio propio:
1. Ve a tu proyecto en Vercel → **Settings** → **Domains**
2. Agrega tu dominio y sigue las instrucciones de DNS

---

### Paso 5 — Actualizaciones futuras

Cada vez que hagas cambios y los subas a GitHub, Vercel desplegará automáticamente:

```bash
git add .
git commit -m "fix: descripción del cambio"
git push
```

Vercel detecta el push y redespliega en ~30 segundos. ✅

---

## 🗄️ Base de datos

### Diagrama de tablas

```
semanas                    archivos
──────────────────         ──────────────────────────
id (UUID) PK          ←── semana_id (UUID) FK
numero_semana               id (UUID) PK
titulo                      nombre
descripcion                 tipo (pdf|imagen|word|excel|otro)
created_at                  url
                            created_at

perfil                     proyectos
──────────────────         ──────────────────────────
id (UUID) PK               id (UUID) PK
nombre                     nombre
bio                        descripcion
foto_url                   tecnologias
github                     estado
linkedin                   url
correo                     created_at
carrera
ubicacion

actividad
──────────────────
id (UUID) PK
fecha (DATE UNIQUE)
nivel (0-4)
detalle
```

---

## 📖 Uso del sistema

### Como visitante
1. Abre la página principal → explora las semanas recientes
2. Ve a **Semanas** → filtra por tipo de archivo o busca por nombre
3. Haz clic en una semana para ver sus archivos
4. Haz clic en el ojo 👁️ para previsualizar o en ⬇️ para descargar
5. Ve a **Sobre mí** para ver el perfil y los proyectos

### Como administrador
1. Haz clic en **Login** en la navbar
2. Ingresa email y contraseña del admin
3. Aparecerá la opción **Admin** en la navbar
4. Ve a **Admin** → gestiona semanas y archivos desde el panel
5. En **Sobre mí** → edita el perfil y agrega proyectos

---

## 🤝 Contribuciones

Este proyecto es para uso académico. Si encuentras algún error:

1. Abre un [Issue](../../issues)
2. Describe el problema claramente
3. Incluye capturas de pantalla si es posible

---

## 📄 Licencia

Este proyecto es de uso académico — **Universidad Peruana Los Andes, 2025**

---

<div align="center">

Hecho con ❤️ para el curso de **Arquitectura de Software** — UPLA 2025

</div>
