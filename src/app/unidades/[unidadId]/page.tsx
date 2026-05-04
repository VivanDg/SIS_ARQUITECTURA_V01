"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle, FileText, File, FileImage, FileSpreadsheet, FileVideo, Download, Eye, Upload } from "lucide-react";
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

export default function UnidadDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [unidad, setUnidad] = useState<Unidad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.unidadId]);

  async function loadData() {
    try {
      const data = await getUnidadById(Number(params.unidadId));
      setUnidad(data);
    } catch (error) {
      console.error("Error cargando unidad:", error);
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

  return (
    <div>
      <header className="mb-8">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/unidades" className="btn-login" style={{ padding: 8 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: unidad.color }}>Unidad {unidad.id}: {unidad.titulo}</h1>
            <p className="text-muted">{unidad.descripcion}</p>
          </div>
        </div>
      </header>

      {(unidad.semanas || []).length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: "var(--surface-variant)", borderRadius: 12 }}>
          <File size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No hay semanas disponibles</h3>
          <p className="text-muted">El administrador debe crear las semanas primero.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {(unidad.semanas || []).map((semana) => (
            <div key={semana.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--outline-variant)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: unidad.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>{semana.numero_semana}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="text-lg font-semibold">Semana {semana.numero_semana}</h2>
                  <p className="text-sm text-muted">{semana.titulo}</p>
                </div>
              </div>

              {semana.descripcion && (
                <div style={{ marginBottom: 16 }}>
                  <h3 className="text-sm font-semibold mb-2">Descripción:</h3>
                  <p className="text-sm text-muted">{semana.descripcion}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-4">Archivos adjuntos:</h3>
                {(semana.archivos && semana.archivos.length > 0) ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(semana.archivos || []).map((archivo, i) => {
                      const Icon = getFileIcon(archivo.tipo);
                      return (
                        <div key={i} style={{ padding: 12, background: "var(--surface-variant)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Icon size={20} style={{ color: unidad.color }} />
                            <span>{archivo.nombre}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <a href={archivo.url} target="_blank" className="btn-login" style={{ padding: "6px 12px", fontSize: 12 }}><Eye size={14} /> Ver</a>
                            <a href={archivo.url} download={archivo.nombre} className="btn-login" style={{ padding: "6px 12px", fontSize: 12 }}><Download size={14} /></a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: 24, textAlign: "center", background: "var(--surface-variant)", borderRadius: 8 }}>
                    <File size={24} className="text-muted" style={{ margin: "0 auto 8px", display: "block" }} />
                    <p className="text-muted">No hay archivos cargados</p>
                  </div>
                )}
              </div>

              <Link href={`/unidades/${unidad.id}/semana/${semana.numero_semana}`} className="btn-login mt-4" style={{ width: "100%", justifyContent: "center", background: unidad.color }}>
                <PlayCircle size={18} />
                Ver clase completa
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}