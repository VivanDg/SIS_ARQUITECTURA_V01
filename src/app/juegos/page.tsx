"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Plus, Trophy, Cpu, Play, PlayCircle } from "lucide-react";
import Link from "next/link";
import { getJuegos, Juego } from "@/lib/data";

export default function JuegosPage() {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getJuegos();
      setJuegos(data || []);
      if (data && data.length > 0) {
        setJuegoSeleccionado(data[0]);
      }
    } catch (error) {
      console.error("Error cargando juegos:", error);
      setJuegos([]);
    } finally {
      setLoading(false);
    }
  }

  const topScores = [
    { rank: 1, player: "cyber_junkie", score: "1,240,500", time: "2h ago" },
    { rank: 2, player: "retro_queen", score: "980,200", time: "5h ago" },
    { rank: 3, player: "docker_master", score: "855,000", time: "1d ago" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ color: "var(--text-3)" }}>Cargando juegos...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Centro Arcade Retro</h1>
        <p className="text-muted">Juegos clásicos containerizados con Docker</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-variant)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Gamepad2 size={24} className="text-primary" />
              <span className="font-semibold">Estación de Juego</span>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> LISTO PARA JUGAR
            </span>
          </div>
          
          {juegoSeleccionado ? (
            <>
              <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", height: 300, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ textAlign: "center", color: "white" }}>
                  <PlayCircle size={80} style={{ opacity: 0.9 }} />
                  <p className="mt-4 text-lg" style={{ opacity: 0.8 }}>{juegoSeleccionado.titulo}</p>
                  <p style={{ opacity: 0.6, fontSize: 14 }}>{juegoSeleccionado.genero || 'Arcade'}</p>
                </div>
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 12, fontFamily: "monospace", color: "#22c55e", background: "rgba(0,0,0,0.6)", padding: 8, borderRadius: 4 }}>
                  <p>MODO: ARCADE</p>
                  <p>TIPO: {(juegoSeleccionado.tipo || 'WEB').toUpperCase()}</p>
                </div>
              </div>
              <div style={{ padding: 20, borderTop: "1px solid var(--outline-variant)" }}>
                <h3 className="text-xl font-bold mb-2">{juegoSeleccionado.titulo}</h3>
                <p className="text-muted mb-4">{juegoSeleccionado.descripcion || 'Sin descripción'}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ padding: "4px 12px", background: "var(--surface-variant)", borderRadius: 4, fontSize: 12 }}>
                    {juegoSeleccionado.genero || 'Arcade'}
                  </span>
                  <span className="text-sm text-muted">ID: {juegoSeleccionado.id}</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: "black", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#6b7280" }}>
                <Gamepad2 size={64} />
                <p className="mt-4">No hay juegos disponibles</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Trophy size={20} style={{ color: "#eab308" }} /> Mejores Puntuaciones
              </h3>
              <span className="text-xs text-muted">GLOBAL</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topScores.map(score => (
                <div key={score.rank} style={{ padding: 12, borderRadius: 8, background: score.rank === 1 ? "var(--surface-variant)" : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className={`text-lg font-bold ${score.rank === 1 ? "text-primary" : "text-muted"}`}>{score.rank}</span>
                    <div>
                      <p className="font-semibold">{score.player}</p>
                      <p className="text-xs text-muted">{score.time}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary" style={{ fontFamily: "monospace" }}>{score.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "#1e293b", color: "white" }}>
            <h3 className="font-semibold" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Cpu size={20} className="text-primary" /> Información Docker
            </h3>
            <p className="text-sm" style={{ opacity: 0.8, marginBottom: 12 }}>Los juegos se ejecutan en contenedores Docker para mantener el ambiente aislado.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", background: "rgba(255,255,255,0.1)" }}>DOCKER-CE</span>
              <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", background: "rgba(255,255,255,0.1)" }}>RETROARCH</span>
              <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, fontFamily: "monospace", background: "rgba(255,255,255,0.1)" }}>LIBRETRO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Biblioteca de Juegos</h2>
        {juegos.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {juegos.map(juego => (
              <div 
                key={juego.id} 
                className="card card-hover" 
                style={{ padding: 16, cursor: "pointer", border: juegoSeleccionado?.id === juego.id ? "2px solid var(--primary)" : "2px solid transparent" }}
                onClick={() => setJuegoSeleccionado(juego)}
              >
                <div style={{ height: 80, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Gamepad2 size={32} style={{ color: "white" }} />
                </div>
                <h4 className="font-semibold mb-1">{juego.titulo}</h4>
                <p className="text-xs text-muted">{juego.genero || 'Arcade'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>
            <Gamepad2 size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>No hay juegos en la biblioteca</p>
            <Link href="/admin" style={{ color: "var(--primary)", marginTop: 8, display: "block" }}>
              Agregar juegos desde el admin →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}