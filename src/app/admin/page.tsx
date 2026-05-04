"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, File, Tag, FileText, Gamepad2, Music, User, Plus, Edit, Trash2, Save, ArrowLeft, Upload, X, Check, Search, Filter, Download, Eye, Calendar, FileText as FileIcon, Layers, Files, Video, MessageSquare, Palette, Settings, Home, UserCircle, Briefcase, GraduationCap, Code, Disc } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { getUnidades, createUnidad, updateUnidad, deleteUnidad, createSemana, updateSemana, deleteSemana, createArchivo, deleteArchivo, getSemanaById, getPerfil, updatePerfil, getHabilidades, updateHabilidad, getEducacion, updateEducacion, getProyectos, updateProyecto, deleteHabilidad, deleteEducacion, deleteProyecto, getNoticias, createNoticia, updateNoticia, deleteNoticia, getJuegos, createJuego, updateJuego, deleteJuego, getMusica, createMusica, updateMusica, deleteMusica, Unidad, Semana, Archivo, Perfil, Habilidad, Educacion, Proyecto, Noticia, Juego, Musica } from "@/lib/data";

type Tab = "dashboard" | "semanas" | "archivos" | "subir" | "unidades" | "etiquetas" | "noticias" | "perfil" | "juegos" | "musica";

const initialUnidades: Unidad[] = [];

const initialEtiquetas = [
  { id: 1, nombre: "Teoría", color: "#3b82f6" },
  { id: 2, nombre: "Práctica", color: "#22c55e" },
  { id: 3, nombre: "Proyecto", color: "#f59e0b" },
];

const initialNoticias = [
  { id: 1, titulo: "Nuevo curso disponible", descripcion: "Se agregó una nueva unidad", fecha: "2024-01-15" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, group: "general" },
  { id: "perfil", label: "Perfil", icon: UserCircle, group: "otros" },
  { id: "semanas", label: "Semanas", icon: Calendar, group: "academica" },
  { id: "archivos", label: "Archivos", icon: Files, group: "academica" },
  { id: "subir", label: "Subir archivo", icon: Upload, group: "academica" },
  { id: "unidades", label: "Unidades", icon: Layers, group: "academica" },
  { id: "juegos", label: "Juegos", icon: Gamepad2, group: "otros" },
  { id: "musica", label: "Música", icon: Music, group: "otros" },
  { id: "noticias", label: "Noticias", icon: MessageSquare, group: "otros" },
];

const groupLabels: Record<string, string> = {
  general: "General",
  academica: "Gestión Académica",
  otros: "Otros",
};

const getFileTypeIcon = (tipo: string) => {
  const icons: Record<string, string> = {
    pdf: "📄",
    imagen: "🖼️",
    word: "📝",
    excel: "📊",
    video: "🎬",
    otro: "📁",
  };
  return icons[tipo] || icons.otro;
};

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [unidades, setUnidades] = useState<Unidad[]>(initialUnidades);
  const [semanasData, setSemanasData] = useState<Semana[]>([]);
  const [archivosData, setArchivosData] = useState<Archivo[]>([]);
  const [etiquetas, setEtiquetas] = useState(initialEtiquetas);
  const [noticiasList, setNoticiasList] = useState(initialNoticias);
  const [editando, setEditando] = useState<any>(null);
  const [selectedUnidad, setSelectedUnidad] = useState<number | null>(null);
  const [selectedSemana, setSelectedSemana] = useState<number | null>(null);
  const [showModalSemana, setShowModalSemana] = useState(false);
  const [editSemanaId, setEditSemanaId] = useState<number | null>(null);
  const [subirFile, setSubirFile] = useState<File | null>(null);
  const [subirUnidadId, setSubirUnidadId] = useState<string>("");
  const [subirSemanaId, setSubirSemanaId] = useState<string>("");
  const [categoriaArchivo, setCategoriaArchivo] = useState<string>("actividad");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModalUnidad, setShowModalUnidad] = useState(false);
  const [editUnidadId, setEditUnidadId] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const [perfilData, setPerfilData] = useState<Perfil>({
    id: 1,
    nombre: "",
    bio: "",
    ubicacion: "",
    email: "",
    telefono: "",
    github: "",
    linkedin: "",
    imagen: ""
  });
  const [imagenPerfil, setImagenPerfil] = useState<File | null>(null);
  const [habilidadesData, setHabilidadesData] = useState<Habilidad[]>([]);
  const [educacionData, setEducacionData] = useState<Educacion[]>([]);
  const [proyectosData, setProyectosData] = useState<Proyecto[]>([]);
  const [noticiasData, setNoticiasData] = useState<Noticia[]>([]);
  const [juegosData, setJuegosData] = useState<Juego[]>([]);
  const [musicaData, setMusicaData] = useState<Musica[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      loadData();
    }
  }, [isAuthenticated, router]);

  async function loadData() {
    setLoading(true);
    try {
      const unidadesData = await getUnidades();
      setUnidades(unidadesData);
      
      const todasSemanas = unidadesData.flatMap(u => u.semanas || []);
      setSemanasData(todasSemanas);
      
      const { data: archivos } = await supabase.from('archivos').select('*');
      setArchivosData(archivos || []);
      
      let perfil = await getPerfil();
      if (!perfil) {
        const { data: newPerfil } = await supabase.from('perfil').insert({ nombre: 'Mi Nombre', bio: 'Mi bio', ubicacion: 'Mi ciudad', email: 'mi@email.com', telefono: '+51 000 000 000' }).select().single();
        perfil = newPerfil;
      }
      if (perfil) setPerfilData(perfil);
      
      let habilidades = await getHabilidades();
      if (habilidades.length === 0) {
        await supabase.from('habilidades').insert([{ categoria: 'Frontend', items: [], orden: 1 }, { categoria: 'Backend', items: [], orden: 2 }, { categoria: 'Bases de Datos', items: [], orden: 3 }, { categoria: 'DevOps', items: [], orden: 4 }]);
        habilidades = await getHabilidades();
      }
      setHabilidadesData(habilidades);
      
      let educacion = await getEducacion();
      if (educacion.length === 0) {
        await supabase.from('educacion').insert({ titulo: '', institucion: '', periodo: '', descripcion: '', orden: 1 });
        educacion = await getEducacion();
      }
      setEducacionData(educacion);
      
      let proyectos = await getProyectos();
      if (proyectos.length === 0) {
        await supabase.from('proyectos').insert({ titulo: '', descripcion: '', tecnologias: [], enlace: '', orden: 1 });
        proyectos = await getProyectos();
      }
      setProyectosData(proyectos);
      
      const noticias = await getNoticias();
      setNoticiasData(noticias);
      
      let juegos = await getJuegos();
      if (juegos.length === 0) {
        await supabase.from('juegos').insert([
          { titulo: 'Snake Game', descripcion: 'Clásico juego de la serpiente', genero: 'Arcade', tipo: 'web', orden: 1 },
          { titulo: 'Pong', descripcion: 'Tenis retro', genero: 'Arcade', tipo: 'web', orden: 2 },
          { titulo: 'Tetris', descripcion: 'Bloques que caen', genero: 'Puzzle', tipo: 'web', orden: 3 }
        ]);
        juegos = await getJuegos();
      }
      setJuegosData(juegos);
      
      let musica = await getMusica();
      if (musica.length === 0) {
        await supabase.from('musica').insert([
          { titulo: 'Mi Primera Canción', artista: 'Artista', album: 'Album', duracion: '3:30', genero: 'Rock', orden: 1 }
        ]);
        musica = await getMusica();
      }
      setMusicaData(musica);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) return null;

  const todasLasSemanas = unidades.flatMap(u => (u.semanas || []).map(s => ({ ...s, unidadId: u.id, unidadTitulo: u.titulo, unidadColor: u.color })));
  const totalArchivos = todasLasSemanas.reduce((acc, s) => acc + (s.archivos?.length || 0), 0);

  const handleSubirArchivo = async () => {
    if (!subirFile || !subirSemanaId) {
      alert("Selecciona una semana y un archivo");
      return;
    }
    setUploadProgress(10);
    
    try {
      const fileName = `${Date.now()}_${subirFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('archivos')
        .upload(fileName, subirFile);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('archivos')
        .getPublicUrl(fileName);
      
      setUploadProgress(50);
      
      const tipo = subirFile.name.endsWith(".pdf") ? "pdf" : subirFile.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "imagen" : "otro";
      
      await createArchivo({
        semana_id: Number(subirSemanaId),
        nombre: subirFile.name,
        tipo,
        url: publicUrl,
        categoria: categoriaArchivo
      });
      
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setSubirFile(null);
        setSubirSemanaId("");
        loadData();
        alert("Archivo subido correctamente");
      }, 500);
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setUploadProgress(0);
      alert("Error al subir archivo");
    }
  };

  const abrirModalSemana = (semana?: Semana, unidadId?: number) => {
    if (semana) {
      setEditSemanaId(semana.id);
      setSelectedUnidad(unidadId || null);
      setEditando({ numero: semana.numero_semana, titulo: semana.titulo, descripcion: semana.descripcion, video_url: semana.video_url || '', contenido: semana.contenido || '' });
    } else {
      setEditSemanaId(null);
      setEditando({ numero: todasLasSemanas.length + 1, titulo: "", descripcion: "", video_url: "", contenido: "" });
    }
    setShowModalSemana(true);
  };

  const guardarSemana = async () => {
    if (!editando?.titulo || !selectedUnidad) {
      alert("Completa todos los campos");
      return;
    }
    
    try {
      if (editSemanaId) {
        await updateSemana(editSemanaId, {
          numero_semana: editando.numero,
          titulo: editando.titulo,
          descripcion: editando.descripcion,
          video_url: editando.video_url,
          contenido: editando.contenido
        });
        alert("Semana actualizada");
      } else {
        await createSemana({
          unidad_id: selectedUnidad,
          numero_semana: editando.numero,
          titulo: editando.titulo,
          descripcion: editando.descripcion,
          video_url: editando.video_url,
          contenido: editando.contenido
        });
        alert("Semana creada");
      }
      setShowModalSemana(false);
      setEditando(null);
      loadData();
    } catch (error) {
      console.error("Error guardando semana:", error);
      alert("Error al guardar");
    }
  };

  const eliminarSemana = async (semanaId: number) => {
    if (confirm("¿Eliminar esta semana y todos sus archivos?")) {
      try {
        await deleteSemana(semanaId);
        loadData();
        alert("Semana eliminada");
      } catch (error) {
        console.error("Error eliminando semana:", error);
        alert("Error al eliminar");
      }
    }
  };

  const eliminarArchivo = async (archivoId: number) => {
    if (confirm("¿Eliminar este archivo?")) {
      try {
        await deleteArchivo(archivoId);
        loadData();
        alert("Archivo eliminado");
      } catch (error) {
        console.error("Error eliminando archivo:", error);
        alert("Error al eliminar");
      }
    }
  };

  const abrirModalUnidad = (unidad?: Unidad) => {
    if (unidad) {
      setEditUnidadId(unidad.id);
      setEditando({ titulo: unidad.titulo, descripcion: unidad.descripcion, color: unidad.color });
    } else {
      setEditUnidadId(null);
      setEditando({ titulo: "", descripcion: "", color: "#3b82f6" });
    }
    setShowModalUnidad(true);
  };

  const guardarUnidad = async () => {
    if (!editando?.titulo) {
      alert("Completa el título");
      return;
    }
    
    try {
      if (editUnidadId) {
        await updateUnidad(editUnidadId, editando);
        alert("Unidad actualizada");
      } else {
        await createUnidad(editando);
        alert("Unidad creada");
      }
      setShowModalUnidad(false);
      setEditando(null);
      loadData();
    } catch (error) {
      console.error("Error guardando unidad:", error);
      alert("Error al guardar");
    }
  };

  const eliminarUnidad = async (id: number) => {
    if (confirm("¿Eliminar esta unidad y todas sus semanas?")) {
      try {
        await deleteUnidad(id);
        loadData();
        alert("Unidad eliminada");
      } catch (error) {
        console.error("Error eliminando unidad:", error);
        alert("Error al eliminar");
      }
    }
  };

  const styles = {
    layout: { display: "flex", minHeight: "calc(100vh - 80px)", gap: 0 },
    sidebar: { width: 260, flexShrink: 0, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" as const },
    navLabel: { fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "20px 20px 10px", marginTop: 8 },
    navItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", cursor: "pointer", transition: "all 0.15s", fontSize: 14, color: "var(--text-2)", borderLeft: "3px solid transparent" },
    navItemActive: { background: "rgba(0, 120, 255, 0.08)", color: "var(--primary)", borderLeft: "3px solid var(--primary)" },
    navItemHover: { background: "rgba(0, 0, 0, 0.03)" },
    content: { flex: 1, padding: "32px 40px", background: "var(--surface-variant)", minHeight: "calc(100vh - 80px)", maxWidth: 1200, margin: "0 auto", width: "100%" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 },
    statCard: { padding: 24, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", display: "flex", flexDirection: "column" as const, gap: 8 },
    statIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
    statLabel: { fontSize: 13, color: "var(--text-3)" },
    statValue: { fontSize: 32, fontWeight: 700, color: "var(--text-1)" },
    card: { background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" },
    cardHeader: { padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 },
    cardBody: { padding: "16px 24px" },
    semanaRow: { display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: "1px solid var(--border)", transition: "all 0.15s", cursor: "default" },
    semanaNum: { width: 48, height: 48, borderRadius: 12, background: "var(--surface-variant)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 },
    semanaInfo: { flex: 1, minWidth: 0 },
    semanaTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4 },
    semanaDesc: { fontSize: 13, color: "var(--text-3)" },
    semanaActions: { display: "flex", gap: 8, flexShrink: 0 },
    fileRow: { display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderBottom: "1px solid var(--border)" },
    fileIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: "var(--surface-variant)" },
    fileInfo: { flex: 1, minWidth: 0 },
    fileName: { fontSize: 14, fontWeight: 500, marginBottom: 2 },
    fileMeta: { fontSize: 12, color: "var(--text-3)" },
    btnIcon: { padding: 10, borderRadius: 10, border: "none", cursor: "pointer", background: "var(--surface-variant)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
    btnIconHover: { background: "var(--primary)", color: "white" },
    btnIconDel: { color: "#ef4444" },
    btnPrimary: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.15s" },
    btnPrimaryHover: { transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0, 120, 255, 0.3)" },
    btnSecondary: { padding: "12px 20px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14 },
    modalOverlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
    modalCard: { background: "var(--surface)", borderRadius: 20, width: "100%", maxWidth: 520, position: "relative" as const, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
    modalClose: { position: "absolute" as const, top: 20, right: 20, background: "var(--surface-variant)", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text-2)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
    modalHeader: { padding: "28px 28px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 },
    modalIcon: { width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, var(--primary), #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "white" },
    modalBody: { padding: "24px 28px" },
    inputGroup: { marginBottom: 20 },
    inputLabel: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-2)" },
    input: { width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-variant)", color: "inherit", fontSize: 14, transition: "border-color 0.15s" },
    inputFocus: { borderColor: "var(--primary)", outline: "none" },
    dropzone: { border: "2px dashed var(--border)", borderRadius: 16, padding: 32, textAlign: "center" as const, cursor: "pointer", transition: "all 0.2s", background: "var(--surface-variant)", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", minHeight: 120 },
    dropzoneActive: { borderColor: "var(--primary)", background: "rgba(0, 120, 255, 0.05)" },
    progressWrap: { marginTop: 16 },
    progressTrack: { height: 8, background: "var(--surface-variant)", borderRadius: 4, overflow: "hidden" },
    progressFill: { height: "100%", background: "linear-gradient(90deg, var(--primary), #6366f1)", transition: "width 0.3s" },
    tag: { padding: "8px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 500 },
    empty: { textAlign: "center" as const, padding: 60, color: "var(--text-3)" },
    header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 32 },
    badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  };

  const getAllArchivos = () => archivosData;

  if (loading) {
    return (
      <div style={{ paddingTop: 80, display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 80px)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-3)" }}>Cargando datos...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="admin-layout" style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, var(--primary), #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Admin</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Panel de Control</div>
              </div>
            </div>
          </div>
          
          <nav style={{ flex: 1, padding: "12px 0" }}>
            {["general", "academica", "otros"].map(group => {
              const groupItems = navItems.filter(item => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group}>
                  <div style={styles.navLabel}>{groupLabels[group]}</div>
                  {groupItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isHovered = hoveredItem === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id as Tab)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{ 
                          ...styles.navItem, 
                          ...(isActive ? styles.navItemActive : {}),
                          ...(isHovered && !isActive ? styles.navItemHover : {})
                        }}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </nav>
          
          <div style={{ padding: 20, borderTop: "1px solid var(--border)" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, color: "var(--text-2)", textDecoration: "none", fontSize: 14, background: "var(--surface-variant)" }}>
              <ArrowLeft size={18} />
              <span>Volver al sitio</span>
            </a>
          </div>
        </aside>

        <div style={styles.content}>
          {activeTab === "dashboard" && (
            <div>
              <div style={styles.header}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Panel de Control</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h2>
                </div>
              </div>
              
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "rgba(0, 120, 255, 0.1)" }}>📚</div>
                  <div style={styles.statLabel}>Unidades</div>
                  <div style={styles.statValue}>{unidades.length}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "rgba(99, 102, 241, 0.1)" }}>📅</div>
                  <div style={styles.statLabel}>Semanas</div>
                  <div style={styles.statValue}>{todasLasSemanas.length}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "rgba(34, 197, 94, 0.1)" }}>📁</div>
                  <div style={styles.statLabel}>Archivos</div>
                  <div style={styles.statValue}>{totalArchivos}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: "rgba(245, 158, 11, 0.1)" }}>📄</div>
                  <div style={styles.statLabel}>PDFs</div>
                  <div style={styles.statValue}>{getAllArchivos().filter(a => a.tipo === "pdf").length}</div>
                </div>
              </div>
              
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}><Calendar size={18} style={{ color: "var(--primary)" }} />Última actividad</span>
                </div>
                <div style={styles.cardBody}>
                  {getAllArchivos().length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
                      <File size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                      <div style={{ fontSize: 14 }}>Sin actividad reciente</div>
                    </div>
                  ) : (
                    getAllArchivos().slice(0, 5).map(a => (
                      <div key={a.id} style={styles.fileRow}>
                        <div style={styles.fileIcon}>{getFileTypeIcon(a.tipo)}</div>
                        <div style={styles.fileInfo}>
                          <div style={styles.fileName}>{a.nombre}</div>
                          <div style={styles.fileMeta}>Semana {a.semana_id} · {formatearFecha(a.created_at || '')}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "semanas" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Gestión de Contenido</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Semanas</h2>
                </div>
                <button 
                  onClick={() => { setSelectedUnidad(unidades[0]?.id || null); abrirModalSemana(); }} 
                  disabled={unidades.length === 0}
                  style={{ ...styles.btnPrimary, opacity: unidades.length === 0 ? 0.5 : 1 }}
                >
                  <Plus size={18} />Nueva semana
                </button>
              </div>

              {unidades.length === 0 ? (
                <div style={styles.empty}>
                  <Layers size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Sin unidades</div>
                  <p>Crea una unidad primero para agregar semanastyles.</p>
                </div>
              ) : (
                unidades.map(u => (
                  <div key={u.id} style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "16px 24px", background: u.color, borderRadius: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 17, color: "white" }}>{u.titulo}</div>
                      <div style={{ ...styles.badge, background: "rgba(255,255,255,0.25)", color: "white" }}>{u.semanas?.length || 0} semanas</div>
                    </div>
                    <div style={{ ...styles.card, overflow: "visible" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {(u.semanas || []).length === 0 ? (
                          <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>Sin semanas en esta unidad</div>
                        ) : (
                          (u.semanas || []).map(s => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", transition: "all 0.15s" }}>
                              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${u.color}15`, color: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>{s.numero_semana}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: "var(--text-1)" }}>{s.titulo}</div>
                                <div style={{ fontSize: 13, color: "var(--text-3)" }}>{s.descripcion || "Sin descripción"} · <span style={{ color: u.color, fontWeight: 600 }}>{s.archivos?.length || 0} archivos</span></div>
                              </div>
                              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                <button onClick={() => { setSelectedUnidad(u.id); abrirModalSemana(s, u.id); }} style={{ ...styles.btnIcon, background: "var(--surface-variant)" }} title="Editar"><Edit size={16} /></button>
                                <button onClick={() => eliminarSemana(s.id)} style={{ ...styles.btnIcon, color: "#ef4444" }} title="Eliminar"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "archivos" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Gestión de Archivos</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Todos los archivos</h2>
                </div>
              </div>
              <div style={{ ...styles.card, padding: 0 }}>
                {getAllArchivos().length === 0 ? (
                  <div style={styles.empty}>
                    <Files size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Sin archivos</div>
                    <p>Sube archivos desde la sección "Subir archivo"</p>
                  </div>
                ) : (
                  getAllArchivos().map(a => (
                    <div key={a.id} style={{ ...styles.fileRow, background: "var(--surface)" }}>
                      <div style={styles.fileIcon}>{getFileTypeIcon(a.tipo)}</div>
                      <div style={styles.fileInfo}>
                        <div style={styles.fileName}>{a.nombre}</div>
                        <div style={styles.fileMeta}>{a.tipo.toUpperCase()} · Semana {a.semana_id}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <a href={a.url} target="_blank" style={styles.btnIcon} title="Ver"><Eye size={16} /></a>
                        <a href={a.url} download={a.nombre} style={styles.btnIcon} title="Descargar"><Download size={16} /></a>
                        <button onClick={() => eliminarArchivo(a.id)} style={{ ...styles.btnIcon, ...styles.btnIconDel }} title="Eliminar"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "subir" && (
            <div style={{ maxWidth: 600 }}>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Carga de Archivos</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Subir archivo</h2>
                </div>
              </div>
              <div style={styles.card}>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Unidad</label>
                    <select 
                      value={subirUnidadId} 
                      onChange={e => { setSubirUnidadId(e.target.value); setSubirSemanaId(""); }} 
                      style={{ ...styles.input, cursor: "pointer" }}
                    >
                      <option value="">-- Selecciona una unidad --</option>
                      {unidades.map(u => (
                        <option key={u.id} value={u.id}>{u.titulo}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Semana destino</label>
                    <select 
                      value={subirSemanaId} 
                      onChange={e => setSubirSemanaId(e.target.value)} 
                      style={{ ...styles.input, cursor: "pointer", opacity: subirUnidadId ? 1 : 0.5 }}
                      disabled={!subirUnidadId}
                    >
                      <option value="">-- Selecciona una semana --</option>
                      {unidades.find(u => u.id === Number(subirUnidadId))?.semanas?.map(s => (
                        <option key={s.id} value={s.id}>Semana {s.numero_semana} — {s.titulo}</option>
                      )) || []}
                    </select>
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Tipo de archivo</label>
                    <select 
                      value={categoriaArchivo} 
                      onChange={e => setCategoriaArchivo(e.target.value)} 
                      style={{ ...styles.input, cursor: "pointer" }}
                    >
                      <option value="actividad">📋 Actividad</option>
                      <option value="material">📚 Material de Clase</option>
                    </select>
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Archivo</label>
                    <input type="file" id="fileInputUpload" onChange={e => { const f = e.target.files?.[0]; if (f) setSubirFile(f); }} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip" style={{ display: "none" }} />
                    <label htmlFor="fileInputUpload" style={styles.dropzone}>
                      <div style={{ marginBottom: 8 }}>
                        <Upload size={32} style={{ opacity: 0.6 }} />
                      </div>
                      <div style={{ fontSize: 14, marginBottom: 4 }}>Arrastra aquí o <span style={{ color: "var(--primary)", fontWeight: 600 }}>selecciona un archivo</span></div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>PDF, imágenes, Word, Excel, ZIP</div>
                    </label>
                    
                    {subirFile && (
                      <div style={{ marginTop: 16, padding: 16, background: "var(--surface-variant)", borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ fontSize: 28 }}>{getFileTypeIcon(subirFile.name.endsWith('.pdf') ? 'pdf' : 'otro')}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{subirFile.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-3)" }}>{(subirFile.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button onClick={() => setSubirFile(null)} style={styles.btnIcon}><X size={16} /></button>
                      </div>
                    )}
                  </div>

                  {uploadProgress > 0 && (
                    <div style={styles.progressWrap}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13 }}>Subiendo archivo...</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>{uploadProgress}%</span>
                      </div>
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleSubirArchivo} 
                    disabled={!subirFile || !subirSemanaId || uploadProgress > 0}
                    style={{ 
                      ...styles.btnPrimary, 
                      width: "100%", 
                      justifyContent: "center", 
                      padding: "16px 24px",
                      opacity: (!subirFile || !subirSemanaId) ? 0.5 : 1 
                    }}
                  >
                    <Upload size={20} />Subir archivo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "unidades" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Gestión de Unidades</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Unidades</h2>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {unidades.map(u => (
                  <div key={u.id} style={{ padding: 20, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", borderLeft: `4px solid ${u.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{u.titulo}</div>
                        <div style={{ fontSize: 13, color: "var(--text-3)" }}>{u.descripcion}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => abrirModalUnidad(u)} style={styles.btnIcon} title="Editar"><Edit size={16} /></button>
                        <button onClick={() => eliminarUnidad(u.id)} style={{ ...styles.btnIcon, ...styles.btnIconDel }} title="Eliminar"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div style={{ ...styles.badge, background: `${u.color}15`, color: u.color, display: "inline-flex" }}>
                      {u.semanas?.length || 0} semanas
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => abrirModalUnidad()} style={{ ...styles.btnPrimary, marginTop: 24 }}>
                <Plus size={18} />Nueva Unidad
              </button>
            </div>
          )}

          {activeTab === "etiquetas" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Organización</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Etiquetas</h2>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {etiquetas.map(e => (
                  <div key={e.id} style={{ ...styles.tag, background: e.color, color: "white" }}>
                    <span>{e.nombre}</span>
                    <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
                      <button 
                        onClick={() => setEditando({ tipo: "etiqueta", data: e })}
                        style={{ padding: 4, borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", color: "white" }}
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        onClick={() => setEtiquetas(etiquetas.filter(x => x.id !== e.id))}
                        style={{ padding: 4, borderRadius: 6, background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", color: "white" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setEditando({ tipo: "nuevaEtiqueta", data: { nombre: "", color: "#3b82f6" } })} style={{ ...styles.btnPrimary, marginTop: 24 }}>
                <Plus size={18} />Nueva Etiqueta
              </button>
            </div>
          )}

          {activeTab === "noticias" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Comunicación</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Noticias</h2>
                </div>
                <button onClick={async () => {
                  const nueva = await createNoticia({ titulo: 'Nueva Noticia', descripcion: 'Descripción...', categoria: 'General', fecha: new Date().toISOString(), imagen: '' });
                  setNoticiasData([...noticiasData, nueva]);
                }} style={styles.btnPrimary}>
                  <Plus size={18} />Nueva Noticia
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {noticiasData.map(n => (
                  <div key={n.id} style={{ padding: 20, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "var(--surface-variant)", padding: "4px 8px", borderRadius: 4 }}>{n.categoria}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEditando({ tipo: "noticia", data: n })} style={styles.btnIcon}><Edit size={16} /></button>
                        <button onClick={async () => {
                          if (confirm("¿Eliminar esta noticia?")) {
                            await deleteNoticia(n.id);
                            setNoticiasData(noticiasData.filter(x => x.id !== n.id));
                          }
                        }} style={{ ...styles.btnIcon, ...styles.btnIconDel }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Título</label>
                      <input type="text" value={n.titulo} onChange={ev => setNoticiasData(noticiasData.map(nw => nw.id === n.id ? { ...nw, titulo: ev.target.value } : nw))} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Descripción</label>
                      <textarea value={n.descripcion || ''} onChange={ev => setNoticiasData(noticiasData.map(nw => nw.id === n.id ? { ...nw, descripcion: ev.target.value } : nw))} rows={2} style={{ ...styles.input, resize: "vertical" as const }} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Categoría</label>
                      <input type="text" value={n.categoria} onChange={ev => setNoticiasData(noticiasData.map(nw => nw.id === n.id ? { ...nw, categoria: ev.target.value } : nw))} style={styles.input} />
                    </div>
                    <button onClick={async () => {
                      await updateNoticia(n.id, { titulo: n.titulo, descripcion: n.descripcion, categoria: n.categoria });
                      alert("Noticia actualizada");
                    }} style={{ ...styles.btnPrimary, marginTop: 8 }}>Guardar Cambios</button>
                  </div>
                ))}
                {noticiasData.length === 0 && (
                  <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
                    <MessageSquare size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                    <p>No hay noticias. Crea una nueva.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "juegos" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Entretenimiento</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Videojuegos</h2>
                </div>
                <button onClick={async () => {
                  try {
                    const nuevo = await createJuego({ titulo: 'Nuevo Juego', descripcion: '', genero: 'Arcade', imagen: '', archivo: '', tipo: 'web', orden: juegosData.length + 1 });
                    setJuegosData([...juegosData, nuevo]);
                  } catch (error) {
                    console.error("Error creando juego:", error);
                    alert("Error al crear juego. Verifica que la tabla existe.");
                  }
                }} style={styles.btnPrimary}>
                  <Plus size={18} />Nuevo Juego
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {juegosData.map(j => (
                  <div key={j.id} style={{ ...styles.card, overflow: "hidden" }}>
                    <div style={{ height: 140, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {j.imagen ? (
                        <img src={j.imagen} alt={j.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Gamepad2 size={48} style={{ color: "white", opacity: 0.8 }} />
                      )}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed", background: "#ede9fe", padding: "4px 8px", borderRadius: 4 }}>{j.genero || 'Sin género'}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => setEditando({ tipo: "juego", data: j })} style={styles.btnIcon}><Edit size={14} /></button>
                          <button onClick={async () => {
                            if (confirm("¿Eliminar este juego?")) {
                              await deleteJuego(j.id);
                              setJuegosData(juegosData.filter(x => x.id !== j.id));
                            }
                          }} style={{ ...styles.btnIcon, color: "#ef4444" }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Título</label>
                        <input type="text" value={j.titulo} onChange={ev => setJuegosData(juegosData.map(jg => jg.id === j.id ? { ...jg, titulo: ev.target.value } : jg))} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Descripción</label>
                        <textarea value={j.descripcion || ''} onChange={ev => setJuegosData(juegosData.map(jg => jg.id === j.id ? { ...jg, descripcion: ev.target.value } : jg))} rows={2} style={{ ...styles.input, resize: "vertical" as const }} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Género</label>
                        <input type="text" value={j.genero || ''} onChange={ev => setJuegosData(juegosData.map(jg => jg.id === j.id ? { ...jg, genero: ev.target.value } : jg))} placeholder="Arcade, Puzzle, Estrategia..." style={styles.input} />
                      </div>
                      <button onClick={async () => {
                        await updateJuego(j.id, { titulo: j.titulo, descripcion: j.descripcion, genero: j.genero });
                        alert("Juego actualizado");
                      }} style={{ ...styles.btnPrimary, width: "100%", marginTop: 8 }}>Guardar Cambios</button>
                    </div>
                  </div>
                ))}
              </div>
              {juegosData.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
                  <Gamepad2 size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p>No hay juegos. Crea uno nuevo.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "musica" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Contenido Multimedia</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Música</h2>
                </div>
                <button onClick={async () => {
                  try {
                    const nuevo = await createMusica({ titulo: 'Nueva Canción', artista: '', album: '', duracion: '', genero: '', imagen: '', url: '', orden: musicaData.length + 1 });
                    setMusicaData([...musicaData, nuevo]);
                  } catch (error) {
                    console.error("Error creando canción:", error);
                    alert("Error al crear canción");
                  }
                }} style={styles.btnPrimary}>
                  <Plus size={18} />Nueva Canción
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {musicaData.map(m => (
                  <div key={m.id} style={{ ...styles.card, overflow: "hidden" }}>
                    <div style={{ height: 120, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {m.imagen ? (
                        <img src={m.imagen} alt={m.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Music size={48} style={{ color: "white", opacity: 0.8 }} />
                      )}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", background: "#dcfce7", padding: "4px 8px", borderRadius: 4 }}>{m.genero || 'Sin género'}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => setEditando({ tipo: "musica", data: m })} style={styles.btnIcon}><Edit size={14} /></button>
                          <button onClick={async () => {
                            if (confirm("¿Eliminar esta canción?")) {
                              await deleteMusica(m.id);
                              setMusicaData(musicaData.filter(x => x.id !== m.id));
                            }
                          }} style={{ ...styles.btnIcon, color: "#ef4444" }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Título</label>
                        <input type="text" value={m.titulo} onChange={ev => setMusicaData(musicaData.map(mu => mu.id === m.id ? { ...mu, titulo: ev.target.value } : mu))} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Artista</label>
                        <input type="text" value={m.artista || ''} onChange={ev => setMusicaData(musicaData.map(mu => mu.id === m.id ? { ...mu, artista: ev.target.value } : mu))} style={styles.input} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={styles.inputGroup}>
                          <label style={styles.inputLabel}>Álbum</label>
                          <input type="text" value={m.album || ''} onChange={ev => setMusicaData(musicaData.map(mu => mu.id === m.id ? { ...mu, album: ev.target.value } : mu))} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={styles.inputLabel}>Duración</label>
                          <input type="text" value={m.duracion || ''} onChange={ev => setMusicaData(musicaData.map(mu => mu.id === m.id ? { ...mu, duracion: ev.target.value } : mu))} placeholder="3:45" style={styles.input} />
                        </div>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Género</label>
                        <input type="text" value={m.genero || ''} onChange={ev => setMusicaData(musicaData.map(mu => mu.id === m.id ? { ...mu, genero: ev.target.value } : mu))} placeholder="Rock, Pop, Jazz..." style={styles.input} />
                      </div>
                      <button onClick={async () => {
                        await updateMusica(m.id, { titulo: m.titulo, artista: m.artista, album: m.album, duracion: m.duracion, genero: m.genero });
                        alert("Canción actualizada");
                      }} style={{ ...styles.btnPrimary, width: "100%", marginTop: 8 }}>Guardar Cambios</button>
                    </div>
                  </div>
                ))}
              </div>
              {musicaData.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
                  <Music size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p>No hay canciones. Crea una nueva.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "perfil" && (
            <div>
              <div style={styles.sectionHeader}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Información Personal</div>
                  <h2 style={{ fontSize: 28, fontWeight: 700 }}>Sobre Mí</h2>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}><UserCircle size={18} />Datos Personales</span>
                  </div>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 8 }}>
                      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--surface-variant)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid var(--border)" }}>
                        {perfilData.imagen ? (
                          <img src={perfilData.imagen} alt="Perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <UserCircle size={40} style={{ opacity: 0.5 }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <input type="file" id="imgPerfil" onChange={e => setImagenPerfil(e.target.files?.[0] || null)} accept="image/*" style={{ display: "none" }} />
                        <label htmlFor="imgPerfil" style={{ ...styles.btnPrimary, cursor: "pointer", display: "inline-flex" }}>
                          <Upload size={16} />Cambiar foto
                        </label>
                        {imagenPerfil && <span style={{ marginLeft: 12, fontSize: 13 }}>{imagenPerfil.name}</span>}
                      </div>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Nombre</label>
                      <input type="text" value={perfilData.nombre} onChange={e => setPerfilData({ ...perfilData, nombre: e.target.value })} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Bio / Descripción</label>
                      <textarea value={perfilData.bio} onChange={e => setPerfilData({ ...perfilData, bio: e.target.value })} rows={3} style={{ ...styles.input, resize: "vertical" as const }} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Ubicación</label>
                      <input type="text" value={perfilData.ubicacion} onChange={e => setPerfilData({ ...perfilData, ubicacion: e.target.value })} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Email</label>
                      <input type="text" value={perfilData.email} onChange={e => setPerfilData({ ...perfilData, email: e.target.value })} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Teléfono</label>
                      <input type="text" value={perfilData.telefono} onChange={e => setPerfilData({ ...perfilData, telefono: e.target.value })} style={styles.input} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>GitHub</label>
                        <input type="text" value={perfilData.github} onChange={e => setPerfilData({ ...perfilData, github: e.target.value })} placeholder="github.com/usuario" style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>LinkedIn</label>
                        <input type="text" value={perfilData.linkedin} onChange={e => setPerfilData({ ...perfilData, linkedin: e.target.value })} placeholder="linkedin.com/in/usuario" style={styles.input} />
                      </div>
                    </div>
                    <button onClick={async () => { 
                      if(perfilData.id) {
                        let imagenUrl = perfilData.imagen;
                        if (imagenPerfil) {
                          const fileName = `perfil_${Date.now()}_${imagenPerfil.name}`;
                          const { data: uploadData, error: uploadError } = await supabase.storage.from('archivos').upload(fileName, imagenPerfil);
                          if (!uploadError) {
                            const { data: { publicUrl } } = supabase.storage.from('archivos').getPublicUrl(fileName);
                            imagenUrl = publicUrl;
                          }
                        }
                        await updatePerfil(perfilData.id, { ...perfilData, imagen: imagenUrl });
                        setImagenPerfil(null);
                        loadData();
                        alert("Perfil actualizado");
                      } else { alert("Error: No hay perfil"); } 
                    }} style={{ ...styles.btnPrimary, marginTop: 8 }}>Guardar Datos</button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={styles.card}>
                    <div style={{ ...styles.cardHeader, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}>
                      <span style={{ ...styles.cardTitle, color: "white" }}><Code size={18} />Habilidades Técnicas</span>
                    </div>
                    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                      {habilidadesData.map(h => (
                        <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ ...styles.inputGroup, flex: 1, marginBottom: 0 }}>
                            <label style={styles.inputLabel}>{h.categoria}</label>
                            <input type="text" value={(h.items || []).join(", ")} onChange={e => {
                              const newItems = e.target.value.split(",").map(i => i.trim()).filter(i => i);
                              setHabilidadesData(habilidadesData.map(hab => hab.id === h.id ? { ...hab, items: newItems } : hab));
                            }} placeholder="React, Next.js, TypeScript" style={styles.input} />
                          </div>
                          <button onClick={async () => {
                            if (confirm(`¿Eliminar ${h.categoria}?`)) {
                              await deleteHabilidad(h.id);
                              loadData();
                            }
                          }} style={{ ...styles.btnIcon, marginTop: 20, color: "#ef4444" }} title="Eliminar"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button onClick={async () => {
                        for (const h of habilidadesData) {
                          await updateHabilidad(h.id, { items: h.items });
                        }
                        alert("Habilidades actualizadas");
                      }} style={{ ...styles.btnPrimary, marginTop: 8 }}>Guardar Habilidades</button>
                    </div>
                  </div>

                  <div style={styles.card}>
                    <div style={{ ...styles.cardHeader, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white" }}>
                      <span style={{ ...styles.cardTitle, color: "white" }}><GraduationCap size={18} />Educación</span>
                    </div>
                    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                      {educacionData.map(e => (
                        <div key={e.id} style={{ padding: 16, background: "var(--surface-variant)", borderRadius: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>Registro de educación</span>
                            <button onClick={async () => {
                              if (confirm("¿Eliminar este registro de educación?")) {
                                await deleteEducacion(e.id);
                                loadData();
                              }
                            }} style={{ ...styles.btnIcon, color: "#ef4444" }} title="Eliminar"><Trash2 size={16} /></button>
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.inputLabel}>Título</label>
                            <input type="text" value={e.titulo} onChange={ev => setEducacionData(educacionData.map(edu => edu.id === e.id ? { ...edu, titulo: ev.target.value } : edu))} style={styles.input} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={styles.inputGroup}>
                              <label style={styles.inputLabel}>Institución</label>
                              <input type="text" value={e.institucion} onChange={ev => setEducacionData(educacionData.map(edu => edu.id === e.id ? { ...edu, institucion: ev.target.value } : edu))} style={styles.input} />
                            </div>
                            <div style={styles.inputGroup}>
                              <label style={styles.inputLabel}>Período</label>
                              <input type="text" value={e.periodo} onChange={ev => setEducacionData(educacionData.map(edu => edu.id === e.id ? { ...edu, periodo: ev.target.value } : edu))} placeholder="2020 - 2024" style={styles.input} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={async () => {
                        for (const e of educacionData) {
                          await updateEducacion(e.id, e);
                        }
                        alert("Educación actualizada");
                      }} style={{ ...styles.btnPrimary, marginTop: 8 }}>Guardar Educación</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.card, marginTop: 24 }}>
                <div style={{ ...styles.cardHeader, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" }}>
                  <span style={{ ...styles.cardTitle, color: "white" }}><Briefcase size={18} />Proyectos Destacados</span>
                </div>
                <div style={{ padding: 24 }}>
                  {proyectosData.map(p => (
                    <div key={p.id} style={{ marginBottom: 20, padding: 20, background: "var(--surface-variant)", borderRadius: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>Proyecto</span>
                        <button onClick={async () => {
                          if (confirm("¿Eliminar este proyecto?")) {
                            await deleteProyecto(p.id);
                            loadData();
                          }
                        }} style={{ ...styles.btnIcon, color: "#ef4444" }} title="Eliminar"><Trash2 size={16} /></button>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Título del Proyecto</label>
                        <input type="text" value={p.titulo} onChange={ev => setProyectosData(proyectosData.map(proj => proj.id === p.id ? { ...proj, titulo: ev.target.value } : proj))} style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Descripción</label>
                        <textarea value={p.descripcion} onChange={ev => setProyectosData(proyectosData.map(proj => proj.id === p.id ? { ...proj, descripcion: ev.target.value } : proj))} rows={2} style={{ ...styles.input, resize: "vertical" as const }} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Tecnologías (separadas por coma)</label>
                        <input type="text" value={(p.tecnologias || []).join(", ")} onChange={ev => setProyectosData(proyectosData.map(proj => proj.id === p.id ? { ...proj, tecnologias: ev.target.value.split(",").map(t => t.trim()).filter(t => t) } : proj))} placeholder="Next.js, PostgreSQL, Docker" style={styles.input} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Enlace</label>
                        <input type="text" value={p.enlace} onChange={ev => setProyectosData(proyectosData.map(proj => proj.id === p.id ? { ...proj, enlace: ev.target.value } : proj))} placeholder="https://..." style={styles.input} />
                      </div>
                    </div>
                  ))}
                  <button onClick={async () => {
                    for (const p of proyectosData) {
                      await updateProyecto(p.id, p);
                    }
                    alert("Proyectos actualizados");
                  }} style={{ ...styles.btnPrimary, marginTop: 8 }}>Guardar Proyectos</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModalSemana && (
        <div style={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowModalSemana(false); }}>
          <div style={styles.modalCard}>
            <button style={styles.modalClose} onClick={() => setShowModalSemana(false)}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}><Calendar size={24} /></div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editSemanaId ? "Editar Semana" : "Nueva Semana"}</h3>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>Completa los datos de la semana</p>
              </div>
            </div>
            <div style={styles.modalBody}>
              {!editSemanaId && (
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Unidad</label>
                  <select value={selectedUnidad || ""} onChange={e => setSelectedUnidad(Number(e.target.value))} style={{ ...styles.input, cursor: "pointer" }}>
                    <option value="">-- Selecciona una unidad --</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.id}>{u.titulo}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Número</label>
                  <input type="number" value={editando?.numero || ""} onChange={e => setEditando({ ...editando, numero: Number(e.target.value) })} min={1} max={20} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Título</label>
                  <input type="text" value={editando?.titulo || ""} onChange={e => setEditando({ ...editando, titulo: e.target.value })} placeholder="Título de la semana" style={styles.input} />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Descripción</label>
                <textarea value={editando?.descripcion || ""} onChange={e => setEditando({ ...editando, descripcion: e.target.value })} rows={3} placeholder="Describe el contenido de la semana…" style={{ ...styles.input, resize: "vertical" as const }} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>🔗 URL del video (YouTube)</label>
                <input type="text" value={editando?.video_url || ""} onChange={e => setEditando({ ...editando, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={styles.input} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>📝 Contenido de la clase</label>
                <textarea value={editando?.contenido || ""} onChange={e => setEditando({ ...editando, contenido: e.target.value })} rows={4} placeholder="Escribe el contenido de la clase aquí..." style={{ ...styles.input, resize: "vertical" as const }} />
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={() => setShowModalSemana(false)} style={{ ...styles.btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={guardarSemana} style={{ ...styles.btnPrimary, flex: 1, justifyContent: "center" }}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalUnidad && (
        <div style={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowModalUnidad(false); }}>
          <div style={styles.modalCard}>
            <button style={styles.modalClose} onClick={() => setShowModalUnidad(false)}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}><Layers size={24} /></div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editUnidadId ? "Editar Unidad" : "Nueva Unidad"}</h3>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>Crea una nueva unidad de aprendizaje</p>
              </div>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Título</label>
                <input type="text" value={editando?.titulo || ""} onChange={e => setEditando({ ...editando, titulo: e.target.value })} placeholder="Título de la unidad" style={styles.input} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Descripción</label>
                <textarea value={editando?.descripcion || ""} onChange={e => setEditando({ ...editando, descripcion: e.target.value })} rows={3} placeholder="Describe la unidad…" style={{ ...styles.input, resize: "vertical" as const }} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Color de la unidad</label>
                <div style={{ display: "flex", gap: 12 }}>
                  {['#0058be', '#6b38d4', '#924700', '#2170e4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setEditando({ ...editando, color: c })} 
                      style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 12, 
                        background: c, 
                        border: editando?.color === c ? '3px solid white' : '3px solid transparent', 
                        cursor: 'pointer', 
                        boxShadow: editando?.color === c ? `0 0 0 2px ${c}` : 'none',
                        transition: "all 0.15s"
                      }} 
                    />
                  ))}
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={() => setShowModalUnidad(false)} style={{ ...styles.btnSecondary, flex: 1 }}>Cancelar</button>
                <button onClick={guardarUnidad} style={{ ...styles.btnPrimary, flex: 1, justifyContent: "center" }}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}