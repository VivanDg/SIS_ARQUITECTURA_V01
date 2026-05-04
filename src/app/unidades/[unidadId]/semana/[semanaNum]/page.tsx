"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle, FileText, File, FileImage, FileSpreadsheet, FileVideo, Download, Eye, Upload, Video, Mic } from "lucide-react";
import { getUnidadById, getSemanaByNumero, Unidad, Semana } from "@/lib/data";

const getFileIcon = (tipo: string) => {
  const icons: Record<string, any> = {
    pdf: FileText,
    docx: FileText,
    doc: FileText,
    xlsx: FileSpreadsheet,
    xls: FileSpreadsheet,
    pptx: FileVideo,
    ppt: FileVideo,
    jpg: FileImage,
    jpeg: FileImage,
    png: FileImage,
    gif: FileImage,
    mp4: FileVideo,
    zip: File,
    default: File
  };
  return icons[tipo] || icons.default;
};

export default function SemanaDetallePage() {
  const params = useParams();
  const unidadId = params.unidadId as string;
  const semanaNum = params.semanaNum as string;
  
  const [unidad, setUnidad] = useState<Unidad | null>(null);
  const [semana, setSemana] = useState<Semana | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [unidadId, semanaNum]);

  async function loadData() {
    try {
      const unidadData = await getUnidadById(Number(unidadId));
      setUnidad(unidadData);
      
      const semanaData = await getSemanaByNumero(Number(unidadId), Number(semanaNum));
      setSemana(semanaData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!unidad) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>Unidad no encontrada</h2>
        <Link href="/unidades" style={{ color: "var(--primary)" }}>Volver a unidades</Link>
      </div>
    );
  }

  if (!semana) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>Semana no encontrada</h2>
        <Link href={`/unidades/${unidadId}`} style={{ color: "var(--primary)" }}>Volver a la unidad</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={`/unidades/${unidadId}`} className="btn-login" style={{ padding: 8 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: unidad.color }}>Semana {semana.numero_semana}: {semana.titulo}</h1>
            <p className="text-muted">{unidad.titulo} • Unidad {unidad.id}</p>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Video size={20} /> Video de la Clase
            </h2>
            {semana.video_url ? (
              <div style={{ background: "#000", borderRadius: 8, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {semana.video_url.includes("youtube") || semana.video_url.includes("youtu.be") ? (
                  <iframe 
                    width="100%" 
                    height="300" 
                    src={semana.video_url.replace("watch?v=", "embed/")} 
                    title="Video de la clase"
                    style={{ borderRadius: 8 }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "white" }}>
                    <PlayCircle size={64} />
                    <p className="mt-4">Reproducir video</p>
                    <a href={semana.video_url} target="_blank" style={{ color: "var(--primary)", marginTop: 8, display: "block" }}>Abrir video</a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: 48, textAlign: "center", background: "var(--surface-variant)", borderRadius: 8 }}>
                <Video size={48} className="text-muted" style={{ margin: "0 auto 16px", display: "block" }} />
                <p className="text-muted">Video no disponible</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={20} /> Material de Clase
            </h2>
            {semana.descripcion ? (
              <div style={{ padding: 16, background: "var(--surface-variant)", borderRadius: 8, marginBottom: 16 }}>
                <p className="text-muted">{semana.descripcion}</p>
              </div>
            ) : null}
            {semana.contenido ? (
              <div style={{ padding: 16, background: "var(--surface-variant)", borderRadius: 8, marginBottom: 20 }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{semana.contenido}</div>
              </div>
            ) : null}
            {(() => {
              const archivosMaterial = (semana.archivos || []).filter(a => a.categoria === 'material');
              return archivosMaterial.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {archivosMaterial.map((archivo, i) => {
                    const Icon = getFileIcon(archivo.tipo);
                    return (
                      <div key={i} style={{ padding: 12, background: "var(--surface-variant)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon size={18} style={{ color: unidad.color }} />
                          <span style={{ fontSize: 14 }}>{archivo.nombre}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <a href={archivo.url} target="_blank" style={{ padding: 4 }}><Eye size={14} /></a>
                          <a href={archivo.url} download={archivo.nombre} style={{ padding: 4 }}><Download size={14} /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                (!semana.descripcion && !semana.contenido) ? (
                  <div style={{ padding: 24, textAlign: "center", background: "var(--surface-variant)", borderRadius: 8 }}>
                    <p className="text-muted">Contenido no disponible</p>
                  </div>
                ) : null
              );
            })()}
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} /> Actividades
            </h2>
            {(() => {
              const archivosActividad = (semana.archivos || []).filter(a => a.categoria === 'actividad' || !a.categoria);
              return archivosActividad.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {archivosActividad.map((archivo, i) => {
                    const Icon = getFileIcon(archivo.tipo);
                    return (
                      <div key={i} style={{ padding: 12, background: "var(--surface-variant)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon size={18} style={{ color: unidad.color }} />
                          <span style={{ fontSize: 14 }}>{archivo.nombre}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <a href={archivo.url} target="_blank" style={{ padding: 4 }}><Eye size={14} /></a>
                          <a href={archivo.url} download={archivo.nombre} style={{ padding: 4 }}><Download size={14} /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: 24, textAlign: "center", background: "var(--surface-variant)", borderRadius: 8 }}>
                  <File size={24} className="text-muted" style={{ margin: "0 auto 8px", display: "block" }} />
                  <p className="text-sm text-muted">Sin actividades disponibles</p>
                </div>
              );
            })()}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} /> Info
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Semana</span>
                <span>{semana.numero_semana}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Archivos</span>
                <span>{semana.archivos?.length || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Video</span>
                <span>{semana.video_url ? "✓ Disponible" : "No disponible"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}