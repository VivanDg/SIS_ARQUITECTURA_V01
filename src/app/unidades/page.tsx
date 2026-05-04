"use client";

import { useState, useEffect } from "react";
import { FolderOpen, FileText, ArrowRight, MoreVertical, BookOpen, Clock, CheckCircle, PlayCircle, File, FileImage, FileSpreadsheet, FileVideo } from "lucide-react";
import Link from "next/link";
import { getUnidades, Unidad } from "@/lib/data";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getUnidades();
      setUnidades(data);
    } catch (error) {
      console.error("Error cargando unidades:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div>Cargando unidades...</div>
      </div>
    );
  }

  const totalSemanas = unidades.reduce((acc, u) => acc + (u.semanas?.length || 0), 0);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unidades de Aprendizaje</h1>
        <p className="text-muted">{unidades.length} Unidades • {totalSemanas} Semanas de clase</p>
      </header>

      {unidades.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, background: "var(--surface-variant)", borderRadius: 12 }}>
          <BookOpen size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No hay unidades disponibles</h3>
          <p className="text-muted">El administrador debe crear las unidades primero.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {unidades.map((unidad) => (
            <div key={unidad.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--outline-variant)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: unidad.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="text-lg font-semibold" style={{ color: unidad.color }}>Unidad {unidad.id}</h2>
                  <p className="text-sm text-muted">{unidad.titulo}</p>
                </div>
                <span className="text-sm text-muted">{unidad.semanas?.length || 0} semanas</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(unidad.semanas || []).map((semana) => (
                  <Link 
                    key={semana.id} 
                    href={`/unidades/${unidad.id}/semana/${semana.numero_semana}`}
                    style={{ padding: 16, background: "var(--surface-variant)", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", textDecoration: "none" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: unidad.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>{semana.numero_semana}</div>
                        <h3 className="font-semibold" style={{ fontSize: 14 }}>{semana.titulo}</h3>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Clock size={14} className="text-muted" />
                        <span className="text-xs text-muted">Semana {semana.numero_semana}</span>
                      </div>
                    </div>
                    {semana.descripcion && (
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                        {semana.descripcion}
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              <Link href={`/unidades/${unidad.id}`} className="btn-login mt-4" style={{ width: "100%", justifyContent: "center", background: unidad.color, textAlign: "center" }}>
                <PlayCircle size={18} />
                Ver Contenido completo
              </Link>
            </div>
          ))}
        </div>
      )}

      {unidades.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 24 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="text-2xl font-bold" style={{ color: "#0058be" }}>{unidades.length}</div>
            <p className="text-sm text-muted">Unidades</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="text-2xl font-bold" style={{ color: "#6b38d4" }}>{totalSemanas}</div>
            <p className="text-sm text-muted">Semanas</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="text-2xl font-bold" style={{ color: "#924700" }}>{totalSemanas * 2}</div>
            <p className="text-sm text-muted">Clases</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="text-2xl font-bold" style={{ color: "#2170e4" }}>{totalSemanas * 4}</div>
            <p className="text-sm text-muted">Temas</p>
          </div>
        </div>
      )}
    </div>
  );
}