import { useState, useEffect } from "react";
import { C, ff, ffd } from "../design";

const SAMPLE_ISSUES = [
  { s: "HIGH",   icon: "⚠",  label: "Missing 8 relevant service categories" },
  { s: "HIGH",   icon: "📸", label: "Only 3 photos (competitor avg: 24)" },
  { s: "MEDIUM", icon: "📝", label: "No Google Posts in 90+ days" },
  { s: "MEDIUM", icon: "⭐", label: "Only 12 reviews (top competitor: 89)" },
  { s: "LOW",    icon: "🕐", label: "Holiday hours not configured" },
];

const STATS = [
  ["200+", "Businesses Audited"],
  ["34",   "Avg. Issues Found"],
  ["93%",  "Find Critical Issues"],
];

const HOW_IT_WORKS = [
  { s:"01", icon:"🔍", t:"We audit your listing",     d:"We analyze your Google Business Profile across 25+ ranking factors and compare you to your top local competitors." },
  { s:"02", icon:"📊", t:"You get a detailed report", d:"Within 24 hours, receive a professional PDF with your score, every issue found, and step-by-step fix instructions." },
  { s:"03", icon:"📈", t:"You climb the rankings",    d:"Follow the recommendations or let us handle it. Most businesses see improvement within 2-4 weeks." },
];

const PLANS = [
  {
    name:"Free Audit",    price:"$0",   desc:"See what's wrong",
    features:["Profile health score","Top 3 critical issues","Competitor snapshot","Delivered via email"],
    featured:false,
  },
  {
    name:"Full Audit",    price:"$97",  desc:"The complete picture",
    features:["Everything in Free +","25+ factor deep analysis","5 competitor breakdown","Step-by-step fix guide","PDF report"],
    featured:true,
  },
  {
    name:"Done For You",  price:"$397", desc:"We fix everything",
    features:["Full Audit included","We optimize your listing","Category & description rewrite","Review strategy plan","30-day follow-up"],
    featured:false,
  },
];

const VERTICALS = ["Plumbers","Dentists","HVAC","Electricians","Roofers","Landscapers","Auto Shops","Chiropractors"];

export default function LandingPage({ onNavigate }) {
  const [email, setEmail]         = useState("");
  const [biz, setBiz]             = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeIssue, setActiveIssue] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIssue(p => (p + 1) % SAMPLE_ISSUES.length), 2800);
    return () => clearInterval(t);
  }, []);

  const sevColor = (s) => s === "HIGH" ? C.red : s === "MEDIUM" ? C.orange : C.green;
  const sevDim   = (s) => s === "HIGH" ? C.redDim : s === "MEDIUM" ? C.orangeDim : C.greenDim;

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding: "110px 0 80px", position: "relative", overflow: "hidden" }}>
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: "40px", left: "-160px",
          width: "560px", height: "560px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(0,210,106,0.06)0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: "1080px", margin: "0 auto", padding: "0 28px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center",
        }}>
          {/* Left copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: C.greenDim, border: `1px solid ${C.greenBorder}`,
              borderRadius: "100px", padding: "5px 14px", marginBottom: "22px",
            }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>Free audit — no credit card</span>
            </div>

            <h1 style={{ fontFamily: ffd, fontSize: "48px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "18px" }}>
              Your Google listing is{" "}
              <span style={{ color: C.orange }}>losing you</span> customers
            </h1>
            <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.7, maxWidth: "460px", marginBottom: "28px" }}>
              We audit your Google Business Profile and show you exactly what's wrong, what your competitors do better, and how to fix it.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => onNavigate("generator")}
                style={{
                  background: C.green, color: C.bg, padding: "13px 26px",
                  borderRadius: "8px", fontSize: "15px", fontWeight: 700,
                  border: "none", cursor: "pointer", fontFamily: ff,
                  display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                Get Your Free Audit <span style={{ fontSize: "18px" }}>→</span>
              </button>
              <button
                onClick={() => onNavigate("templates")}
                style={{
                  background: "transparent", color: C.mutedLight, padding: "13px 20px",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 600,
                  border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: ff,
                }}
              >
                See email templates
              </button>
            </div>

            <div style={{ display: "flex", gap: "28px", marginTop: "28px", flexWrap: "wrap" }}>
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, color: C.green }}>{n}</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sample audit card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: "14px", overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            animation: "fadeIn 0.4s ease",
          }}>
            {/* Fake browser chrome */}
            <div style={{
              padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => (
                <div key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />
              ))}
              <span style={{ fontSize: "11px", color: C.muted, marginLeft: "6px" }}>
                Sample Audit — Bob's Plumbing, Austin TX
              </span>
            </div>

            <div style={{ padding: "18px" }}>
              {/* Score badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "14px",
                borderRadius: "8px", background: C.redDim, border: "1px solid rgba(255,71,87,0.15)",
                marginBottom: "16px",
              }}>
                <div style={{ fontFamily: ffd, fontSize: "38px", fontWeight: 800, color: C.red }}>34</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: C.red }}>Profile Health Score</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>Out of 100 · Critical issues found</div>
                </div>
              </div>

              {/* Issue list */}
              {SAMPLE_ISSUES.map((iss, i) => (
                <div
                  key={i}
                  onClick={() => setActiveIssue(i)}
                  style={{
                    padding: "10px 12px", borderRadius: "6px", marginBottom: "4px", cursor: "pointer",
                    background: activeIssue === i ? sevDim(iss.s) : "transparent",
                    border: `1px solid ${activeIssue === i ? sevColor(iss.s) + "33" : "transparent"}`,
                    display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>{iss.icon}</span>
                  <span style={{
                    fontSize: "12px", flex: 1,
                    fontWeight: activeIssue === i ? 600 : 400,
                    color: activeIssue === i ? C.white : C.muted,
                  }}>
                    {iss.label}
                  </span>
                  <span style={{
                    fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "3px",
                    background: sevDim(iss.s), color: sevColor(iss.s),
                  }}>
                    {iss.s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Verticals bar ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "16px 0", background: C.surface }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap", padding: "0 28px" }}>
          {VERTICALS.map(v => (
            <span key={v} style={{ fontSize: "12px", fontWeight: 500, color: C.muted }}>{v}</span>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section style={{ padding: "90px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: C.green }}>
              How It Works
            </span>
            <h2 style={{ fontFamily: ffd, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", marginTop: "10px" }}>
              Three steps to more customers
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: "12px", padding: "28px 24px", position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: "18px", right: "18px",
                  fontFamily: ffd, fontSize: "42px", fontWeight: 800, color: C.border,
                }}>
                  {step.s}
                </div>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{step.icon}</div>
                <h3 style={{ fontFamily: ffd, fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{step.t}</h3>
                <p style={{ fontSize: "13.5px", color: C.muted, lineHeight: 1.7 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: "80px 0", background: C.surface }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: C.green }}>
              Pricing
            </span>
            <h2 style={{ fontFamily: ffd, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", marginTop: "10px" }}>
              Invest in being found
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: plan.featured ? C.bg : C.surface2,
                border: `1px solid ${plan.featured ? C.green : C.border}`,
                borderRadius: "12px", padding: "28px 24px",
                position: "relative", overflow: "hidden",
              }}>
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: "12px", right: "-26px",
                    background: C.green, color: C.bg,
                    fontSize: "9px", fontWeight: 800, padding: "3px 32px",
                    transform: "rotate(45deg)", letterSpacing: "0.5px",
                  }}>POPULAR</div>
                )}
                <div style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>{plan.name}</div>
                <div style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 800, letterSpacing: "-1.5px" }}>{plan.price}</div>
                <div style={{ fontSize: "12.5px", color: C.muted, marginBottom: "20px" }}>{plan.desc}</div>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", marginBottom: "8px" }}>
                    <span style={{ color: C.green, fontSize: "14px" }}>✓</span>
                    <span style={{ color: C.mutedLight }}>{f}</span>
                  </div>
                ))}
                <button
                  onClick={() => onNavigate("generator")}
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    padding: "11px", borderRadius: "7px",
                    background: plan.featured ? C.green : "transparent",
                    color: plan.featured ? C.bg : C.white,
                    border: plan.featured ? "none" : `1px solid ${C.border}`,
                    fontWeight: 700, fontSize: "13px", cursor: "pointer",
                    marginTop: "18px", fontFamily: ff,
                  }}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email CTA ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: ffd, fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "10px" }}>
            Get your free audit now
          </h2>
          <p style={{ color: C.muted, marginBottom: "24px" }}>Takes 30 seconds. Report delivered within 24 hours.</p>

          {!submitted ? (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "28px" }}>
              <input
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "8px",
                  border: `1px solid ${C.border}`, background: C.bg,
                  color: C.white, fontSize: "14px", fontFamily: ff, marginBottom: "10px",
                }}
                placeholder="Your business name"
                value={biz}
                onChange={e => setBiz(e.target.value)}
              />
              <input
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "8px",
                  border: `1px solid ${C.border}`, background: C.bg,
                  color: C.white, fontSize: "14px", fontFamily: ff, marginBottom: "10px",
                }}
                placeholder="Your email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                onClick={() => { if (biz && email) setSubmitted(true); }}
                style={{
                  width: "100%", padding: "13px", borderRadius: "8px",
                  background: C.green, color: C.bg,
                  fontSize: "15px", fontWeight: 700, border: "none",
                  cursor: "pointer", fontFamily: ff,
                }}
              >
                Send Me My Free Audit →
              </button>
              <p style={{ fontSize: "11px", color: C.muted, marginTop: "10px" }}>No spam. No credit card. Just your audit.</p>
            </div>
          ) : (
            <div style={{
              background: C.greenDim, border: `1px solid ${C.greenBorder}`,
              borderRadius: "12px", padding: "36px",
            }}>
              <div style={{ fontSize: "36px" }}>✓</div>
              <h3 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, color: C.green, marginTop: "8px" }}>You're in!</h3>
              <p style={{ color: C.muted, marginTop: "6px", fontSize: "13px" }}>Check your inbox within 24 hours.</p>
              <button
                onClick={() => onNavigate("generator")}
                style={{
                  marginTop: "16px", padding: "10px 22px", borderRadius: "7px",
                  background: C.green, color: C.bg, fontWeight: 700,
                  fontSize: "13px", border: "none", cursor: "pointer", fontFamily: ff,
                }}
              >
                Try the Generator →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px 0" }}>
        <div style={{
          maxWidth: "1080px", margin: "0 auto", padding: "0 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "5px", background: C.green,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.bg, fontSize: "11px", fontWeight: 800,
            }}>L</div>
            <span style={{ fontFamily: ffd, fontSize: "14px", fontWeight: 600 }}>LocalRank</span>
          </div>
          <span style={{ fontSize: "11px", color: C.muted }}>© 2026 LocalRank — Helping local businesses get found on Google</span>
        </div>
      </footer>
    </div>
  );
}
