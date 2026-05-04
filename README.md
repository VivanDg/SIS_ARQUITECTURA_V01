# TechPortfolio - Portafolio de Arquitectura de Software

Dashboard interactivo para el curso de Arquitectura de Software con unidades de aprendizaje, juegos arcade retro containerizados, reproductor de música y panel de administrador.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de Datos | Supabase |
| Auth | Supabase Auth |
| Audio | Howler.js |
| Iconos | Lucide React |

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js
│   ├── page.tsx           # Home/Dashboard
│   ├── unidades/          # Gestión de unidades
│   ├── juegos/           # Videojuegos retro (Docker)
│   ├── musica/           # Reproductor de música
│   ├── sobre-mi/         # Perfil profesional
│   ├── login/          # Login de administrador
│   ├── admin/          # Panel de administración
│   └── api/            # API routes (seguras)
├── components/
│   ├── ThemeProvider.tsx  # Tema claro/oscuro
│   ├── Sidebar.tsx       # Menú lateral
│   └── Navbar.tsx        # Barra superior (login)
└── lib/
    └── supabase.ts       # Cliente Supabase (servidor)
```

## Seguridad

- **API Keys ocultas**: Las credenciales de Supabase se configuran en variables de entorno (`.env.local`), nunca expuestas al cliente.
- **API Routes**: Todas las llamadas a Supabase pasan por API routes del servidor.
- **Supabase Auth**: Autenticación gestionada por Supabase.

## Getting Started

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia `.env.local.example` a `.env.local`
3. Configura tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-key
```

### 3. Configurar Base de Datos

En tu proyecto Supabase, ejecuta este SQL para crear las tablas:

```sql
-- Tabla de unidades
CREATE TABLE unidades (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  files INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de juegos
CREATE TABLE juegos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT,
  status TEXT DEFAULT 'stopped',
  container TEXT,
  score TEXT DEFAULT '0',
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pistas de música
CREATE TABLE pistas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  album TEXT,
  duration TEXT,
  likes INTEGER DEFAULT 0,
  playlist_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de playlists
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  tracks INTEGER DEFAULT 0,
  duration TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de perfil
CREATE TABLE perfil (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  bio TEXT,
  email TEXT,
  github TEXT,
  linkedin TEXT,
  habilidades TEXT[],
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE juegos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfil ENABLE ROW LEVEL SECURITY;
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Deployar en Vercel

```bash
# Conecta tu repositorio a Vercel
vercel deploy

# O haz push a GitHub y Vercel lo detecta automáticamente
```

## Características

### Dashboard Principal
- Quick access a todas las secciones
- Noticias tech
- Actividad reciente
- Heatmap de contribuciones estilo GitHub

### Unidades
- Gestor de archivos por semanas
- Progreso del curso
- Estados de completado

### Videojuegos
- Interfaz arcade retro
- Leaderboard global
- Soporte para Docker (ejecutar localmente)

### Música
- Reproductor con playlist
- Controles completos
- Diseño moderno

### Sobre Mí
- Perfil profesional
- Habilidades técnicas
- Proyectos destacados

### Administrador
- CRUD completo de unidades, juegos, música y perfil
- Solo acceso tras autenticación

## Autenticación

El sistema usa Supabase Auth. Para proteger rutas de admin:

```typescript
// Middleware de protección (pendiente de implementar)
```

## Notas Importantes

1. **Docker en Vercel**: Los contenedores Docker no funcionan en Vercel (serverless). Para los juegos necesitas:
   - Ejecutarlos localmente
   - Usar otro servicio (Railway, Render, DigitalOcean)
   - O usar emuladores web (RetroArch WASM)

2. **Variables de entorno en Vercel**: Añade tus variables en Settings > Environment Variables

## Licencia

MIT