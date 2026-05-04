"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ListMusic, Mic2, Music } from "lucide-react";
import Link from "next/link";
import { getMusica, Musica } from "@/lib/data";

const playlists = [
  { id: 1, title: "Todas las canciones", tracks: 0, duration: "0" },
];

export default function MusicaPage() {
  const [musica, setMusica] = useState<Musica[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Musica | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getMusica();
      setMusica(data || []);
      if (data && data.length > 0) {
        setCurrentTrack(data[0]);
        playlists[0].tracks = data.length;
      }
    } catch (error) {
      console.error("Error cargando música:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDuration = (duracion: string) => duracion || "0:00";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ color: "var(--text-3)" }}>Cargando música...</div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reproductor de Música</h1>
        <p className="text-muted">Playlists y laboratorio de audio</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ListMusic size={20} /> Playlists
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {playlists.map(p => (
              <div key={p.id} className="card card-hover">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted">{p.tracks} pistas</p>
              </div>
            ))}
            {musica.length === 0 && (
              <div style={{ textAlign: "center", padding: 20, color: "var(--text-3)" }}>
                <Music size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p>No hay música</p>
                <Link href="/admin" style={{ color: "var(--primary)", fontSize: 13 }}>
                  Agregar desde admin →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--outline-variant)", background: "var(--surface-variant)" }}>
              <h2 className="text-lg font-semibold">
                {currentTrack ? `Reproduciendo: ${currentTrack.album || currentTrack.titulo}` : 'Sin canción seleccionada'}
              </h2>
            </div>
            {musica.length > 0 ? (
              musica.map((track, i) => (
                <div 
                  key={track.id} 
                  onClick={() => setCurrentTrack(track)} 
                  style={{ 
                    padding: 16, 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    borderBottom: "1px solid var(--outline-variant)", 
                    cursor: "pointer",
                    background: currentTrack?.id === track.id ? "var(--surface-variant)" : "transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="text-muted">{i + 1}</span>
                    <div>
                      <p className="font-semibold">{track.titulo}</p>
                      <p className="text-sm text-muted">{track.artista || 'Artista desconocido'}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="text-sm text-muted">{track.duracion || '0:00'}</span>
                    <Heart size={18} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)" }}>
                No hay canciones disponibles
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface)", borderTop: "1px solid var(--outline-variant)", padding: 20, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Music size={24} color="white" />
            </div>
            <div>
              <p className="font-semibold">{currentTrack?.titulo || 'Sin canción'}</p>
              <p className="text-sm text-muted">{currentTrack?.artista || 'Selecciona una canción'}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer" }}><SkipBack size={20} /></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: "50%", 
                background: "var(--primary)", 
                color: "white", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: "none",
                cursor: "pointer"
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer" }}><SkipForward size={20} /></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Volume2 size={20} />
            <input type="range" style={{ width: 100 }} />
          </div>
        </div>
      </div>
    </div>
  );
}