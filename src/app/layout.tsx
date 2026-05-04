import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export const metadata: Metadata = {
  title: "TechPortfolio",
  description: "Software Architecture Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ParticlesBackground />
            <div className="app-layout">
              <Sidebar />
              <div className="main-content">
                <Navbar />
                <main className="main">
                  {children}
                </main>
                <footer className="footer">
                  <span>© 2024 TechPortfolio. All rights reserved.</span>
                  <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                  </div>
                </footer>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}