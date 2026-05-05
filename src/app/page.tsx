"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FolderOpen, Gamepad2, Music, User, ArrowRight, FileText, Calendar, Upload } from "lucide-react";
import { getNoticias, getUnidades, getSemanaById, Noticia, Unidad } from "@/lib/data";

const quickAccessItems = [
  { href: "/unidades", label: "Unidades", description: "Gestor de archivos de semanas", icon: FolderOpen, color: "#e0e7ff", textColor: "#4f46e5" },
  { href: "/juegos", label: "Videojuegos", description: "Sandbox y juegos interactivos", icon: Gamepad2, color: "#ede9fe", textColor: "#7c3aed" },
  { href: "/musica", label: "Música", description: "Playlists y laboratorio de audio", icon: Music, color: "#fef3c7", textColor: "#d97706" },
  { href: "/sobre-mi", label: "Sobre Mí", description: "Portafolio y contacto", icon: User, color: "#e2e8f0", textColor: "#475569" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    loadData();
  }, []);

  async function loadData() {
    try {
      const [noticiasData, unidadesData] = await Promise.all([
        getNoticias(),
        getUnidades()
      ]);
      setNoticias(noticiasData);
      setUnidades(unidadesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  const getActividadReciente = () => {
    const actividades: { tipo: string; titulo: string; fecha?: string; color: string }[] = [];
    
    // Agregar semanas de unidades
    unidades.forEach(u => {
      (u.semanas || []).forEach(s => {
        actividades.push({
          tipo: 'semana',
          titulo: `Nueva semana: ${s.titulo}`,
          fecha: s.created_at,
          color: u.color
        });
      });
    });
    
    // Agregar noticias
    noticias.forEach(n => {
      actividades.push({
        tipo: 'noticia',
        titulo: n.titulo,
        fecha: n.fecha,
        color: '#6366f1'
      });
    });
    
    // Ordenar por fecha más reciente
    return actividades
      .sort((a, b) => new Date(b.fecha || '').getTime() - new Date(a.fecha || '').getTime())
      .slice(0, 5);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return "Ahora mismo";
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getIconActividad = (tipo: string) => {
    switch (tipo) {
      case 'semana': return <Calendar size={14} />;
      case 'archivo': return <FileText size={14} />;
      case 'noticia': return <Upload size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const isDark = theme === "dark";
  const gradient = isDark 
    ? "linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #7c3aed 100%)" 
    : "linear-gradient(135deg, #0058be 0%, #6b38d4 100%)";
  
  if (!mounted) return null;

  const actividades = getActividadReciente();

  return (
    <div>
      <section className="card mb-8" style={{ background: gradient, color: "white", padding: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="text-4xl font-bold mb-4">Bienvenido a Arquitectura de Software</h1>
            <p className="text-xl" style={{ opacity: 0.9 }}>Explora los principios, patrones y mejores prácticas del diseño de sistemas software.</p>
            <Link href="/unidades" className="btn-login mt-6" style={{ boxShadow: "none" }}>
              Ver Unidades <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid-4 mb-8">
        {quickAccessItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="card card-hover" style={{ borderTop: `4px solid ${item.textColor}` }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon size={26} style={{ color: item.textColor }} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{item.label}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </Link>
          );
        })}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 className="text-2xl font-semibold">Noticias Tech</h2>
            <Link href="#" className="text-primary text-sm">Ver todas →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Cargando...</div>
          ) : noticias.length > 0 ? (
            <div className="grid-2">
              {noticias.slice(0, 4).map((noticia) => (
                <div key={noticia.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ height: 120, background: "var(--surface-variant)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {noticia.imagen ? (
                      <img src={noticia.imagen} alt={noticia.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Gamepad2 size={48} className="text-muted" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-sm font-semibold text-primary">{noticia.categoria || 'General'}</span>
                    <h3 className="text-lg font-semibold mb-2">{noticia.titulo}</h3>
                    <p className="text-sm text-muted">{noticia.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
              No hay noticias disponibles
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
          {actividades.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {actividades.map((actividad, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: actividad.color, marginTop: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getIconActividad(actividad.tipo)}
                  </div>
                  <div>
                    <span className="text-sm text-muted">{formatTimeAgo(actividad.fecha || '')}</span>
                    <p className="font-medium" style={{ fontSize: 14 }}>{actividad.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 20, color: "var(--text-3)" }}>
              Sin actividad reciente
            </div>
          )}
        </section>
      </div>
    </div>
  );
}