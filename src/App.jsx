import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, ff, ffd } from "./design";
import LandingPage from "./pages/LandingPage";
import GeneratorPage from "./pages/GeneratorPage";
import TemplatesPage from "./pages/TemplatesPage";

const WA_NUMBER  = "918755807556";
const WA_MESSAGE = encodeURIComponent(
  "Hi Prafful! I found LocalRank and I'm interested in your services. Could you please share more details?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const NAV_LINKS = [
  { label: "Services",   href: "#services"   },
  { label: "Showcase",   href: "#showcase"   },
  { label: "Pricing",    href: "#pricing"    },
  { label: "Contact",    href: "#contact"    },
];

function Logo({ onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        background: C.grad, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff",
        boxShadow: `0 0 20px rgba(0,210,106,0.35)`,
      }}>L</div>
      <span style={{ fontFamily: ffd, fontSize: "18px", fontWeight: 700, color: C.white }}>
        Local<span style={{ color: C.green }}>Rank</span>
      </span>
    </div>
  );
}

function Navbar({ page, setPage, scrolled }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(7,11,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{
        maxWidth: "1160px", margin: "0 auto", padding: "0 28px",
        height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo onClick={() => setPage("landing")} />

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {page === "landing" && NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: C.mutedLight, fontSize: "13.5px", fontWeight: 500,
                padding: "7px 14px", borderRadius: "8px", textDecoration: "none",
                transition: "color 0.2s, background 0.2s",
                fontFamily: ff,
              }}
              onMouseEnter={e => { e.target.style.color = C.white; e.target.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.target.style.color = C.mutedLight; e.target.style.background = "transparent"; }}
            >
              {label}
            </a>
          ))}

          {/* Tool links — subtle, for agency use */}
          <button
            onClick={() => setPage(page === "generator" ? "landing" : "generator")}
            style={{
              background: "rgba(255,255,255,0.05)", color: C.mutedLight,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "7px 14px", borderRadius: "8px",
              fontSize: "12.5px", fontWeight: 500,
              cursor: "pointer", fontFamily: ff,
              marginLeft: "6px",
            }}
          >
            {page === "generator" ? "← Home" : "Audit Tool"}
          </button>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              background: C.grad,
              color: "#fff", padding: "9px 20px",
              borderRadius: "8px", fontSize: "13px", fontWeight: 700,
              textDecoration: "none", fontFamily: ff, marginLeft: "8px",
              boxShadow: "0 0 20px rgba(0,210,106,0.25)",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

// ── Floating WhatsApp button ───────────────────────────────────
function WhatsAppFAB() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "fixed", bottom: "28px", right: "28px", zIndex: 2000,
        width: "58px", height: "58px", borderRadius: "50%",
        background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 24px rgba(37,211,102,0.5)",
        textDecoration: "none",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {/* Pulse ring */}
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "rgba(37,211,102,0.4)",
        animation: "waPulse 2s ease-out infinite",
      }} />
    </motion.a>
  );
}

// ── App root ──────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("landing");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        select option { color: #111 !important; background: #fff !important; }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: ${C.green} !important; }
        a { color: inherit; }

        /* Gradient text utility */
        .grad-text {
          background: ${C.grad};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-text-purple {
          background: ${C.gradPurple};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Keyframes */
        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-40px) scale(1.06); }
          66% { transform: translate(-30px,25px) scale(0.94); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes waPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(0,210,106,0.3); box-shadow: 0 0 20px rgba(0,210,106,0.1); }
          50%       { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 30px rgba(59,130,246,0.15); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar page={page} setPage={setPage} scrolled={scrolled} />
      <WhatsAppFAB />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ paddingTop: page === "landing" ? 0 : "64px" }}
        >
          {page === "landing"   && <LandingPage   onNavigate={setPage} />}
          {page === "generator" && <GeneratorPage onNavigate={setPage} />}
          {page === "templates" && <TemplatesPage onNavigate={setPage} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
