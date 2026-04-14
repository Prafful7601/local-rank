import { useState } from "react";
import { C, ff, ffd } from "./design";
import LandingPage from "./pages/LandingPage";
import GeneratorPage from "./pages/GeneratorPage";
import TemplatesPage from "./pages/TemplatesPage";

function Navbar({ page, setPage }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: `${C.bg}E8`, backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: "1080px", margin: "0 auto", padding: "0 28px",
        height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div
          onClick={() => setPage("landing")}
          style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px", background: C.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.bg, fontSize: "14px", fontWeight: 800,
          }}>L</div>
          <span style={{ fontFamily: ffd, fontSize: "17px", fontWeight: 700 }}>LocalRank</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {[
            { id: "landing",   label: "Home" },
            { id: "generator", label: "Audit Generator" },
            { id: "templates", label: "Email Templates" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                background: page === id ? C.greenDim : "transparent",
                color: page === id ? C.green : C.muted,
                border: page === id ? `1px solid ${C.greenBorder}` : "1px solid transparent",
                padding: "6px 14px", borderRadius: "6px",
                fontSize: "13px", fontWeight: page === id ? 600 : 500,
                cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setPage("generator")}
            style={{
              background: C.green, color: C.bg, padding: "7px 16px",
              borderRadius: "6px", fontSize: "12.5px", fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: ff, marginLeft: "6px",
            }}
          >
            Get Free Audit
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: ${C.green} !important; }
        button { transition: opacity 0.15s; }
        button:hover { opacity: 0.88; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <Navbar page={page} setPage={setPage} />

      <div style={{ paddingTop: "58px" }}>
        {page === "landing"    && <LandingPage   onNavigate={setPage} />}
        {page === "generator"  && <GeneratorPage onNavigate={setPage} />}
        {page === "templates"  && <TemplatesPage onNavigate={setPage} />}
      </div>
    </div>
  );
}
