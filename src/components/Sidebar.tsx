"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Gamepad2, Music, User, Settings, Sun, Moon, ChevronDown, Folder, Layers, LogOut, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/unidades", label: "Unidades", icon: Layers },
];

const otrosItems = [
  { href: "/juegos", label: "Videojuegos", icon: Gamepad2 },
  { href: "/musica", label: "Música", icon: Music },
];

const aboutItems = [
  { href: "/sobre-mi", label: "Sobre Mí", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [otrosOpen, setOtrosOpen] = useState(true);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
        </div>
        <div className="logo-text">
          <h1>Portfolio</h1>
          <span>Arquitectura de Software</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? "active" : ""}`}>
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button onClick={() => setOtrosOpen(!otrosOpen)} className="nav-item nav-btn" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Folder size={22} />
            <span>Otros</span>
          </div>
          <ChevronDown size={18} style={{ transform: otrosOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }} />
        </button>

        {otrosOpen && otrosItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-item sub-item ${isActive(item.href) ? "active" : ""}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div style={{ borderTop: "1px solid var(--outline-variant)", margin: "8px 0", paddingTop: 8 }}>
          {aboutItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? "active" : ""}`}>
                <Icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <Link href="/admin" className="nav-item">
              <Settings size={22} />
              <span>Administrador</span>
            </Link>
            <button onClick={handleLogout} className="nav-item nav-btn" style={{ width: "100%" }}>
              <LogOut size={22} />
              <span>Cerrar Sesión</span>
            </button>
          </>
        ) : null}
        <button onClick={toggleTheme} className="nav-item nav-btn" style={{ width: "100%" }}>
          {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
          <span>{theme === "light" ? "Modo Oscuro" : "Modo Claro"}</span>
        </button>
      </div>
    </aside>
  );
}