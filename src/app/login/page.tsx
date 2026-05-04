"use client";

import { useState } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      login();
      setLoading(false);
      router.push("/admin");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 16px", background: "var(--primary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogIn size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted mt-2">Accede al panel de administrador</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label className="text-sm font-medium mb-2" style={{ display: "block" }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--on-surface-variant)" }} size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" style={{ width: "100%", padding: "12px 12px 12px 44px", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: 8, color: "inherit", fontFamily: "inherit" }} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2" style={{ display: "block" }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--on-surface-variant)" }} size={20} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "12px 44px 12px 44px", background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: 8, color: "inherit", fontFamily: "inherit" }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: "var(--on-surface-variant)", border: "none", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-login" style={{ width: "100%", justifyContent: "center", padding: 12 }}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" className="text-primary">Volver al inicio</a>
        </p>
      </div>
    </div>
  );
}