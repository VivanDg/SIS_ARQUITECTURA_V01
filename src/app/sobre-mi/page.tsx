"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Github, Linkedin, MapPin, Calendar, Award, Code, ExternalLink } from "lucide-react";
import { getPerfil, getHabilidades, getEducacion, getProyectos, Perfil, Habilidad, Educacion, Proyecto } from "@/lib/data";

export default function SobreMiPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [educacion, setEducacion] = useState<Educacion[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [perfilData, habilidadesData, educacionData, proyectosData] = await Promise.all([
        getPerfil(),
        getHabilidades(),
        getEducacion(),
        getProyectos()
      ]);
      setPerfil(perfilData);
      setHabilidades(habilidadesData);
      setEducacion(educacionData);
      setProyectos(proyectosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ color: "var(--text-3)" }}>Cargando...</div>
      </div>
    );
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sobre Mí</h1>
        <p className="text-muted">Perfil profesional y portafolio</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ width: 128, height: 128, margin: "0 auto 16px", background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {perfil?.imagen ? (
                <img src={perfil.imagen} alt="Perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span className="text-4xl font-bold" style={{ color: "white" }}>{getInitial(perfil?.nombre || "U")}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{perfil?.nombre || "Usuario"}</h2>
            <p className="text-muted mt-2">{perfil?.bio || "Sin descripción"}</p>

            <div style={{ marginTop: 24, textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><MapPin size={18} className="text-primary" /><span>{perfil?.ubicacion || "Sin ubicación"}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Mail size={18} className="text-primary" /><span>{perfil?.email || "Sin email"}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Phone size={18} className="text-primary" /><span>{perfil?.telefono || "Sin teléfono"}</span></div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 16 }}>
              {perfil?.github && (
                <a href={perfil.github.startsWith("http") ? perfil.github : `https://${perfil.github}`} target="_blank" style={{ padding: 12, background: "var(--surface-variant)", borderRadius: 8 }}><Github size={20} /></a>
              )}
              {perfil?.linkedin && (
                <a href={perfil.linkedin.startsWith("http") ? perfil.linkedin : `https://${perfil.linkedin}`} target="_blank" style={{ padding: 12, background: "var(--surface-variant)", borderRadius: 8 }}><Linkedin size={20} /></a>
              )}
            </div>
          </div>

          <div className="card mt-4">
            <h3 className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Award size={20} /> Educación
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {educacion.map(e => (
                <div key={e.id} style={{ borderLeft: "2px solid var(--primary)", paddingLeft: 16 }}>
                  <p className="font-semibold">{e.titulo}</p>
                  <p className="text-sm text-muted">{e.institucion}</p>
                  <p className="text-xs text-muted">{e.periodo}</p>
                </div>
              ))}
              {educacion.length === 0 && (
                <p className="text-muted text-sm">Sin educación registrada</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h3 className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Code size={20} /> Habilidades Técnicas
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {habilidades.map(skill => (
                <div key={skill.id}>
                  <p className="font-semibold text-sm mb-2">{skill.categoria}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skill.items.map((item, i) => (
                      <span key={i} style={{ padding: "4px 8px", background: "var(--surface-variant)", borderRadius: 4, fontSize: 12 }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
              {habilidades.length === 0 && (
                <p className="text-muted text-sm">Sin habilidades registradas</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Proyectos Destacados</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {proyectos.map(p => (
                <div key={p.id} style={{ padding: 16, background: "var(--surface-variant)", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <h4 className="font-semibold">{p.titulo}</h4>
                    {p.enlace && (
                      <a href={p.enlace} target="_blank" className="text-primary text-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        Ver más <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-2">{p.descripcion}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(p.tecnologias || []).map((t, i) => (
                      <span key={i} style={{ padding: "4px 8px", background: "var(--surface)", borderRadius: 4, fontSize: 12, border: "1px solid var(--outline-variant)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {proyectos.length === 0 && (
                <p className="text-muted text-sm">Sin proyectos registrados</p>
              )}
            </div>
          </div>

          <div style={{ background: "linear-gradient(to right, var(--primary), var(--secondary))", borderRadius: 12, padding: 24, color: "white" }}>
            <h3 className="text-lg font-semibold mb-2">¿Interesado en colaborar?</h3>
            <p style={{ opacity: 0.9, marginBottom: 16 }}>Siempre estoy abierto a nuevos proyectos.</p>
            <a href={`mailto:${perfil?.email || "email@ejemplo.com"}`} className="btn-login">
              <Mail size={18} /> Contáctame
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}