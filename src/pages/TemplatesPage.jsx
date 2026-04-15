import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, ff, ffd, glass } from "../design";

const LS_LAST = "lr_last_audit";

function loadLastAudit() {
  try { return JSON.parse(localStorage.getItem(LS_LAST)) || null; }
  catch { return null; }
}

const WA_NUM  = "918755807556";
const WA_BASE = `https://wa.me/${WA_NUM}?text=`;

// ── Copy button ───────────────────────────────────────────────
function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      padding: "5px 13px", borderRadius: "5px", fontSize: "11.5px", fontWeight: 700,
      border: `1px solid ${copied ? C.greenBorder : "rgba(255,255,255,0.1)"}`,
      background: copied ? C.greenDim : "rgba(255,255,255,0.05)",
      color: copied ? C.green : C.mutedLight,
      cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
    }}>
      {copied ? "✓ Copied!" : `📋 ${label}`}
    </button>
  );
}

// ── Single template card ──────────────────────────────────────
function TemplateCard({ tpl, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      style={{ ...glass, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "16px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "12px",
          borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none",
          background: open ? "rgba(255,255,255,0.02)" : "transparent",
        }}
      >
        <span style={{
          fontSize: "10px", fontWeight: 800, padding: "3px 11px",
          borderRadius: "100px", flexShrink: 0,
          background: tpl.tagColor + "22", color: tpl.tagColor,
        }}>
          {tpl.tag}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>{tpl.title}</div>
          <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>{tpl.desc}</div>
        </div>
        <span style={{
          color: C.muted, fontSize: "18px", lineHeight: 1,
          transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s",
        }}>›</span>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "20px" }}>
              {/* Subject */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.8px" }}>Subject Line</label>
                  <CopyBtn text={tpl.subject} label="Copy subject" />
                </div>
                <div style={{
                  padding: "11px 14px", borderRadius: "7px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "13.5px", color: C.white, fontFamily: ff,
                }}>
                  {tpl.subject}
                </div>
              </div>

              {/* Body */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.8px" }}>Email Body</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <CopyBtn text={tpl.body} label="Copy body" />
                    <CopyBtn text={`Subject: ${tpl.subject}\n\n${tpl.body}`} label="Copy all" />
                  </div>
                </div>
                <pre style={{
                  padding: "16px", borderRadius: "7px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  fontSize: "13px", color: C.white, fontFamily: ff,
                  lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {tpl.body}
                </pre>
              </div>

              {/* Personalise reminder */}
              <div style={{
                marginTop: "12px", padding: "10px 14px", borderRadius: "7px",
                background: C.greenDim, border: `1px solid ${C.greenBorder}`,
                fontSize: "12px", color: C.mutedLight, lineHeight: 1.6,
              }}>
                <strong style={{ color: C.green }}>Before sending:</strong>{" "}
                Replace <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>[Your Name]</code> and any calendar / payment links with your own.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Sending tips ──────────────────────────────────────────────
const TIPS = [
  { icon:"📎", t:"Always attach the PDF",      d:"The free audit PDF is your proof of value. Always attach it to the first email." },
  { icon:"⏰", t:"Send Tue–Thu mornings",       d:"Avoid Monday and Friday. Mid-week 9–11am gets the highest local business open rates." },
  { icon:"🔁", t:"3 touches minimum",           d:"Most replies come on touch 2 or 3. Schedule the follow-up before you send the first." },
  { icon:"🎯", t:"Target weak profiles first",  d:"On Google Maps, filter for businesses with under 30 reviews, few photos, no recent posts." },
  { icon:"📧", t:"Use your real email",         d:"Gmail or Outlook from your own domain. Free email tools kill deliverability." },
  { icon:"📊", t:"Track your numbers",          d:"Aim for 30-50% open rate, 5-15% reply rate. Low replies = fix the subject line first." },
];

// ── Main page ─────────────────────────────────────────────────
export default function TemplatesPage({ onNavigate }) {
  const audit = loadLastAudit();

  const [templates, setTemplates] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  async function generate() {
    if (!audit) return;
    setLoading(true);
    setError("");
    setTemplates(null);

    try {
      const res  = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: audit.business,
          city:     audit.city,
          niche:    audit.niche,
          score:    audit.score,
          issues:   audit.issues,
        }),
      });
      const json = await res.json();
      if (json.success && json.templates?.length) {
        setTemplates(json.templates);
      } else {
        setError(json.error || "Groq returned an unexpected response. Try again.");
      }
    } catch (e) {
      setError("Network error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const waMsg = audit
    ? encodeURIComponent(`Hi Prafful! I ran an audit for ${audit.business} in ${audit.city} (score: ${audit.score}/100) and I'd like help with the outreach. Can we connect?`)
    : encodeURIComponent("Hi Prafful! I'm interested in LocalRank's email outreach service.");

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "28px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: ffd, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Cold Email Templates
          </h1>
          {audit && (
            <span style={{
              fontSize: "11px", fontWeight: 600, padding: "3px 12px", borderRadius: "100px",
              background: C.greenDim, border: `1px solid ${C.greenBorder}`, color: C.green,
            }}>
              Audit loaded: {audit.business}
            </span>
          )}
        </div>
        <p style={{ fontSize: "14px", color: C.mutedLight, lineHeight: 1.65, maxWidth: "600px" }}>
          {audit
            ? `Generate AI-written emails personalised specifically for ${audit.business} in ${audit.city} — based on the real issues found in their audit.`
            : "Run an audit first, then come back here to generate personalized email sequences for that business."}
        </p>
      </div>

      {/* No audit banner */}
      {!audit && (
        <div style={{
          ...glass, padding: "20px 22px", marginBottom: "24px",
          border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "13.5px", color: C.orange }}>
            ⚡ Run an audit first — then come back to generate personalised templates.
          </span>
          <button
            onClick={() => onNavigate("generator")}
            style={{
              padding: "8px 18px", borderRadius: "7px",
              background: C.orange, color: "#fff",
              fontSize: "12.5px", fontWeight: 700, border: "none",
              cursor: "pointer", fontFamily: ff, flexShrink: 0,
            }}
          >
            Go to Audit Generator →
          </button>
        </div>
      )}

      {/* Generate button */}
      {audit && !templates && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...glass, padding: "28px 24px", marginBottom: "24px",
            border: "1px solid rgba(0,210,106,0.2)",
            background: "linear-gradient(135deg, rgba(0,210,106,0.06) 0%, rgba(59,130,246,0.04) 100%)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "36px" }}>🤖</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: ffd, fontSize: "18px", fontWeight: 800, marginBottom: "6px" }}>
                Generate AI-Personalised Templates
              </h3>
              <p style={{ fontSize: "13.5px", color: C.mutedLight, lineHeight: 1.65, marginBottom: "18px" }}>
                Groq (Llama 3.3 70B) will write 4 cold emails specifically for{" "}
                <strong style={{ color: C.white }}>{audit.business}</strong> in{" "}
                <strong style={{ color: C.white }}>{audit.city}</strong> — referencing the actual{" "}
                <strong style={{ color: C.white }}>{audit.issues?.length} issues</strong> found in their audit.
                Takes about 5 seconds.
              </p>

              {/* Audit summary chips */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {[
                  { label: `Score: ${audit.score}/100`,             color: audit.score < 40 ? C.red : C.orange },
                  { label: `${audit.issues?.filter(i=>i.severity==="HIGH").length} critical issues`,  color: C.red    },
                  { label: `${audit.issues?.filter(i=>i.severity==="MEDIUM").length} medium issues`,  color: C.orange },
                  { label: audit.niche,                              color: C.blue   },
                ].map(({ label, color }) => (
                  <span key={label} style={{
                    fontSize: "11px", fontWeight: 700, padding: "4px 12px",
                    borderRadius: "100px", background: color + "18", color,
                  }}>{label}</span>
                ))}
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: "7px", marginBottom: "14px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  fontSize: "12.5px", color: C.red,
                }}>
                  {error}
                </div>
              )}

              <motion.button
                onClick={generate}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "13px 28px", borderRadius: "9px",
                  background: loading ? "rgba(255,255,255,0.07)" : "linear-gradient(135deg,#00D26A,#3B82F6)",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  border: "none", cursor: loading ? "wait" : "pointer", fontFamily: ff,
                  display: "flex", alignItems: "center", gap: "10px",
                  boxShadow: loading ? "none" : "0 0 28px rgba(0,210,106,0.22)",
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "16px", height: "16px", borderRadius: "50%",
                      border: "2.5px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
                      display: "inline-block", animation: "spin 0.7s linear infinite",
                    }} />
                    Writing your personalised templates…
                  </>
                ) : (
                  <>✨ Generate Personalised Templates with AI</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Templates list */}
      {templates && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "16px", flexWrap: "wrap", gap: "10px",
          }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "2px" }}>
                ✨ AI-Generated · Groq Llama 3.3 70B
              </div>
              <div style={{ fontSize: "13px", color: C.mutedLight }}>
                4 personalized emails for <strong style={{ color: C.white }}>{audit.business}</strong>
              </div>
            </div>
            <button
              onClick={() => { setTemplates(null); setError(""); }}
              style={{
                padding: "7px 16px", borderRadius: "7px",
                background: "rgba(255,255,255,0.05)", color: C.mutedLight,
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: ff,
              }}
            >
              ↻ Regenerate
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            {templates.map((tpl, i) => (
              <TemplateCard key={tpl.id} tpl={tpl} index={i} />
            ))}
          </div>

          {/* WhatsApp quick-send */}
          <div style={{
            ...glass, padding: "20px 22px",
            border: "1px solid rgba(37,211,102,0.2)",
            background: "rgba(37,211,102,0.05)",
            display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13.5px", fontWeight: 700, marginBottom: "3px" }}>
                Want us to handle the outreach?
              </div>
              <div style={{ fontSize: "12px", color: C.mutedLight }}>
                Send these emails on your behalf as part of the $49 optimization package.
              </div>
            </div>
            <a
              href={`${WA_BASE}${waMsg}`}
              target="_blank" rel="noreferrer"
              style={{
                padding: "10px 20px", borderRadius: "8px",
                background: "#25D366", color: "#fff",
                fontSize: "13px", fontWeight: 700,
                textDecoration: "none", fontFamily: ff, flexShrink: 0,
              }}
            >
              WhatsApp Prafful →
            </a>
          </div>
        </div>
      )}

      {/* Sending tips */}
      <div style={{
        ...glass, padding: "24px", marginTop: "28px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <h3 style={{ fontFamily: ffd, fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
          Sending Tips
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, marginBottom: "3px" }}>{tip.t}</div>
                <div style={{ fontSize: "11.5px", color: C.muted, lineHeight: 1.6 }}>{tip.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
