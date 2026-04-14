import { useState, useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { C, ff, ffd, glass, glassBright } from "../design";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const EMAIL    = "prafful.connect1@gmail.com";
const WA_NUM   = "918755807556";
const WA_BASE  = `https://wa.me/${WA_NUM}?text=`;

const CONTACT_SERVICES = ["Google Business Profile Optimization", "Custom Website Design", "Both Services", "Just Exploring"];

const STATS = [
  { value: 200, suffix: "+", label: "Businesses Helped"    },
  { value: 34,  suffix: "",  label: "Avg. Issues Fixed"    },
  { value: 93,  suffix: "%", label: "Rank Within 30 Days"  },
  { value: 4.9, suffix: "★", label: "Client Rating"        },
];

const WEBSITE_TYPES = [
  {
    name: "Restaurant & Food",
    style: "Bold · Immersive",
    desc: "Full-screen food photography, online menu, reservation & ordering system.",
    icon: "🍽️",
    from: "#FF6B35", to: "#F7931E",
    features: ["Online Ordering", "Menu Builder", "Table Reservations"],
    accent: "#FF6B35",
  },
  {
    name: "Medical & Dental",
    style: "Clean · Trustworthy",
    desc: "Doctor profiles, appointment booking, patient portal integration.",
    icon: "🏥",
    from: "#0EA5E9", to: "#06B6D4",
    features: ["Appointment Booking", "Doctor Profiles", "Patient FAQ"],
    accent: "#0EA5E9",
  },
  {
    name: "Law & Professional",
    style: "Elegant · Authoritative",
    desc: "Case studies, consultation booking, trust-building design with dark gold.",
    icon: "⚖️",
    from: "#78350F", to: "#D97706",
    features: ["Case Studies", "Consultation Form", "Team Profiles"],
    accent: "#D97706",
  },
  {
    name: "E-commerce / D2C Brand",
    style: "Vibrant · Conversion-First",
    desc: "Product catalog, cart, payment gateway, WhatsApp integration for orders.",
    icon: "🛍️",
    from: "#7C3AED", to: "#EC4899",
    features: ["Product Catalog", "Payment Gateway", "WhatsApp Orders"],
    accent: "#7C3AED",
  },
  {
    name: "Real Estate",
    style: "Premium · Visual",
    desc: "Property listings, virtual tours, EMI calculator, lead capture forms.",
    icon: "🏡",
    from: "#065F46", to: "#10B981",
    features: ["Property Listings", "EMI Calculator", "Virtual Tours"],
    accent: "#10B981",
  },
  {
    name: "Local Trade Services",
    style: "Bold · Trust-Focused",
    desc: "For plumbers, electricians, HVAC — built to rank on Google & capture leads.",
    icon: "🔧",
    from: "#1E3A8A", to: "#3B82F6",
    features: ["Service Areas", "Quote Request", "Google Reviews Feed"],
    accent: "#3B82F6",
  },
];

const GBP_FEATURES = [
  { icon: "📍", title: "Profile Optimization",    desc: "Full 25-point audit + fix every gap your competitors are exploiting." },
  { icon: "📸", title: "Photo Strategy",          desc: "Professional photo guidelines that get 520% more calls." },
  { icon: "⭐", title: "Review Generation",       desc: "Systematic review-collection workflow — 5-10 new reviews per month." },
  { icon: "📝", title: "Google Posts",            desc: "Weekly posting strategy to signal activity and boost local ranking." },
  { icon: "🔍", title: "Category & Keyword Fix",  desc: "Add the right categories so Google knows exactly who to show you to." },
  { icon: "📊", title: "Competitor Analysis",     desc: "Side-by-side breakdown vs. your top 5 local rivals." },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Tell us about your business",    desc: "Fill in your business name, city, and industry. Takes 30 seconds.", icon: "💬" },
  { n: "02", title: "We run a full AI-powered audit", desc: "Our system scans 25+ ranking factors and benchmarks you against competitors.", icon: "🤖" },
  { n: "03", title: "You get a detailed report",      desc: "Score, every issue found, competitor breakdown, and a week-by-week fix plan.", icon: "📋" },
  { n: "04", title: "We fix it — or you do",          desc: "Implement the recommendations yourself, or let us handle everything.", icon: "🚀" },
];

const PRICING = [
  {
    name: "Free Audit",    price: "₹0",   desc: "See exactly where you stand",
    features: ["Profile health score (0-100)", "Top 3 critical issues", "Competitor snapshot", "Instant delivery"],
    cta: "Get Free Audit", featured: false, ctaAction: "audit",
  },
  {
    name: "Full Optimization", price: "₹7,999", desc: "We fix everything",
    features: ["Complete 25-point audit", "All issues fixed by us", "Photo & description rewrite", "Review generation setup", "4-week Google Posts", "30-day results check"],
    cta: "Get Started", featured: true, ctaAction: "contact",
  },
  {
    name: "Website + GBP", price: "₹24,999", desc: "The complete digital presence",
    features: ["Everything in Full Optimization +", "Custom website (5-7 pages)", "Mobile-first design", "Google-ready SEO structure", "WhatsApp integration", "3-month support"],
    cta: "Let's Talk", featured: false, ctaAction: "contact",
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function fadeUp(delay = 0) {
  return {
    initial:    { opacity: 0, y: 32 },
    whileInView:{ opacity: 1, y: 0  },
    viewport:   { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

function AnimatedCounter({ target, suffix }) {
  const ref   = useRef(null);
  const [val, setVal] = useState(0);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setVal(target % 1 !== 0 ? parseFloat(v.toFixed(1)) : Math.floor(v)),
    });
    return controls.stop;
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Background orbs
// ─────────────────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { color:"rgba(0,210,106,0.12)",   size:700, x:-200, y:-100, delay:"0s"   },
        { color:"rgba(59,130,246,0.1)",   size:600, x:"60%", y:"10%", delay:"3s" },
        { color:"rgba(139,92,246,0.08)",  size:500, x:"20%", y:"60%", delay:"6s" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          left: orb.x, top: orb.y,
          width: orb.size, height: orb.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          animation: `floatOrb ${18 + i * 4}s ease-in-out infinite`,
          animationDelay: orb.delay,
          filter: "blur(1px)",
        }} />
      ))}
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Free Audit Form (embedded)
// ─────────────────────────────────────────────────────────────
const NICHES = ["Plumbing","HVAC","Electrical","Dental","Roofing","Landscaping","Chiropractic","Auto Repair","Physical Therapy","Restaurant","Medical","Law Firm","Real Estate","Other"];

function FreeAuditForm() {
  const [biz,     setBiz]     = useState("");
  const [city,    setCity]    = useState("");
  const [niche,   setNiche]   = useState("Plumbing");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [error,   setError]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!biz.trim() || !city.trim()) { setError("Please fill in both fields"); return; }
    setError(""); setLoading(true); setResult(null); setAiInsight(null);

    // Import audit engine dynamically
    const { generateAudit } = await import("../engine/audit.js");
    await new Promise(r => setTimeout(r, 900));
    const data = generateAudit(biz.trim(), city.trim(), niche);
    setResult(data);

    // Try Grok enhancement
    try {
      const res = await fetch("/api/audit/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: data.business, city: data.city,
          niche: data.niche, score: data.score,
          issues: data.issues.slice(0, 5),
        }),
      });
      const json = await res.json();
      if (json.success && json.insights) setAiInsight(json.insights);
    } catch {}

    setLoading(false);
  }

  const inp = {
    width: "100%", padding: "13px 16px",
    borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)", color: C.white,
    fontSize: "14px", fontFamily: ff,
  };

  if (result) {
    const color = result.score < 40 ? C.red : result.score < 60 ? C.orange : C.green;
    const topIssues = result.issues.filter(i => i.severity === "HIGH").slice(0, 3);
    const waMsg = encodeURIComponent(
      `Hi Prafful! I just ran a free GBP audit for ${result.business} in ${result.city} and got a score of ${result.score}/100. I'd love to discuss the full optimization. Can we connect?`
    );
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        {/* Score */}
        <div style={{
          ...glass, padding: "24px", marginBottom: "16px", textAlign: "center",
          border: `1px solid ${color}33`,
        }}>
          <div style={{ fontSize: "11px", color: C.mutedLight, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
            Profile Health Score
          </div>
          <div style={{ fontFamily: ffd, fontSize: "72px", fontWeight: 900, color, lineHeight: 1 }}>
            {result.score}
          </div>
          <div style={{ fontSize: "13px", color: C.mutedLight, marginTop: "4px" }}>out of 100</div>
          <div style={{
            width: "100%", height: "6px", background: "rgba(255,255,255,0.08)",
            borderRadius: "3px", marginTop: "16px", overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              style={{ height: "100%", background: color, borderRadius: "3px" }}
            />
          </div>
        </div>

        {/* AI insight */}
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{
              ...glass, padding: "16px 20px", marginBottom: "16px",
              border: "1px solid rgba(59,130,246,0.25)",
              background: "rgba(59,130,246,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>🤖</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "1px" }}>
                AI Insight (Grok)
              </span>
            </div>
            <p style={{ fontSize: "13px", color: C.mutedLight, lineHeight: 1.7, marginBottom: "8px" }}>
              {aiInsight.summary}
            </p>
            {aiInsight.quickWin && (
              <div style={{ background: "rgba(0,210,106,0.08)", borderRadius: "6px", padding: "10px 12px", fontSize: "12.5px", color: C.green }}>
                <strong>Quick win:</strong> {aiInsight.quickWin}
              </div>
            )}
          </motion.div>
        )}

        {/* Top issues */}
        <div style={{ ...glass, padding: "16px 20px", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            Top 3 Critical Issues
          </div>
          {topIssues.map((iss, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{
                display: "flex", gap: "10px", padding: "10px 0",
                borderBottom: i < topIssues.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <span style={{
                fontSize: "9px", fontWeight: 800, padding: "3px 8px", borderRadius: "4px",
                background: C.redDim, color: C.red, flexShrink: 0, alignSelf: "flex-start", marginTop: "2px",
              }}>HIGH</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{iss.title}</div>
                <div style={{ fontSize: "11.5px", color: C.mutedLight, lineHeight: 1.5 }}>{iss.impact}</div>
              </div>
            </motion.div>
          ))}
          <div style={{ marginTop: "12px", fontSize: "12px", color: C.mutedLight }}>
            + {result.issues.length - 3} more issues in the full report
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href={`${WA_BASE}${waMsg}`}
            target="_blank" rel="noreferrer"
            style={{
              flex: 1, padding: "13px", borderRadius: "10px",
              background: "#25D366", color: "#fff",
              fontSize: "13.5px", fontWeight: 700, textAlign: "center",
              textDecoration: "none", fontFamily: ff,
            }}
          >
            Get Full Audit on WhatsApp →
          </a>
          <button
            onClick={() => { setResult(null); setAiInsight(null); }}
            style={{
              padding: "13px 18px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)", color: C.mutedLight,
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "13px", cursor: "pointer", fontFamily: ff,
            }}
          >
            New Audit
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input style={inp} placeholder="Business name (e.g. Sharma Dental Clinic)" value={biz} onChange={e => { setBiz(e.target.value); setError(""); }} />
      <input style={inp} placeholder="City (e.g. Delhi, Mumbai, Bangalore)" value={city} onChange={e => { setCity(e.target.value); setError(""); }} />
      <select style={{ ...inp, cursor: "pointer", appearance: "none" }} value={niche} onChange={e => setNiche(e.target.value)}>
        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      {error && <div style={{ fontSize: "12.5px", color: C.red, padding: "8px 12px", background: C.redDim, borderRadius: "8px" }}>{error}</div>}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: "15px", borderRadius: "10px",
          background: loading ? "rgba(255,255,255,0.08)" : C.grad,
          color: "#fff", fontSize: "15px", fontWeight: 700,
          border: "none", cursor: loading ? "wait" : "pointer",
          fontFamily: ff, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          boxShadow: loading ? "none" : "0 0 30px rgba(0,210,106,0.2)",
        }}
      >
        {loading
          ? <><span style={{ width: "16px", height: "16px", border: "2.5px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Analyzing your profile…</>
          : "⚡ Get My Free Audit Score"
        }
      </motion.button>
      <p style={{ fontSize: "11px", color: C.muted, textAlign: "center" }}>Free · Instant · No credit card</p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Website Mockup (CSS art)
// ─────────────────────────────────────────────────────────────
function WebsiteMockup({ from, to, accent, icon }) {
  const grad = `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
  return (
    <div style={{ height: "180px", background: grad, position: "relative", overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
      {/* Fake browser bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "26px", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", padding: "0 10px", gap: "5px" }}>
        {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, height: "12px", background: "rgba(255,255,255,0.12)", borderRadius: "6px", marginLeft: "8px" }} />
      </div>
      {/* Hero area */}
      <div style={{ position: "absolute", top: "36px", left: "14px", right: "14px" }}>
        <div style={{ width: "55%", height: "10px", background: "rgba(255,255,255,0.9)", borderRadius: "3px", marginBottom: "6px" }} />
        <div style={{ width: "38%", height: "7px", background: "rgba(255,255,255,0.5)", borderRadius: "3px", marginBottom: "12px" }} />
        <div style={{ width: "72px", height: "22px", background: accent, borderRadius: "6px", opacity: 0.95, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "40px", height: "5px", background: "rgba(255,255,255,0.8)", borderRadius: "2px" }} />
        </div>
      </div>
      {/* Feature cards at bottom */}
      <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "14px", display: "flex", gap: "6px" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: "36px", background: "rgba(255,255,255,0.12)", borderRadius: "6px", backdropFilter: "blur(4px)" }} />
        ))}
      </div>
      {/* Large emoji watermark */}
      <div style={{ position: "absolute", right: "16px", top: "36px", fontSize: "42px", opacity: 0.15 }}>{icon}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact Form
// ─────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "done" | "error"

  function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setStatus(json.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)", color: C.white,
    fontSize: "14px", fontFamily: ff, resize: "vertical",
  };

  const waMsg = encodeURIComponent(
    `Hi Prafful! I'd like to discuss ${form.service || "your services"}. My name is ${form.name || "..."}.`
  );

  if (status === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ ...glass, padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h3 style={{ fontFamily: ffd, fontSize: "22px", fontWeight: 700, color: C.green, marginBottom: "8px" }}>Message Received!</h3>
        <p style={{ color: C.mutedLight, marginBottom: "24px", lineHeight: 1.7 }}>
          I'll get back to you within 24 hours.<br />
          For faster response, ping me on WhatsApp.
        </p>
        <a
          href={`${WA_BASE}${waMsg}`}
          target="_blank" rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 24px", borderRadius: "10px",
            background: "#25D366", color: "#fff",
            fontSize: "14px", fontWeight: 700, textDecoration: "none", fontFamily: ff,
          }}
        >
          Continue on WhatsApp →
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} style={{ ...glass, padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" }}>Name *</label>
          <input style={inp} placeholder="Your name" value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" }}>Email *</label>
          <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" }}>Phone</label>
          <input style={inp} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" }}>Service</label>
          <select style={{ ...inp, cursor: "pointer", appearance: "none" }} value={form.service} onChange={set("service")}>
            <option value="">Select service…</option>
            {CONTACT_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" }}>Message *</label>
        <textarea style={{ ...inp, minHeight: "110px" }} placeholder="Tell me about your business and what you're looking to achieve…" value={form.message} onChange={set("message")} required />
      </div>
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: "14px", borderRadius: "10px",
          background: status === "sending" ? "rgba(255,255,255,0.08)" : C.grad,
          color: "#fff", fontSize: "15px", fontWeight: 700,
          border: "none", cursor: status === "sending" ? "wait" : "pointer",
          fontFamily: ff, boxShadow: status === "sending" ? "none" : "0 0 28px rgba(0,210,106,0.2)",
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message →"}
      </motion.button>
      {status === "error" && <p style={{ fontSize: "12px", color: C.red, textAlign: "center" }}>Something went wrong. Please try WhatsApp instead.</p>}
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <BackgroundOrbs />

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 0 80px", position: "relative" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: "64px", alignItems: "center" }}>

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: C.greenDim, border: `1px solid ${C.greenBorder}`,
                  borderRadius: "100px", padding: "6px 16px", marginBottom: "28px",
                }}
              >
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 10px ${C.green}`, display: "block" }} />
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: C.green }}>Local SEO & Web Design — India & Beyond</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: ffd, fontSize: "60px", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "22px" }}
              >
                We Get Your Business{" "}
                <span className="grad-text">Found. Fast.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: "17px", color: C.mutedLight, lineHeight: 1.75, maxWidth: "500px", marginBottom: "36px" }}
              >
                Google Business Profile optimization + custom websites that rank.
                Local businesses across India use LocalRank to beat their competitors on Google Maps.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}
              >
                <a
                  href="#audit"
                  style={{
                    padding: "15px 30px", borderRadius: "12px",
                    background: C.grad, color: "#fff",
                    fontSize: "15px", fontWeight: 700, textDecoration: "none", fontFamily: ff,
                    boxShadow: "0 0 40px rgba(0,210,106,0.3)",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  ⚡ Get Free Audit Score
                </a>
                <a
                  href="#showcase"
                  style={{
                    padding: "15px 28px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: C.white, fontSize: "15px", fontWeight: 600,
                    textDecoration: "none", fontFamily: ff,
                  }}
                >
                  See Website Designs →
                </a>
              </motion.div>

              {/* Social proof avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div style={{ display: "flex" }}>
                  {["#FF6B35","#8B5CF6","#0EA5E9","#10B981","#F59E0B"].map((c, i) => (
                    <div key={i} style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c}, ${c}99)`,
                      border: "2px solid " + C.bg,
                      marginLeft: i === 0 ? 0 : "-10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 700, color: "#fff",
                    }}>
                      {["R","S","A","P","M"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ color: C.gold, fontSize: "13px" }}>★</span>)}
                  </div>
                  <div style={{ fontSize: "12px", color: C.mutedLight }}>200+ happy businesses</div>
                </div>
              </motion.div>
            </div>

            {/* Right — Audit widget */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              id="audit"
              style={{
                ...glass,
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                animation: "floatSlow 6s ease-in-out infinite",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>
                  Free Instant Audit
                </div>
                <h3 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 800 }}>
                  How does your Google listing score?
                </h3>
              </div>
              <FreeAuditForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div
            {...fadeUp()}
            style={{
              ...glass,
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: "30px 24px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <div style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 900, color: C.white, lineHeight: 1 }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "13px", color: C.mutedLight, marginTop: "6px", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════════ */}
      <section id="services" style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: C.green }}>What We Do</span>
            <h2 style={{ fontFamily: ffd, fontSize: "44px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "10px", lineHeight: 1.1 }}>
              Two services. One goal:<br />
              <span className="grad-text">More customers finding you.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* GBP Card */}
            <motion.div
              {...fadeUp(0.1)}
              whileHover={{ y: -6 }}
              style={{
                ...glass, padding: "36px",
                border: "1px solid rgba(0,210,106,0.15)",
                background: "linear-gradient(135deg, rgba(0,210,106,0.06) 0%, rgba(59,130,246,0.04) 100%)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "160px", height: "160px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,210,106,0.12) 0%, transparent 70%)",
              }} />
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>📍</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                Google Business Profile
              </div>
              <h3 style={{ fontFamily: ffd, fontSize: "26px", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>
                Dominate Google Maps & Local Search
              </h3>
              <p style={{ fontSize: "14.5px", color: C.mutedLight, lineHeight: 1.75, marginBottom: "28px" }}>
                93% of customers check Google before visiting a local business. If your profile is incomplete, your competitors are taking those calls.
                We fix that — guaranteed.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                {GBP_FEATURES.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, marginBottom: "2px" }}>{f.title}</div>
                      <div style={{ fontSize: "11.5px", color: C.muted, lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#pricing" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "12px 22px", borderRadius: "10px",
                background: C.greenDim, border: `1px solid ${C.greenBorder}`,
                color: C.green, fontSize: "13.5px", fontWeight: 700,
                textDecoration: "none", fontFamily: ff,
              }}>
                See Pricing →
              </a>
            </motion.div>

            {/* Website Card */}
            <motion.div
              {...fadeUp(0.2)}
              whileHover={{ y: -6 }}
              style={{
                ...glass, padding: "36px",
                border: "1px solid rgba(139,92,246,0.15)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(236,72,153,0.04) 100%)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "160px", height: "160px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
              }} />
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>🌐</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
                Website Design
              </div>
              <h3 style={{ fontFamily: ffd, fontSize: "26px", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>
                Websites That Actually Convert
              </h3>
              <p style={{ fontSize: "14.5px", color: C.mutedLight, lineHeight: 1.75, marginBottom: "28px" }}>
                Beautiful, fast, mobile-first websites built to rank on Google and turn visitors into paying customers.
                From restaurants to real estate — we've designed them all.
              </p>
              {[
                "Mobile-first, Google-ready design",
                "WhatsApp & booking integrations",
                "SEO-optimized from day one",
                "Delivered in 7-14 days",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: C.purpleDim, border: `1px solid rgba(139,92,246,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: C.purple, fontSize: "10px", fontWeight: 800 }}>✓</span>
                  </div>
                  <span style={{ fontSize: "13.5px", color: C.mutedLight }}>{f}</span>
                </div>
              ))}
              <a href="#showcase" style={{
                display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "18px",
                padding: "12px 22px", borderRadius: "10px",
                background: C.purpleDim, border: `1px solid rgba(139,92,246,0.3)`,
                color: C.purple, fontSize: "13.5px", fontWeight: 700,
                textDecoration: "none", fontFamily: ff,
              }}>
                See Portfolio →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: C.green }}>The Process</span>
            <h2 style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "10px" }}>
              From audit to results in weeks
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -4, background: "rgba(255,255,255,0.07)" }}
                style={{ ...glass, padding: "28px 22px", position: "relative", cursor: "default" }}
              >
                <div style={{
                  position: "absolute", top: "18px", right: "18px",
                  fontFamily: ffd, fontSize: "40px", fontWeight: 900,
                  color: "rgba(255,255,255,0.04)", lineHeight: 1,
                }}>
                  {step.n}
                </div>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{step.icon}</div>
                <h3 style={{ fontFamily: ffd, fontSize: "17px", fontWeight: 800, marginBottom: "10px", lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: C.mutedLight, lineHeight: 1.7 }}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position: "absolute", right: "-12px", top: "50%",
                    transform: "translateY(-50%)",
                    color: C.muted, fontSize: "20px", zIndex: 2,
                  }}>›</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WEBSITE SHOWCASE
      ═══════════════════════════════════════════════════ */}
      <section id="showcase" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: C.purple }}>Website Portfolio</span>
            <h2 style={{ fontFamily: ffd, fontSize: "42px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "10px", lineHeight: 1.1 }}>
              Beautiful websites for every industry
            </h2>
            <p style={{ fontSize: "15px", color: C.mutedLight, marginTop: "12px", maxWidth: "500px", margin: "12px auto 0" }}>
              Every design is custom, mobile-first, and built to rank on Google.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {WEBSITE_TYPES.map((site, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -8, scale: 1.01 }}
                style={{
                  ...glass, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                <WebsiteMockup from={site.from} to={site.to} accent={site.accent} icon={site.icon} />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: site.accent, textTransform: "uppercase", letterSpacing: "1px" }}>
                      {site.style}
                    </span>
                    <span style={{ fontSize: "18px" }}>{site.icon}</span>
                  </div>
                  <h3 style={{ fontFamily: ffd, fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>{site.name}</h3>
                  <p style={{ fontSize: "12.5px", color: C.mutedLight, lineHeight: 1.6, marginBottom: "14px" }}>{site.desc}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {site.features.map(f => (
                      <span key={f} style={{
                        fontSize: "10px", padding: "3px 10px", borderRadius: "100px",
                        background: site.accent + "18", color: site.accent, fontWeight: 600,
                      }}>{f}</span>
                    ))}
                  </div>
                  <a
                    href={`${WA_BASE}${encodeURIComponent(`Hi Prafful! I'm interested in a ${site.name} website. Could you share examples and pricing?`)}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      padding: "10px", borderRadius: "8px",
                      background: site.accent + "18", color: site.accent,
                      fontSize: "12.5px", fontWeight: 700, textDecoration: "none", fontFamily: ff,
                      border: `1px solid ${site.accent}30`,
                    }}
                  >
                    Get a Quote →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "80px 0", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: C.green }}>Pricing</span>
            <h2 style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "10px" }}>
              Straightforward pricing. Real results.
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                whileHover={{ y: -6 }}
                style={{
                  ...glass, padding: "30px 26px",
                  border: plan.featured
                    ? "1px solid rgba(0,210,106,0.35)"
                    : "1px solid rgba(255,255,255,0.07)",
                  background: plan.featured
                    ? "linear-gradient(135deg, rgba(0,210,106,0.08) 0%, rgba(59,130,246,0.06) 100%)"
                    : C.glass,
                  position: "relative", overflow: "hidden",
                  animation: plan.featured ? "borderGlow 4s ease-in-out infinite" : "none",
                }}
              >
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: "14px", right: "-28px",
                    background: C.grad, color: "#fff",
                    fontSize: "9px", fontWeight: 800, padding: "4px 36px",
                    transform: "rotate(45deg)", letterSpacing: "1px",
                  }}>POPULAR</div>
                )}
                <div style={{ fontSize: "11.5px", fontWeight: 700, color: plan.featured ? C.green : C.mutedLight, marginBottom: "4px" }}>
                  {plan.name}
                </div>
                <div style={{ fontFamily: ffd, fontSize: "38px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: "12.5px", color: C.mutedLight, margin: "6px 0 22px" }}>{plan.desc}</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "18px", marginBottom: "22px" }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                      <span style={{ color: plan.featured ? C.green : C.mutedLight, fontSize: "12px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <span style={{ fontSize: "13px", color: C.mutedLight, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={plan.ctaAction === "audit" ? "#audit" : `${WA_BASE}${encodeURIComponent(`Hi Prafful! I'm interested in the ${plan.name} plan (${plan.price}). Let's connect!`)}`}
                  target={plan.ctaAction === "audit" ? "_self" : "_blank"}
                  rel="noreferrer"
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    padding: "13px", borderRadius: "10px",
                    background: plan.featured ? C.grad : "rgba(255,255,255,0.06)",
                    border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                    textDecoration: "none", fontFamily: ff,
                    boxShadow: plan.featured ? "0 0 28px rgba(0,210,106,0.2)" : "none",
                  }}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp(0.3)} style={{ textAlign: "center", fontSize: "13px", color: C.muted, marginTop: "24px" }}>
            Website pricing varies by scope. <a href={`${WA_BASE}${encodeURIComponent("Hi Prafful! I'd like to get a custom quote for a website.")}`} target="_blank" rel="noreferrer" style={{ color: C.green, textDecoration: "none" }}>Get a custom quote on WhatsApp →</a>
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 28px" }}>
          <motion.div {...fadeUp()} style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: C.green }}>Let's Talk</span>
            <h2 style={{ fontFamily: ffd, fontSize: "42px", fontWeight: 900, letterSpacing: "-1.5px", marginTop: "10px" }}>
              Ready to get found on Google?
            </h2>
            <p style={{ fontSize: "15px", color: C.mutedLight, marginTop: "12px" }}>
              Drop a message and I'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "28px", alignItems: "start" }}>

            {/* Left — contact info */}
            <motion.div {...fadeUp(0.1)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* WhatsApp CTA */}
              <a
                href={`${WA_BASE}${encodeURIComponent("Hi Prafful! I'd like to discuss LocalRank services. When can we connect?")}`}
                target="_blank" rel="noreferrer"
                style={{
                  ...glass, padding: "20px 22px",
                  border: "1px solid rgba(37,211,102,0.25)",
                  background: "rgba(37,211,102,0.06)",
                  display: "flex", alignItems: "center", gap: "14px",
                  textDecoration: "none", color: C.white,
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(37,211,102,0.4)", flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#25D366" }}>WhatsApp (Fastest)</div>
                  <div style={{ fontSize: "12px", color: C.mutedLight, marginTop: "2px" }}>+91 87558 07556</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}?subject=LocalRank Inquiry&body=Hi Prafful,%0A%0AI'm interested in your services and would like to learn more.%0A%0ABusiness Name: %0ACity: %0AService Needed: %0A%0AThank you!`}
                style={{
                  ...glass, padding: "20px 22px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", gap: "14px",
                  textDecoration: "none", color: C.white,
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: C.blueDim, border: "1px solid rgba(59,130,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  fontSize: "20px",
                }}>✉️</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: C.blue }}>Email</div>
                  <div style={{ fontSize: "11.5px", color: C.mutedLight, marginTop: "2px" }}>{EMAIL}</div>
                </div>
              </a>

              {/* Response promise */}
              <div style={{
                ...glass, padding: "18px 20px",
                background: C.greenDim, border: `1px solid ${C.greenBorder}`,
              }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span>⚡</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: C.green }}>Fast Response Guarantee</span>
                </div>
                <p style={{ fontSize: "12px", color: C.mutedLight, lineHeight: 1.6 }}>
                  All inquiries answered within 24 hours. WhatsApp replies typically within 2 hours during business hours (9AM–8PM IST).
                </p>
              </div>

              {/* What happens next */}
              <div style={{ ...glass, padding: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                  What happens next
                </div>
                {["I review your inquiry & run a quick audit","We schedule a 15-min discovery call","You get a custom proposal within 24 hours"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 2 ? "10px" : 0 }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: C.greenDim, border: `1px solid ${C.greenBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 800, color: C.green, flexShrink: 0,
                    }}>{i+1}</div>
                    <span style={{ fontSize: "12.5px", color: C.mutedLight, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — contact form */}
            <motion.div {...fadeUp(0.15)}>
              <ContactSection />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 0" }}>
        <div style={{
          maxWidth: "1160px", margin: "0 auto", padding: "0 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "8px", background: C.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "13px", fontWeight: 900,
            }}>L</div>
            <span style={{ fontFamily: ffd, fontSize: "15px", fontWeight: 700 }}>
              Local<span style={{ color: C.green }}>Rank</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["Services","Showcase","Pricing","Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: "13px", color: C.muted, textDecoration: "none" }}>{l}</a>
            ))}
          </div>

          <span style={{ fontSize: "12px", color: C.muted }}>© 2026 LocalRank · Built by Prafful</span>
        </div>
      </footer>
    </div>
  );
}
