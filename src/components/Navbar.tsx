"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const btnStyle = {
    background: isDark ? "var(--surface-variant)" : "var(--surface)",
    color: isDark ? "var(--on-surface)" : "var(--on-surface)",
    border: `1px solid ${isDark ? "var(--outline-variant)" : "var(--outline)"}`,
    boxShadow: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    transition: "all 0.2s",
  };
  
  return (
    <nav className="navbar">
      <Link href="/login" style={btnStyle}>
        <LogIn size={18} />
        <span>Iniciar Sesión</span>
      </Link>
    </nav>
  );
}