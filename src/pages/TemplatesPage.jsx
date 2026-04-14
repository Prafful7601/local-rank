import { useState } from "react";
import { C, ff, ffd } from "../design";

const LS_LAST = "lr_last_audit";

function loadLastAudit() {
  try { return JSON.parse(localStorage.getItem(LS_LAST)) || null; }
  catch { return null; }
}

// ── Template definitions ──────────────────────────────────────
// Tokens: {biz}, {city}, {niche}, {score}, {n_issues}, {n_high}, {issue1}, {issue2}, {issue3}
// {comp_reviews}, {your_reviews}, {comp_name}

function buildTemplates(audit) {
  const biz          = audit?.business       || "[Business Name]";
  const city         = audit?.city           || "[City]";
  const niche        = audit?.niche          || "[Niche]";
  const score        = audit?.score          || "[Score]";
  const nIssues      = audit?.issues?.length || "[N]";
  const highIssues   = audit?.issues?.filter(i => i.severity === "HIGH") || [];
  const nHigh        = highIssues.length     || "[N]";
  const issue1       = highIssues[0]?.title  || "[Top issue 1]";
  const issue2       = highIssues[1]?.title  || "[Top issue 2]";
  const issue3       = highIssues[2]?.title  || "[Top issue 3]";
  const comp         = audit?.competitors?.[1];
  const compName     = comp?.name            || "[Competitor Name]";
  const compReviews  = comp?.reviews         || "[X]";
  const yourReviews  = audit?.competitors?.[0]?.reviews || "[Y]";
  const compPhotos   = comp?.photos          || "[X]";
  const yourPhotos   = audit?.competitors?.[0]?.photos  || "[Y]";

  return [
    {
      id: "initial",
      tag: "Step 1",
      tagColor: C.red,
      title: "Initial Outreach — Free Audit Delivery",
      desc: "Send this when delivering the free audit PDF. Attach the report.",
      subject: `Quick audit of ${biz}'s Google listing`,
      body: `Hi [Owner's Name],

I was searching for ${niche.toLowerCase()} in ${city} and ran a free audit on your Google Business Profile.

Your listing scored ${score}/100. I found ${nIssues} issues that are likely costing you visibility on Google Maps — ${nHigh} of them are critical.

The three biggest problems right now:
• ${issue1}
• ${issue2}
• ${issue3}

I attached a free audit PDF with the full breakdown. Most of these are fixable in a few hours without any technical knowledge.

If you'd like the complete report — including all ${nIssues} issues, a side-by-side comparison with your top competitors in ${city}, and a week-by-week fix plan — I can send that over for $97.

Happy to answer any questions.

[Your Name]
[Your Email] | [Phone]`,
    },
    {
      id: "followup",
      tag: "Step 2",
      tagColor: C.orange,
      title: "3-Day Follow-Up",
      desc: "Send this 3 days after the initial email if no reply.",
      subject: `Re: ${biz} Google audit`,
      body: `Hi [Owner's Name],

Following up on the audit I sent over — just wanted to make sure it didn't get buried.

To give you a sense of the gap you're up against: ${compName}, one of your top competitors in ${city}, has ${compReviews} Google reviews versus your ${yourReviews}. They also have ${compPhotos} photos on their listing versus your ${yourPhotos}.

These numbers directly affect how often you show up when someone searches "${niche.toLowerCase()} near me."

The fixes aren't complicated — it's mostly about filling in gaps that most business owners don't know exist. The audit shows exactly what to do, step by step.

Worth 10 minutes of your time?

[Your Name]`,
    },
    {
      id: "upgrade",
      tag: "Step 3",
      tagColor: C.green,
      title: "Full Audit Upgrade Pitch",
      desc: "Send after someone engages with the free audit — replied, clicked, or asked a question.",
      subject: `Full audit for ${biz} — all ${nIssues} issues + fix guide`,
      body: `Hi [Owner's Name],

Glad the free audit was useful.

The full report I put together for ${biz} includes everything we found — all ${nIssues} issues, not just the top 3 — along with a detailed comparison against your top competitors in ${city} and a step-by-step fix guide broken into weekly sprints.

What's inside:
• Complete issue list: ${nIssues} issues ranked by impact on your Google ranking
• Competitor breakdown: how ${biz} compares to the top 5 in ${city} on reviews, photos, categories, and posting frequency
• Week-by-week action plan: exactly what to fix, in what order, with specific instructions for each step

Most clients complete the quick wins in the first week and start seeing movement within 3-4 weeks.

You can get the full report for $97. Reply here and I'll send you a payment link — or if you'd rather just do a quick call first, I can walk you through the findings.

[Your Name]`,
    },
    {
      id: "dfy",
      tag: "Upsell",
      tagColor: C.gold,
      title: "Done-For-You Pitch",
      desc: "For prospects who are interested but don't have time to implement.",
      subject: `We'll handle ${biz}'s Google listing — done-for-you`,
      body: `Hi [Owner's Name],

Most business owners tell me the same thing after seeing their audit: "I know this stuff matters, but I just don't have the time."

That's exactly what the done-for-you package is for.

For $397, here's what we take off your plate:

• Rewrite your business description with local keywords for ${city} ${niche.toLowerCase()} searches
• Add all missing categories (you're currently missing several that your competitors use)
• Audit and optimize your photos — filenames, captions, and sequence
• Set up a simple review collection system you can run in 2 minutes per job
• Post to Google on your behalf for the first month
• Respond to any new reviews during that period

Most clients start seeing improvement in Google Maps rankings within 3-4 weeks. The full audit report is included.

Total: $397 one-time. No monthly fees, no contracts.

Interested? Reply here or book a quick 15-minute call: [calendar link]

[Your Name]`,
    },
    {
      id: "objection",
      tag: "Handle",
      tagColor: C.mutedLight,
      title: "Objection Handler — \"We already work with someone\"",
      desc: "For prospects who say they have an SEO agency or are already managing it.",
      subject: `Re: ${biz} — one thing worth checking`,
      body: `Hi [Owner's Name],

No worries at all — glad you have someone looking after this.

One thing worth double-checking with them: ${biz} currently scores ${score}/100 on Google Business Profile health. If your current provider is optimizing your GBP, those numbers should be higher.

The specific gaps I found — things like ${issue1.toLowerCase()} and ${issue2.toLowerCase()} — are things that directly affect where you show up when someone searches "${niche.toLowerCase()} in ${city}."

If your current setup is already covering this, great. But if not, it might be worth a second look.

Happy to share the full audit PDF so you can pass it along to them. No cost or obligation.

[Your Name]`,
    },
  ];
}

// ── Copy button ───────────────────────────────────────────────
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      style={{
        padding: "6px 14px", borderRadius: "5px", fontSize: "11.5px", fontWeight: 700,
        border: `1px solid ${copied ? C.greenBorder : C.border}`,
        background: copied ? C.greenDim : "transparent",
        color: copied ? C.green : C.mutedLight,
        cursor: "pointer", fontFamily: ff, transition: "all 0.15s",
        display: "flex", alignItems: "center", gap: "5px",
      }}
    >
      {copied ? "✓ Copied!" : `📋 ${label}`}
    </button>
  );
}

// ── Template card ─────────────────────────────────────────────
function TemplateCard({ tpl }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "10px", overflow: "hidden",
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "16px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "12px",
          borderBottom: open ? `1px solid ${C.border}` : "none",
        }}
      >
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "3px 10px",
          borderRadius: "100px", background: tpl.tagColor + "22", color: tpl.tagColor,
          flexShrink: 0,
        }}>
          {tpl.tag}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>{tpl.title}</div>
          <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>{tpl.desc}</div>
        </div>
        <span style={{ color: C.muted, fontSize: "16px", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: "20px", animation: "fadeIn 0.2s ease" }}>
          {/* Subject line */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{
                fontSize: "10px", fontWeight: 700, color: C.muted,
                textTransform: "uppercase", letterSpacing: "0.7px",
              }}>Subject Line</label>
              <CopyButton text={tpl.subject} label="Copy subject" />
            </div>
            <div style={{
              padding: "10px 14px", borderRadius: "6px",
              background: C.surface2, border: `1px solid ${C.border}`,
              fontSize: "13px", color: C.white, fontFamily: ff,
            }}>
              {tpl.subject}
            </div>
          </div>

          {/* Email body */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{
                fontSize: "10px", fontWeight: 700, color: C.muted,
                textTransform: "uppercase", letterSpacing: "0.7px",
              }}>Email Body</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <CopyButton text={tpl.body} label="Copy body" />
                <CopyButton text={`Subject: ${tpl.subject}\n\n${tpl.body}`} label="Copy all" />
              </div>
            </div>
            <pre style={{
              padding: "16px", borderRadius: "6px",
              background: C.surface2, border: `1px solid ${C.border}`,
              fontSize: "12.5px", color: C.white, fontFamily: ff,
              lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {tpl.body}
            </pre>
          </div>

          {/* Tokens guide */}
          <div style={{
            marginTop: "14px", padding: "12px 14px", borderRadius: "6px",
            background: C.greenDim, border: `1px solid ${C.greenBorder}`,
            fontSize: "11.5px", color: C.mutedLight, lineHeight: 1.7,
          }}>
            <strong style={{ color: C.green }}>Personalize before sending:</strong>{" "}
            Fill in <code style={{ background: C.border, padding: "1px 5px", borderRadius: "3px", fontSize: "10.5px" }}>[Owner's Name]</code>,{" "}
            <code style={{ background: C.border, padding: "1px 5px", borderRadius: "3px", fontSize: "10.5px" }}>[Your Name]</code>, and any calendar or payment links.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function TemplatesPage({ onNavigate }) {
  const audit     = loadLastAudit();
  const templates = buildTemplates(audit);

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "28px 24px" }}>
      {/* Page header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: ffd, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Cold Email Templates
          </h1>
          {audit && (
            <span style={{
              fontSize: "11px", fontWeight: 600, padding: "3px 12px", borderRadius: "100px",
              background: C.greenDim, border: `1px solid ${C.greenBorder}`, color: C.green,
            }}>
              Pre-filled with {audit.business} audit
            </span>
          )}
        </div>
        <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6, maxWidth: "600px" }}>
          Proven email sequences for every stage of the sales process.
          {audit
            ? ` Templates are pre-filled with your latest audit for ${audit.business} in ${audit.city}.`
            : " Generate an audit first to pre-fill these with real business data — or use the placeholder text as-is."}
        </p>
      </div>

      {/* No audit banner */}
      {!audit && (
        <div style={{
          padding: "14px 18px", borderRadius: "8px", marginBottom: "20px",
          background: C.orangeDim, border: `1px solid rgba(255,165,2,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
        }}>
          <div style={{ fontSize: "13px", color: C.orange }}>
            <strong>Tip:</strong> Generate an audit first and these templates will auto-fill with real business data.
          </div>
          <button
            onClick={() => onNavigate("generator")}
            style={{
              padding: "7px 16px", borderRadius: "6px",
              background: C.orange, color: C.bg,
              fontSize: "12px", fontWeight: 700, border: "none",
              cursor: "pointer", fontFamily: ff, flexShrink: 0,
            }}
          >
            Go to Generator →
          </button>
        </div>
      )}

      {/* Workflow reminder */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px", marginBottom: "24px",
      }}>
        {[
          { step:"1", label:"Find lead",    color: C.muted },
          { step:"2", label:"Run audit",    color: C.muted },
          { step:"3", label:"Send email",   color: C.green },
          { step:"4", label:"Follow up",    color: C.green },
          { step:"5", label:"Close / DFY",  color: C.gold  },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: i >= 2 ? s.color + "22" : C.surface2,
              border: `1px solid ${i >= 2 ? s.color + "44" : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 4px", fontSize: "11px", fontWeight: 700,
              color: i >= 2 ? s.color : C.muted,
            }}>
              {s.step}
            </div>
            <div style={{ fontSize: "10px", color: i >= 2 ? s.color : C.muted, fontWeight: i >= 2 ? 600 : 400 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Template cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {templates.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} />)}
      </div>

      {/* Tips section */}
      <div style={{
        marginTop: "28px", padding: "22px 24px", borderRadius: "10px",
        background: C.surface, border: `1px solid ${C.border}`,
      }}>
        <h3 style={{ fontFamily: ffd, fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>
          Sending Tips
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {[
            { icon:"📎", t:"Always attach the PDF",       d:"Attach the free audit PDF to the initial email. The report is your proof of value — don't just mention it." },
            { icon:"⏰", t:"Send Tuesday–Thursday",       d:"Avoid Monday (busy inboxes) and Friday (low intent). Mid-week sends see the highest reply rates for B2B." },
            { icon:"📧", t:"Use a real email address",    d:"Gmail or Outlook from your own domain. Avoid free email tools — deliverability drops and it looks unprofessional." },
            { icon:"🔁", t:"3-touch minimum",             d:"Most replies come on the 2nd or 3rd touch. Don't stop after one email. Schedule the follow-up before you send the first." },
            { icon:"🎯", t:"Target weak profiles",       d:"On Google Maps, look for businesses with under 30 reviews, few photos, and no recent posts. These are your best prospects." },
            { icon:"📊", t:"Track your numbers",          d:"Aim for: 30-50% open rate, 5-15% reply rate, 2-5% conversion. If replies are low, test different subject lines first." },
          ].map((tip, i) => (
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
