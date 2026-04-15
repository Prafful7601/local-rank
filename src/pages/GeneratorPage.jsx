import { useState, useEffect } from "react";
import { C, ff, ffd } from "../design";
import { generateAudit, NICHES } from "../engine/audit";
import { auditToHTML } from "../engine/pdf";

const LS_HISTORY = "lr_history";
const LS_LAST    = "lr_last_audit";
const LS_FORM    = "lr_form";

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
  catch { return []; }
}

function saveHistory(h) {
  try { localStorage.setItem(LS_HISTORY, JSON.stringify(h)); } catch {}
}

function loadForm() {
  try { return JSON.parse(localStorage.getItem(LS_FORM)) || {}; }
  catch { return {}; }
}

// ── Sub-components ────────────────────────────────────────────

function SeverityBadge({ s }) {
  const color = s === "HIGH" ? C.red : s === "MEDIUM" ? C.orange : C.green;
  const dim   = s === "HIGH" ? C.redDim : s === "MEDIUM" ? C.orangeDim : C.greenDim;
  return (
    <span style={{
      fontSize: "9px", fontWeight: 700, padding: "2px 6px",
      borderRadius: "3px", flexShrink: 0,
      background: dim, color,
    }}>
      {s}
    </span>
  );
}

function ScoreDisplay({ score }) {
  const color = score < 40 ? C.red : score < 60 ? C.orange : C.green;
  const dim   = score < 40 ? C.redDim : score < 60 ? C.orangeDim : C.greenDim;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "16px",
      margin: "18px 0", padding: "16px", borderRadius: "8px",
      background: dim, border: `1px solid ${color}22`,
    }}>
      <div style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 800, color, lineHeight: 1 }}>
        {score}
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color }}>Profile Health Score</div>
        <div style={{ fontSize: "11px", color: C.muted }}>out of 100</div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        {/* Mini gauge */}
        <div style={{ width: "100px", height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.6s ease" }} />
        </div>
        <div style={{ fontSize: "10px", color: C.muted, marginTop: "4px" }}>{score}/100</div>
      </div>
    </div>
  );
}

function IssueRow({ iss, i }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "8px",
      padding: "9px 11px", borderRadius: "6px",
      border: `1px solid ${C.border}`,
      background: i % 2 === 0 ? C.surface2 : "transparent",
    }}>
      <SeverityBadge s={iss.severity} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{iss.title}</div>
        <div style={{ fontSize: "11px", color: C.muted, marginTop: "2px", lineHeight: 1.5 }}>{iss.impact}</div>
      </div>
    </div>
  );
}

function CompetitorTable({ competitors }) {
  const headers = ["Business", "Reviews", "Rating", "Photos", "Cat."];
  return (
    <div style={{ overflowX: "auto", marginTop: "12px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                textAlign: "left", padding: "7px 8px",
                background: C.surface2, border: `1px solid ${C.border}`,
                fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px",
                color: C.muted, fontWeight: 700,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {competitors.map((c, i) => (
            <tr key={i} style={{ background: i === 0 ? C.redDim : "transparent" }}>
              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}`, fontWeight: i === 0 ? 700 : 400 }}>
                {c.name}{i === 0 ? " (YOU)" : ""}
              </td>
              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.reviews}</td>
              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.rating}</td>
              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.photos}</td>
              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.categories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function GeneratorPage({ onNavigate }) {
  const savedForm = loadForm();
  const [business, setBusiness] = useState(savedForm.business || "");
  const [city,     setCity]     = useState(savedForm.city     || "");
  const [niche,    setNiche]    = useState(savedForm.niche    || "Plumbing");
  const [reportType, setReportType] = useState("full");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [history,  setHistory]  = useState(loadHistory);
  const [toast,    setToast]    = useState(null);

  // Persist form values
  useEffect(() => {
    try { localStorage.setItem(LS_FORM, JSON.stringify({ business, city, niche })); } catch {}
  }, [business, city, niche]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function generate() {
    if (!business.trim() || !city.trim()) {
      setError("Enter both business name and city");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const data = generateAudit(business.trim(), city.trim(), niche);
      setResult(data);
      try { localStorage.setItem(LS_LAST, JSON.stringify(data)); } catch {}
      const newEntry = {
        business: business.trim(), city: city.trim(), niche,
        score: data.score, time: new Date().toLocaleTimeString(),
      };
      const newHistory = [newEntry, ...history.filter(h =>
        !(h.business === newEntry.business && h.city === newEntry.city && h.niche === newEntry.niche)
      )].slice(0, 10);
      setHistory(newHistory);
      saveHistory(newHistory);
      setLoading(false);
      showToast("Audit generated!");
    }, 800);
  }

  function printPDF() {
    if (!result) return;
    const html = auditToHTML(result, reportType);
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }

  function downloadHTML() {
    if (!result) return;
    const html = auditToHTML(result, reportType);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-${result.business.toLowerCase().replace(/[^a-z0-9]/g,"-")}-${reportType}.html`;
    a.click();
    showToast("HTML downloaded!");
  }

  function loadFromHistory(h) {
    setBusiness(h.business);
    setCity(h.city);
    setNiche(h.niche);
    setResult(null);
    showToast(`Loaded: ${h.business}`, "info");
  }

  function clearHistory() {
    setHistory([]);
    saveHistory([]);
    showToast("History cleared", "info");
  }

  const displayIssues = result
    ? (reportType === "free" ? result.issues.filter(i => i.severity === "HIGH").slice(0, 3) : result.issues)
    : [];

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: "6px",
    border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: ff,
    color: C.white, background: C.bg,
  };
  const lbl = {
    display: "block", fontSize: "11px", fontWeight: 700, color: C.muted,
    textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "6px",
  };

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "28px 24px", position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          background: toast.type === "success" ? C.greenDim : C.surface2,
          border: `1px solid ${toast.type === "success" ? C.greenBorder : C.border}`,
          color: toast.type === "success" ? C.green : C.mutedLight,
          padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.type === "success" ? "✓ " : "ℹ "}{toast.msg}
        </div>
      )}

      <button
        onClick={() => onNavigate("landing")}
        style={{
          background: "none", border: "none", color: C.muted,
          fontSize: "13px", cursor: "pointer", fontFamily: ff,
          marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px",
        }}
      >
        ← Back to home
      </button>

      <div style={{ display: "grid", gridTemplateColumns: result ? "320px 1fr" : "420px", gap: "20px" }}>

        {/* ── Left: Form ── */}
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "24px" }}>
            <h2 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, marginBottom: "3px" }}>Generate Audit</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "18px" }}>
              Enter details → get a branded report in 2 seconds
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <div>
                <label style={lbl}>Business Name</label>
                <input
                  style={inp}
                  placeholder="e.g. Bob's Plumbing"
                  value={business}
                  onChange={e => setBusiness(e.target.value)}
                  onFocus={() => setError("")}
                  onKeyDown={e => e.key === "Enter" && generate()}
                />
              </div>
              <div>
                <label style={lbl}>City</label>
                <input
                  style={inp}
                  placeholder="e.g. Austin, TX"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onFocus={() => setError("")}
                  onKeyDown={e => e.key === "Enter" && generate()}
                />
              </div>
              <div>
                <label style={lbl}>Industry</label>
                <select
                  style={{
                    ...inp, cursor: "pointer", appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237B8698' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "36px",
                  }}
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                >
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Report Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[["free","Free (3 issues)"],["full","Full ($97 value)"]].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setReportType(v)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "6px",
                        fontSize: "12px", fontWeight: 600, fontFamily: ff, cursor: "pointer",
                        border: `1.5px solid ${reportType === v ? C.green : C.border}`,
                        background: reportType === v ? C.greenDim : "transparent",
                        color: reportType === v ? C.green : C.muted,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  background: C.redDim, border: `1px solid rgba(255,71,87,0.25)`,
                  borderRadius: "6px", padding: "9px 12px",
                  fontSize: "12px", color: C.red, fontWeight: 600,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: "6px",
                  background: C.green, color: C.bg, fontSize: "14px", fontWeight: 700,
                  border: "none", cursor: loading ? "wait" : "pointer",
                  fontFamily: ff, opacity: loading ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: "inline-block", width: "14px", height: "14px",
                      border: "2px solid rgba(11,14,19,0.3)", borderTopColor: C.bg,
                      borderRadius: "50%", animation: "spin 0.6s linear infinite",
                    }} />
                    Generating…
                  </>
                ) : "⚡ Generate Audit Report"}
              </button>
            </div>
          </div>

          {/* ── History ── */}
          {history.length > 0 && (
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: "10px", padding: "16px 20px", marginTop: "12px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.7px" }}>
                  Recent Audits
                </span>
                <button
                  onClick={clearHistory}
                  style={{
                    background: "none", border: "none", color: C.muted,
                    fontSize: "10px", cursor: "pointer", fontFamily: ff,
                  }}
                >
                  Clear
                </button>
              </div>
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => loadFromHistory(h)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{h.business}</div>
                    <div style={{ fontSize: "10.5px", color: C.muted }}>{h.city} · {h.niche} · {h.time}</div>
                  </div>
                  <div style={{
                    fontFamily: ffd, fontSize: "14px", fontWeight: 700,
                    color: h.score < 40 ? C.red : C.orange,
                  }}>
                    {h.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Result ── */}
        {result && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              <button
                onClick={printPDF}
                style={{
                  padding: "10px 20px", borderRadius: "6px",
                  background: C.green, color: C.bg,
                  fontSize: "13px", fontWeight: 700, border: "none",
                  cursor: "pointer", fontFamily: ff,
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                🖨️ Print as PDF
              </button>
              <button
                onClick={downloadHTML}
                style={{
                  padding: "10px 20px", borderRadius: "6px",
                  background: "transparent", color: C.white,
                  fontSize: "13px", fontWeight: 700, border: `1px solid ${C.border}`,
                  cursor: "pointer", fontFamily: ff,
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                ⬇ Download HTML
              </button>
              <button
                onClick={() => onNavigate("templates")}
                style={{
                  padding: "10px 20px", borderRadius: "6px",
                  background: "transparent", color: C.green,
                  fontSize: "13px", fontWeight: 700,
                  border: `1px solid ${C.greenBorder}`,
                  cursor: "pointer", fontFamily: ff,
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                ✉ Email Templates
              </button>
            </div>

            {/* WhatsApp full optimization CTA */}
            {result && (() => {
              const waMsg = encodeURIComponent(
                `Hi Prafful! I just ran a GBP audit for ${result.business} in ${result.city} — score: ${result.score}/100 with ${result.issues.length} issues. I'd like you to handle the full optimization. Can we connect?`
              );
              return (
                <a
                  href={`https://wa.me/918755807556?text=${waMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    padding: "13px 20px", borderRadius: "8px", marginBottom: "12px",
                    background: "linear-gradient(135deg,#25D366,#128C7E)",
                    color: "#fff", fontSize: "14px", fontWeight: 700,
                    textDecoration: "none", fontFamily: ff,
                    boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Full Optimization on WhatsApp ($49) →
                </a>
              );
            })()}

            {/* Audit preview card */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
              {/* Card header */}
              <div style={{
                padding: "12px 18px", borderBottom: `1px solid ${C.border}`,
                background: C.surface2, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Audit Preview</span>
                <span style={{ fontSize: "11px", color: C.muted }}>
                  {reportType === "full" ? "Full Report · ~4 pages" : "Free Teaser · 1 page"}
                </span>
              </div>

              <div style={{ padding: "22px" }}>
                {/* Green top bar */}
                <div style={{ height: "4px", background: C.green, borderRadius: "2px", marginBottom: "14px" }} />
                <h3 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700 }}>Google Business Profile Audit</h3>
                <p style={{ fontSize: "12.5px", color: C.muted, marginTop: "3px" }}>
                  <strong>{result.business}</strong> — {result.city} · {result.niche}
                </p>

                {/* Score */}
                <ScoreDisplay score={result.score} />

                {/* Issue count summary */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {[
                    ["HIGH",   result.issues.filter(i=>i.severity==="HIGH").length,   C.red,    C.redDim],
                    ["MEDIUM", result.issues.filter(i=>i.severity==="MEDIUM").length, C.orange, C.orangeDim],
                    ["LOW",    result.issues.filter(i=>i.severity==="LOW").length,    C.green,  C.greenDim],
                  ].map(([label, count, color, dim]) => (
                    <div key={label} style={{
                      flex: 1, padding: "10px", borderRadius: "6px",
                      background: dim, border: `1px solid ${color}22`, textAlign: "center",
                    }}>
                      <div style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 800, color }}>{count}</div>
                      <div style={{ fontSize: "10px", color, fontWeight: 600 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Issues */}
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px", fontFamily: ffd }}>
                  Issues ({displayIssues.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "260px", overflowY: "auto" }}>
                  {displayIssues.map((iss, i) => <IssueRow key={i} iss={iss} i={i} />)}
                </div>

                {/* Competitor table (full only) */}
                {reportType === "full" && result.competitors && (
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: ffd, marginBottom: "4px" }}>
                      Competitor Comparison
                    </div>
                    <CompetitorTable competitors={result.competitors} />
                  </div>
                )}

                {/* Fix plan preview (full only) */}
                {reportType === "full" && result.fixes && (
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: ffd, marginBottom: "8px" }}>
                      Action Plan — {result.fixes.reduce((a, g) => a + g.items.length, 0)} steps
                    </div>
                    {result.fixes.map((group, gi) => (
                      <div key={gi} style={{ marginBottom: "10px" }}>
                        <div style={{
                          fontSize: "11px", fontWeight: 700, color: C.green,
                          textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px",
                        }}>
                          {group.week}
                        </div>
                        {group.items.map((item, ii) => (
                          <div key={ii} style={{
                            display: "flex", alignItems: "flex-start", gap: "8px",
                            padding: "8px 10px", borderRadius: "5px",
                            border: `1px solid ${C.border}`, marginBottom: "4px",
                            background: C.surface2,
                          }}>
                            <span style={{ color: C.green, marginTop: "1px" }}>✓</span>
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 600 }}>{item.title}</div>
                              <div style={{ fontSize: "11px", color: C.muted, marginTop: "2px", lineHeight: 1.5 }}>
                                {item.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div style={{
                  marginTop: "18px", background: C.greenDim,
                  border: `1px solid ${C.greenBorder}`,
                  borderRadius: "6px", padding: "14px", fontSize: "12.5px",
                }}>
                  <strong>Report ready!</strong> Click "Print as PDF" to save as a professional PDF, then attach it to your cold outreach email. Use the{" "}
                  <span
                    onClick={() => onNavigate("templates")}
                    style={{ color: C.green, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Email Templates
                  </span>{" "}
                  page to craft your message.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Workflow tips (shown before first result) ── */}
      {!result && (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: "10px", padding: "24px", marginTop: "20px",
        }}>
          <h3 style={{ fontFamily: ffd, fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
            Your Daily 2-Hour Workflow
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {[
              { n:"1", t:"Find leads",     d:"Google Maps → search niche + US city → find weak profiles",       time:"30 min" },
              { n:"2", t:"Generate audits",d:"Paste details here → generate PDF for each lead",                  time:"10 min" },
              { n:"3", t:"Send emails",    d:"Use cold email templates → attach free audit PDF",                 time:"60 min" },
              { n:"4", t:"Follow up",      d:"Re-send to non-responders after 3 days with the upgrade pitch",    time:"20 min" },
            ].map(s => (
              <div key={s.n} style={{
                padding: "16px", borderRadius: "6px",
                background: C.surface2, border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontFamily: ffd, fontSize: "22px", fontWeight: 800, color: C.green }}>{s.n}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px", marginBottom: "4px" }}>{s.t}</div>
                <div style={{ fontSize: "11.5px", color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
                <div style={{ fontSize: "11px", color: C.green, fontWeight: 600, marginTop: "6px" }}>{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
