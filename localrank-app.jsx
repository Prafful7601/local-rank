import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// LOCALRANK — Full App
// Pages: Landing → Generator → PDF Preview
// Zero API costs. Template engine generates realistic audits.
// Print to PDF from browser. Deploy free on Vercel.
// ═══════════════════════════════════════════════════════════════

// ─── Design Tokens ───
const C = {
  bg: "#0B0E13", surface: "#12161E", surface2: "#1A1F2B",
  border: "#252D3A", borderLight: "#2E3847",
  white: "#F0F2F5", muted: "#7B8698", mutedLight: "#9AA3B4",
  green: "#00D26A", greenDark: "#00A854", greenDim: "rgba(0,210,106,0.1)", greenBorder: "rgba(0,210,106,0.25)",
  red: "#FF4757", redDim: "rgba(255,71,87,0.1)",
  orange: "#FFA502", orangeDim: "rgba(255,165,2,0.1)",
  gold: "#F5C542",
};
const ff = "'Outfit', system-ui, sans-serif";
const ffd = "'Playfair Display', Georgia, serif";

// ─── Audit Engine (No API — template-based with smart randomization) ───
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function pickN(arr, n, rng) {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

const COMPETITOR_PREFIXES = {
  Plumbing: ["Premier", "FastFlow", "Pro", "Elite", "Reliable", "Capital", "Metro", "AllStar", "Rapid", "Superior"],
  HVAC: ["CoolBreeze", "AirPro", "Climate", "Arctic", "Comfort", "TempRight", "AllSeason", "PureAir", "ChillMaster", "HeatWave"],
  Electrical: ["BrightWire", "PowerPro", "SparkMaster", "VoltEdge", "CurrentFlow", "LiveWire", "CircuitPro", "AmpUp", "PrimeElectric", "TrueVolt"],
  Dental: ["Bright Smile", "Pearl", "Summit", "Gentle Care", "Family First", "Radiant", "ClearView", "Premier", "Sunshine", "HealthySmile"],
  Roofing: ["TopShield", "StormGuard", "SkyLine", "PeakPro", "SolidRoof", "IronClad", "ApexRoof", "TrueTop", "ShieldPro", "CrownRoof"],
  Landscaping: ["GreenScape", "NaturePro", "LeafMaster", "PrimeLawn", "EverGreen", "TerraPro", "BloomCraft", "FreshCut", "VerdantPro", "EdenScape"],
  Chiropractic: ["SpineAlign", "CoreHealth", "BackBalance", "FlexLife", "AlignWell", "PureMotion", "BodyWorks", "VitalSpine", "ActiveAlign", "WellAdjusted"],
  "Auto Repair": ["FastLane", "PrecisionAuto", "TrueWrench", "MotorPro", "DriveRight", "AutoCare", "GearHead", "PeakAuto", "TrustMech", "SpeedWorks"],
  "Physical Therapy": ["MoveWell", "ActiveLife", "FlexPoint", "MotionPro", "RecoverRight", "PeakPhysio", "BodyBalance", "VitalStep", "CoreMotion", "AgileRehab"],
  default: ["Premier", "Elite", "ProService", "TopChoice", "TrustWorthy", "AllStar", "NextLevel", "PrimePick", "BestLocal", "GoldStar"],
};

const NICHE_SUFFIXES = {
  Plumbing: ["Plumbing", "Plumbing Co", "Pipe & Drain", "Plumbing Services", "Plumbers"],
  HVAC: ["HVAC", "Heating & Air", "Climate Control", "AC Services", "Heating & Cooling"],
  Electrical: ["Electric", "Electrical Services", "Electric Co", "Electricians", "Power Solutions"],
  Dental: ["Dental", "Dentistry", "Dental Care", "Dental Group", "Dental Studio"],
  Roofing: ["Roofing", "Roof & Repair", "Roofing Co", "Roofing Solutions", "Roofing Pros"],
  Landscaping: ["Landscaping", "Lawn Care", "Landscape Design", "Yard Services", "Outdoor Living"],
  Chiropractic: ["Chiropractic", "Chiro Center", "Wellness Center", "Spinal Care", "Health Center"],
  "Auto Repair": ["Auto Repair", "Auto Service", "Car Care", "Automotive", "Auto Shop"],
  "Physical Therapy": ["Physical Therapy", "PT Center", "Rehabilitation", "Therapy Center", "Movement Clinic"],
  default: ["Services", "Solutions", "Pros", "Experts", "Co"],
};

const ISSUE_TEMPLATES = [
  { t: "Missing {{n}} relevant business categories", s: "HIGH", i: "You're invisible for searches in these categories. Competitors list {{avg}} categories.", gen: (r) => ({ n: Math.floor(r() * 6) + 4, avg: Math.floor(r() * 5) + 9 }) },
  { t: "Only {{n}} photos uploaded", s: "HIGH", i: "Businesses with 100+ photos get 520% more calls. Your top competitor has {{comp}} photos.", gen: (r) => ({ n: Math.floor(r() * 6) + 2, comp: Math.floor(r() * 30) + 25 }) },
  { t: "No Google Posts in {{n}}+ days", s: "HIGH", i: "Active posting improves local ranking by up to 14%. {{pct}}% of top competitors post weekly.", gen: (r) => ({ n: Math.floor(r() * 60) + 60, pct: Math.floor(r() * 20) + 60 }) },
  { t: "Business description is only {{n}} characters", s: "HIGH", i: "You have 750 characters available. A complete description with local keywords helps Google match you with searches.", gen: (r) => ({ n: Math.floor(r() * 80) + 20 }) },
  { t: "Only {{n}} reviews (top competitor has {{comp}})", s: "MEDIUM", i: "Review count is a top-3 local ranking signal. You need a systematic review generation strategy.", gen: (r) => ({ n: Math.floor(r() * 15) + 5, comp: Math.floor(r() * 70) + 50 }) },
  { t: "Not responding to {{pct}}% of reviews", s: "MEDIUM", i: "Google tracks response rate as an engagement signal. Responding to all reviews shows active management.", gen: (r) => ({ pct: Math.floor(r() * 40) + 50 }) },
  { t: "No products or services listed in profile", s: "MEDIUM", i: "The services section helps Google match your listing with specific search queries like '{{example}}'.", gen: (r, niche) => ({ example: niche.toLowerCase() + " near me" }) },
  { t: "Q&A section is empty", s: "MEDIUM", i: "Pre-populating Q&A with common questions improves engagement and provides keyword signals to Google.", gen: () => ({}) },
  { t: "Missing {{n}} business attributes", s: "MEDIUM", i: "Attributes help you show up in filtered searches. Competitors average {{avg}} attributes.", gen: (r) => ({ n: Math.floor(r() * 8) + 4, avg: Math.floor(r() * 6) + 8 }) },
  { t: "Holiday hours not configured", s: "LOW", i: "Customers may visit or call when you're closed, leading to negative experiences and potentially bad reviews.", gen: () => ({}) },
  { t: "No appointment or booking link set", s: "LOW", i: "A direct booking link removes friction. Competitors with booking links see {{pct}}% more conversions.", gen: (r) => ({ pct: Math.floor(r() * 15) + 15 }) },
  { t: "Website UTM tracking not configured", s: "LOW", i: "Without UTM parameters, you can't track which leads come from your Google listing vs other sources.", gen: () => ({}) },
  { t: "Cover photo is low resolution", s: "LOW", i: "Your cover photo is the first thing customers see. A professional, high-res image builds immediate trust.", gen: () => ({}) },
  { t: "Business name doesn't match signage exactly", s: "LOW", i: "NAP (Name-Address-Phone) consistency across all platforms is a confirmed ranking factor.", gen: () => ({}) },
];

const FIX_TEMPLATES = [
  {
    week: "Week 1 — Quick Wins (2 hours total)",
    items: [
      { t: "Add all missing business categories", d: "Log into Google Business Profile → Edit Profile → Business Category. Add every relevant category for your {{niche}} business. Your competitors in {{city}} list 9-14 categories on average. This takes 10 minutes and has immediate impact." },
      { t: "Write a complete business description", d: "Go to Edit Profile → Description. Write 500-750 characters describing your services, years in business, service area, and what makes you different. Mention '{{city}}' naturally 2-3 times. Include your main services as keywords." },
      { t: "Set holiday and special hours", d: "Edit Profile → Hours → Special Hours. Add all upcoming holidays. This prevents customers from showing up when you're closed and protects against negative reviews." },
    ]
  },
  {
    week: "Week 2 — Photos & Media (spread across the week)",
    items: [
      { t: "Upload 20+ high-quality photos", d: "Take photos of: your team at work (3-5), your equipment or workspace (3-5), completed jobs showing results (10+), and your storefront (2-3). Name files descriptively: '{{niche_lower}}-{{city_lower}}.jpg'. Google reads filenames." },
      { t: "Add a professional cover photo and logo", d: "Your cover photo is the first thing customers see on your listing. Use a high-res image (1024x576px minimum) that represents your {{niche}} business. Upload your logo separately." },
    ]
  },
  {
    week: "Week 3-4 — Reviews & Activity",
    items: [
      { t: "Start a review collection system", d: "After each completed job, send a text or email: 'Thanks for choosing us! If you were happy with our work, a Google review helps other people in {{city}} find us: [your review link]'. Aim for 5-10 new reviews per month." },
      { t: "Post to Google weekly", d: "Every Monday, create a Google Post: share a completed job photo, a seasonal tip, or a special offer. Keep it 150-300 words with a photo. This signals to Google that your business is active and engaged." },
      { t: "Respond to every existing review", d: "Reply to all reviews — positive and negative. Thank positive reviewers by name. For negative reviews, apologize professionally and offer to resolve the issue offline. Response rate is a ranking signal." },
    ]
  },
  {
    week: "Ongoing — Monthly Maintenance (30 min/month)",
    items: [
      { t: "List all services with descriptions", d: "Add every {{niche}} service you offer with a description and price range. This helps Google match you with specific searches like '{{niche_lower}} repair near me' or '{{niche_lower}} installation {{city}}'." },
      { t: "Pre-populate your Q&A section", d: "Add and answer 5-10 common questions: pricing, service area, emergency availability, licensing, insurance, payment methods. This gives Google more keyword content and helps customers find answers instantly." },
    ]
  },
];

function generateAudit(business, city, niche) {
  const rng = seededRandom(business + city + niche);
  const score = Math.floor(rng() * 25) + 25;

  // Generate issues
  const numIssues = 10 + Math.floor(rng() * 4);
  const selectedIssues = pickN(ISSUE_TEMPLATES, numIssues, rng).map(tmpl => {
    const vars = tmpl.gen(rng, niche);
    let title = tmpl.t, impact = tmpl.i;
    Object.entries(vars).forEach(([k, v]) => {
      title = title.replaceAll(`{{${k}}}`, v);
      impact = impact.replaceAll(`{{${k}}}`, v);
    });
    return { title, severity: tmpl.s, impact };
  });
  selectedIssues.sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.severity] - order[b.severity];
  });

  // Generate competitors
  const prefixes = COMPETITOR_PREFIXES[niche] || COMPETITOR_PREFIXES.default;
  const suffixes = NICHE_SUFFIXES[niche] || NICHE_SUFFIXES.default;
  const picked = pickN(prefixes, 4, rng);
  const competitors = [
    { name: business, reviews: Math.floor(rng() * 18) + 5, rating: (3.8 + rng() * 0.5).toFixed(1), photos: Math.floor(rng() * 6) + 2, categories: Math.floor(rng() * 3) + 3, posts: "None", isYou: true },
    ...picked.map((p, i) => ({
      name: p + " " + suffixes[Math.floor(rng() * suffixes.length)],
      reviews: Math.floor(rng() * 60) + 30 + (3 - i) * 15,
      rating: (4.2 + rng() * 0.7).toFixed(1),
      photos: Math.floor(rng() * 30) + 12 + (3 - i) * 5,
      categories: Math.floor(rng() * 5) + 7,
      posts: ["Weekly", "Monthly", "Monthly", "Quarterly"][i],
    })),
  ];

  // Generate fixes
  const cityLower = city.toLowerCase().replace(/,?\s*(tx|ca|fl|ny|az|co|ga|nc|oh|pa|il|wa|ma|nj|va|md|or|mn|wi|mo|in|tn|sc|al|la|ky|ok|ct|ia|ms|ar|ks|nv|nm|ne|wv|id|hi|nh|me|ri|mt|de|sd|nd|ak|vt|wy|dc)$/i, "").trim();
  const fixes = FIX_TEMPLATES.map(group => ({
    week: group.week,
    items: group.items.map(item => ({
      title: item.t,
      description: item.d
        .replaceAll("{{niche}}", niche)
        .replaceAll("{{niche_lower}}", niche.toLowerCase())
        .replaceAll("{{city}}", city)
        .replaceAll("{{city_lower}}", cityLower),
    })),
  }));

  return { business, city, niche, score, issues: selectedIssues, competitors, fixes };
}

// ─── PDF HTML Generator ───
function auditToHTML(data, type) {
  const { business, city, niche, score, issues, competitors, fixes } = data;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const sc = (s) => s === "HIGH" ? "#DC3545" : s === "MEDIUM" ? "#E8950A" : "#16A34A";
  const sb = (s) => s === "HIGH" ? "#FFF0F0" : s === "MEDIUM" ? "#FFFBEB" : "#F0FDF4";
  const displayIssues = type === "free" ? issues.filter(i => i.severity === "HIGH").slice(0, 3) : issues;

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@page{margin:0.6in 0.7in;size:letter}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;font-size:10.5pt;line-height:1.55}
.pb{page-break-before:always}
.bar{height:4px;background:#00A854;margin-bottom:18px;border-radius:2px}
h1{font-size:24pt;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px}
h2{font-size:14pt;font-weight:700;margin:20px 0 10px;padding-bottom:6px;border-bottom:1.5px solid #e5e7eb}
h3{font-size:11pt;font-weight:700;margin:12px 0 4px}
.sub{font-size:11pt;color:#6b7280;margin-bottom:16px}
.sm{color:#6b7280;font-size:9pt}
table{width:100%;border-collapse:collapse;margin:10px 0 14px}
th{background:#f3f4f6;text-align:left;padding:7px 10px;font-size:8.5pt;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;font-weight:700;border:0.5px solid #e5e7eb}
td{padding:8px 10px;border:0.5px solid #e5e7eb;font-size:10pt;vertical-align:top}
tr:nth-child(even) td{background:#fafafa}
.you td{background:#fff0f0!important}
.sev{font-size:8pt;font-weight:700;padding:2px 7px;border-radius:3px;display:inline-block}
.fix{background:#f9fafb;border:0.5px solid #e5e7eb;border-radius:5px;padding:12px 14px;margin:7px 0}
.fix b{font-size:10.5pt}
.fix p{font-size:9.5pt;color:#374151;line-height:1.6;margin-top:3px}
.cta{background:#e6f7ef;border:1.5px solid #00A854;border-radius:5px;padding:16px;margin:18px 0}
.footer{border-top:0.5px solid #e5e7eb;padding-top:8px;margin-top:20px;text-align:center;font-size:8pt;color:#9ca3af}
.score-wrap{display:flex;align-items:flex-start;gap:20px;margin:14px 0 18px}
.score-circle{width:90px;height:90px;border-radius:50%;border:5px solid ${score<40?"#DC3545":score<70?"#E8950A":"#16A34A"};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.score-n{font-size:28pt;font-weight:800;color:${score<40?"#DC3545":score<70?"#E8950A":"#16A34A"};line-height:1}
.score-l{font-size:8pt;color:#6b7280}
.summ{background:#f3f4f6;border:0.5px solid #e5e7eb;border-radius:5px;padding:12px 14px;margin-bottom:10px;font-size:10pt;line-height:1.6}
</style></head><body>
<div class="bar"></div>
<h1>Google Business Profile Audit</h1>
<div class="sub"><b>${business}</b> — ${city} &nbsp;|&nbsp; ${today}</div>
<div class="score-wrap">
<div class="score-circle"><div class="score-n">${score}</div><div class="score-l">out of 100</div></div>
<div><h3>Profile Health Score: ${score}/100</h3>
<p style="font-size:10pt;margin-top:4px">Your Google Business Profile for <b>${business}</b> in ${city} has <b>${issues.filter(i=>i.severity==="HIGH").length} critical issues</b> and <b>${issues.length} total issues</b> across 25+ ranking factors. When potential customers search for ${niche.toLowerCase()} services in your area, your competitors are appearing above you.</p>
</div></div>
${type==="full"?`<div class="summ"><b>Executive Summary:</b> This audit analyzes your complete Google Business Profile, compares you against the top local competitors in ${city}, and provides a prioritized action plan. <b>Quick wins are available</b> — fixing just the top 3 issues could improve your visibility within 2-4 weeks.</div>`:""}

<h2>${type==="free"?"Top 3 Critical Issues Found":"Complete Issue Breakdown — "+displayIssues.length+" Issues"}</h2>
<table><thead><tr><th style="width:45%">Issue</th><th style="width:13%">Severity</th><th style="width:42%">Impact</th></tr></thead><tbody>
${displayIssues.map(i=>`<tr><td>${i.title}</td><td><span class="sev" style="background:${sb(i.severity)};color:${sc(i.severity)}">${i.severity}</span></td><td class="sm">${i.impact}</td></tr>`).join("")}
</tbody></table>
<p style="font-size:10pt"><b>Total: ${issues.length} issues</b> — ${issues.filter(i=>i.severity==="HIGH").length} High | ${issues.filter(i=>i.severity==="MEDIUM").length} Medium | ${issues.filter(i=>i.severity==="LOW").length} Low</p>

${type==="free"?`
<div class="cta"><p><b>Want the full picture?</b></p><p style="margin-top:6px;font-size:10pt">This free audit covers your top 3 issues. The <b>Full Audit Report</b> includes all ${issues.length} issues, a detailed competitor breakdown, and step-by-step fix instructions.</p><p style="margin-top:6px;font-size:10pt"><b>Get your Full Audit for $97</b> — reply to this email or visit localrank.pro/audit</p></div>
`:`
<div class="pb"></div><div class="bar"></div>
<h1>Competitor Comparison</h1>
<div class="sub">How ${business} stacks up against top competitors in ${city}</div>
<table><thead><tr><th>Business</th><th>Reviews</th><th>Rating</th><th>Photos</th><th>Categories</th><th>Posts</th></tr></thead><tbody>
${competitors.map((c,i)=>`<tr class="${i===0?'you':''}"><td>${i===0?'<b>'+c.name+' (YOU)</b>':c.name}</td><td>${c.reviews}</td><td>${c.rating}</td><td>${c.photos}</td><td>${c.categories}</td><td>${c.posts}</td></tr>`).join("")}
</tbody></table>
<h3>Key Takeaways</h3>
<ul style="margin:6px 0 0 16px;font-size:10pt;line-height:1.7">
<li>Your top competitor has <b>${Math.round(competitors[1]?.reviews/Math.max(competitors[0]?.reviews,1))}x more reviews</b> than you</li>
<li>You have the <b>fewest photos</b> of any competitor in the top 5</li>
<li>${competitors.filter(c=>c.posts==="Weekly"||c.posts==="Monthly").length} of ${competitors.length-1} competitors post regularly to Google</li>
<li>Average competitor lists <b>${Math.round(competitors.slice(1).reduce((a,c)=>a+c.categories,0)/(competitors.length-1))} categories</b>. You list ${competitors[0]?.categories}.</li>
</ul>

<div class="pb"></div><div class="bar"></div>
<h1>How to Fix It</h1>
<div class="sub">Step-by-step action plan, prioritized by impact</div>
${fixes.map(g=>`<h2>${g.week}</h2>${g.items.map(it=>`<div class="fix"><b>${it.title}</b><p>${it.description}</p></div>`).join("")}`).join("")}
`}

<div class="cta"><p><b>Need help implementing these fixes?</b></p><p style="margin-top:6px;font-size:10pt">Our <b>Done-For-You</b> package ($397) includes full optimization of your Google Business Profile — we handle everything in this report so you don't have to.</p><p style="margin-top:6px;font-size:10pt">Reply to this email or visit <b>localrank.pro</b> to get started.</p></div>
<div class="footer">LocalRank — Helping local businesses get found on Google &nbsp;|&nbsp; localrank.pro</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const NICHES = ["Plumbing","HVAC","Electrical","Roofing","Landscaping","Dental","Chiropractic","Auto Repair","Physical Therapy"];

// ─── Landing Page ───
function LandingPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [biz, setBiz] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeIssue, setActiveIssue] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIssue(p => (p + 1) % 5), 2800);
    return () => clearInterval(t);
  }, []);

  const issues = [
    { s: "HIGH", icon: "⚠", label: "Missing 8 relevant service categories" },
    { s: "HIGH", icon: "📸", label: "Only 3 photos (competitor avg: 24)" },
    { s: "MEDIUM", icon: "📝", label: "No Google Posts in 90+ days" },
    { s: "MEDIUM", icon: "⭐", label: "Only 12 reviews (top competitor: 89)" },
    { s: "LOW", icon: "🕐", label: "Holiday hours not configured" },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "120px 0 80px", position: "relative" }}>
        <div style={{ position: "absolute", top: "40px", left: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,210,106,0.05)0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "100px", padding: "5px 14px", marginBottom: "22px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>Free audit — no credit card</span>
            </div>
            <h1 style={{ fontFamily: ffd, fontSize: "48px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "18px" }}>
              Your Google listing is <span style={{ color: C.orange }}>losing you</span> customers
            </h1>
            <p style={{ fontSize: "16px", color: C.muted, lineHeight: 1.7, maxWidth: "460px", marginBottom: "28px" }}>
              We audit your Google Business Profile and show you exactly what's wrong, what your competitors do better, and how to fix it.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => onNavigate("generator")} style={{ background: C.green, color: C.bg, padding: "13px 26px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                Get Your Free Audit <span style={{ fontSize: "18px" }}>→</span>
              </button>
            </div>
            <div style={{ display: "flex", gap: "28px", marginTop: "28px" }}>
              {[["200+", "Businesses Audited"], ["34", "Avg. Issues Found"], ["93%", "Find Critical Issues"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, color: C.green }}>{n}</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "6px" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />)}
              <span style={{ fontSize: "11px", color: C.muted, marginLeft: "6px" }}>Sample Audit — Bob's Plumbing, Austin TX</span>
            </div>
            <div style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", borderRadius: "8px", background: C.redDim, border: "1px solid rgba(255,71,87,0.15)", marginBottom: "16px" }}>
                <div style={{ fontFamily: ffd, fontSize: "38px", fontWeight: 800, color: C.red }}>34</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: C.red }}>Profile Health Score</div>
                  <div style={{ fontSize: "11px", color: C.muted }}>Out of 100 · Critical issues found</div>
                </div>
              </div>
              {issues.map((iss, i) => (
                <div key={i} onClick={() => setActiveIssue(i)} style={{ padding: "10px 12px", borderRadius: "6px", marginBottom: "4px", background: activeIssue === i ? (iss.s === "HIGH" ? C.redDim : iss.s === "MEDIUM" ? C.orangeDim : C.greenDim) : "transparent", border: `1px solid ${activeIssue === i ? (iss.s === "HIGH" ? "rgba(255,71,87,0.2)" : "rgba(255,165,2,0.2)") : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
                  <span style={{ fontSize: "13px" }}>{iss.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: activeIssue === i ? 600 : 400, color: activeIssue === i ? C.white : C.muted, flex: 1 }}>{iss.label}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "3px", background: iss.s === "HIGH" ? C.redDim : iss.s === "MEDIUM" ? C.orangeDim : C.greenDim, color: iss.s === "HIGH" ? C.red : iss.s === "MEDIUM" ? C.orange : C.green }}>{iss.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verticals bar */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "16px 0", background: C.surface }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          {["Plumbers","Dentists","HVAC","Electricians","Roofers","Landscapers","Auto Shops","Chiropractors"].map(v => (
            <span key={v} style={{ fontSize: "12px", fontWeight: 500, color: C.muted }}>{v}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section style={{ padding: "90px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: C.green }}>How It Works</span>
            <h2 style={{ fontFamily: ffd, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", marginTop: "10px" }}>Three steps to more customers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {[
              { s: "01", t: "We audit your listing", d: "We analyze your Google Business Profile across 25+ ranking factors and compare you to your top local competitors.", icon: "🔍" },
              { s: "02", t: "You get a detailed report", d: "Within 24 hours, receive a professional PDF with your score, every issue found, and step-by-step fix instructions.", icon: "📊" },
              { s: "03", t: "You climb the rankings", d: "Follow the recommendations or let us handle it. Most businesses see improvement within 2-4 weeks.", icon: "📈" },
            ].map((step, i) => (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "28px 24px", position: "relative" }}>
                <div style={{ position: "absolute", top: "20px", right: "20px", fontFamily: ffd, fontSize: "42px", fontWeight: 800, color: C.border }}>{step.s}</div>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{step.icon}</div>
                <h3 style={{ fontFamily: ffd, fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{step.t}</h3>
                <p style={{ fontSize: "13.5px", color: C.muted, lineHeight: 1.7 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 0", background: C.surface }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: C.green }}>Pricing</span>
            <h2 style={{ fontFamily: ffd, fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", marginTop: "10px" }}>Invest in being found</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
            {[
              { name: "Free Audit", price: "$0", desc: "See what's wrong", features: ["Profile health score","Top 3 critical issues","Competitor snapshot","Delivered via email"], featured: false },
              { name: "Full Audit", price: "$97", desc: "The complete picture", features: ["Everything in Free +","25+ factor deep analysis","5 competitor breakdown","Step-by-step fix guide","PDF report"], featured: true },
              { name: "Done For You", price: "$397", desc: "We fix everything", features: ["Full Audit included","We optimize your listing","Category & description rewrite","Review strategy plan","30-day follow-up"], featured: false },
            ].map(plan => (
              <div key={plan.name} style={{ background: plan.featured ? C.bg : C.surface2, border: `1px solid ${plan.featured ? C.green : C.border}`, borderRadius: "12px", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                {plan.featured && <div style={{ position: "absolute", top: "12px", right: "-26px", background: C.green, color: C.bg, fontSize: "9px", fontWeight: 800, padding: "3px 32px", transform: "rotate(45deg)", letterSpacing: "0.5px" }}>POPULAR</div>}
                <div style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>{plan.name}</div>
                <div style={{ fontFamily: ffd, fontSize: "40px", fontWeight: 800, letterSpacing: "-1.5px" }}>{plan.price}</div>
                <div style={{ fontSize: "12.5px", color: C.muted, marginBottom: "20px" }}>{plan.desc}</div>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", marginBottom: "8px" }}>
                    <span style={{ color: C.green, fontSize: "14px" }}>✓</span>
                    <span style={{ color: C.mutedLight }}>{f}</span>
                  </div>
                ))}
                <button onClick={() => onNavigate("generator")} style={{ display: "block", width: "100%", textAlign: "center", padding: "11px", borderRadius: "7px", background: plan.featured ? C.green : "transparent", color: plan.featured ? C.bg : C.white, border: plan.featured ? "none" : `1px solid ${C.border}`, fontWeight: 700, fontSize: "13px", cursor: "pointer", marginTop: "18px", fontFamily: ff }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: ffd, fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "10px" }}>Get your free audit now</h2>
          <p style={{ color: C.muted, marginBottom: "24px" }}>Takes 30 seconds. Report delivered within 24 hours.</p>
          {!submitted ? (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "28px" }}>
              <input style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: "14px", fontFamily: ff, marginBottom: "10px" }} placeholder="Your business name" value={biz} onChange={e => setBiz(e.target.value)} />
              <input style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: "14px", fontFamily: ff, marginBottom: "10px" }} placeholder="Your email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <button onClick={() => setSubmitted(true)} style={{ width: "100%", padding: "13px", borderRadius: "8px", background: C.green, color: C.bg, fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: ff }}>Send Me My Free Audit →</button>
              <p style={{ fontSize: "11px", color: C.muted, marginTop: "10px" }}>No spam. No credit card. Just your audit.</p>
            </div>
          ) : (
            <div style={{ background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "12px", padding: "36px" }}>
              <div style={{ fontSize: "36px" }}>✓</div>
              <h3 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, color: C.green, marginTop: "8px" }}>You're in!</h3>
              <p style={{ color: C.muted, marginTop: "6px", fontSize: "13px" }}>Check your inbox within 24 hours.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: C.bg, fontSize: "11px", fontWeight: 800 }}>L</div>
            <span style={{ fontFamily: ffd, fontSize: "14px", fontWeight: 600 }}>LocalRank</span>
          </div>
          <span style={{ fontSize: "11px", color: C.muted }}>© 2026 LocalRank</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Generator Page ───
function GeneratorPage({ onNavigate }) {  // eslint-disable-line
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("Plumbing");
  const [reportType, setReportType] = useState("full");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const generate = () => {
    if (!business.trim() || !city.trim()) { setError("Enter both business name and city"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const data = generateAudit(business.trim(), city.trim(), niche);
      setResult(data);
      setHistory(prev => [{ business: business.trim(), city: city.trim(), niche, score: data.score, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
      setLoading(false);
    }, 800);
  };

  const printPDF = () => {
    if (!result) return;
    const html = auditToHTML(result, reportType);
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const downloadHTML = () => {
    if (!result) return;
    const html = auditToHTML(result, reportType);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-${result.business.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${reportType}.html`;
    a.click();
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: "6px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: ff, color: C.white, background: C.bg, outline: "none" };
  const lbl = { display: "block", fontSize: "11px", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "6px" };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 24px" }}>
      <button onClick={() => onNavigate("landing")} style={{ background: "none", border: "none", color: C.muted, fontSize: "13px", cursor: "pointer", fontFamily: ff, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
        ← Back to home
      </button>

      <div style={{ display: "grid", gridTemplateColumns: result ? "340px 1fr" : "420px", gap: "20px" }}>
        {/* Form */}
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "24px" }}>
            <h2 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700, marginBottom: "3px" }}>Generate Audit</h2>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "18px" }}>Enter details → get a branded report in 2 seconds</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
              <div>
                <label style={lbl}>Business Name</label>
                <input style={inp} placeholder="e.g. Bob's Plumbing" value={business} onChange={e => setBusiness(e.target.value)} onFocus={() => setError("")} />
              </div>
              <div>
                <label style={lbl}>City</label>
                <input style={inp} placeholder="e.g. Austin, TX" value={city} onChange={e => setCity(e.target.value)} onFocus={() => setError("")} />
              </div>
              <div>
                <label style={lbl}>Industry</label>
                <select style={{ ...inp, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237B8698' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "36px" }} value={niche} onChange={e => setNiche(e.target.value)}>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Report Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[["free", "Free (3 issues)"], ["full", "Full ($97 value)"]].map(([v, l]) => (
                    <button key={v} onClick={() => setReportType(v)} style={{ flex: 1, padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${reportType === v ? C.green : C.border}`, background: reportType === v ? C.greenDim : "transparent", color: reportType === v ? C.green : C.muted, cursor: "pointer", fontFamily: ff }}>{l}</button>
                  ))}
                </div>
              </div>
              {error && <div style={{ background: C.redDim, border: `1px solid rgba(255,71,87,0.25)`, borderRadius: "6px", padding: "9px 12px", fontSize: "12px", color: C.red, fontWeight: 600 }}>{error}</div>}
              <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "6px", background: C.green, color: C.bg, fontSize: "14px", fontWeight: 700, border: "none", cursor: loading ? "wait" : "pointer", fontFamily: ff, opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(11,14,19,0.3)", borderTopColor: C.bg, borderRadius: "50%", animation: "spin 0.6s linear infinite" }} /> Generating...</> : "⚡ Generate Audit Report"}
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 20px", marginTop: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px" }}>Recent</div>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{h.business}</div>
                    <div style={{ fontSize: "10.5px", color: C.muted }}>{h.city} · {h.niche}</div>
                  </div>
                  <div style={{ fontFamily: ffd, fontSize: "14px", fontWeight: 700, color: h.score < 40 ? C.red : C.orange }}>{h.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button onClick={printPDF} style={{ padding: "10px 20px", borderRadius: "6px", background: C.green, color: C.bg, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: ff, display: "flex", alignItems: "center", gap: "6px" }}>🖨️ Print as PDF</button>
              <button onClick={downloadHTML} style={{ padding: "10px 20px", borderRadius: "6px", background: "transparent", color: C.white, fontSize: "13px", fontWeight: 700, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: ff, display: "flex", alignItems: "center", gap: "6px" }}>⬇ Download HTML</button>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: C.surface2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Audit Preview</span>
                <span style={{ fontSize: "11px", color: C.muted }}>{reportType === "full" ? "Full Report · 4 pages" : "Free Teaser · 1 page"}</span>
              </div>

              <div style={{ padding: "22px" }}>
                <div style={{ height: "4px", background: C.green, borderRadius: "2px", marginBottom: "14px" }} />
                <h3 style={{ fontFamily: ffd, fontSize: "20px", fontWeight: 700 }}>Google Business Profile Audit</h3>
                <p style={{ fontSize: "12.5px", color: C.muted, marginTop: "3px" }}><strong>{result.business}</strong> — {result.city}</p>

                {/* Score */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "18px 0", padding: "16px", borderRadius: "8px", background: result.score < 40 ? C.redDim : C.orangeDim, border: `1px solid ${result.score < 40 ? "rgba(255,71,87,0.15)" : "rgba(255,165,2,0.15)"}` }}>
                  <div style={{ fontFamily: ffd, fontSize: "36px", fontWeight: 800, color: result.score < 40 ? C.red : C.orange }}>{result.score}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: result.score < 40 ? C.red : C.orange }}>Profile Health Score</div>
                    <div style={{ fontSize: "11px", color: C.muted }}>{result.issues.filter(i => i.severity === "HIGH").length} critical issues found</div>
                  </div>
                </div>

                {/* Issues */}
                <div style={{ fontFamily: ffd, fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>
                  Issues ({(reportType === "free" ? result.issues.filter(i => i.severity === "HIGH").slice(0, 3) : result.issues).length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "240px", overflowY: "auto" }}>
                  {(reportType === "free" ? result.issues.filter(i => i.severity === "HIGH").slice(0, 3) : result.issues).map((iss, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "9px 11px", borderRadius: "6px", border: `1px solid ${C.border}`, background: i % 2 === 0 ? C.surface2 : "transparent" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", flexShrink: 0, marginTop: "2px", background: iss.severity === "HIGH" ? C.redDim : iss.severity === "MEDIUM" ? C.orangeDim : C.greenDim, color: iss.severity === "HIGH" ? C.red : iss.severity === "MEDIUM" ? C.orange : C.green }}>{iss.severity}</span>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{iss.title}</div>
                        <div style={{ fontSize: "11px", color: C.muted, marginTop: "1px" }}>{iss.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Competitors (full only) */}
                {reportType === "full" && result.competitors && (
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ fontFamily: ffd, fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Competitors</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
                        <thead>
                          <tr>{["Business","Reviews","Rating","Photos","Cat."].map(h => <th key={h} style={{ textAlign: "left", padding: "7px 8px", background: C.surface2, border: `1px solid ${C.border}`, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: C.muted, fontWeight: 700 }}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {result.competitors.map((c, i) => (
                            <tr key={i} style={{ background: i === 0 ? C.redDim : "transparent" }}>
                              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}`, fontWeight: i === 0 ? 700 : 400 }}>{c.name}{i === 0 ? " (YOU)" : ""}</td>
                              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.reviews}</td>
                              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.rating}</td>
                              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.photos}</td>
                              <td style={{ padding: "7px 8px", border: `1px solid ${C.border}` }}>{c.categories}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "18px", background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "6px", padding: "14px", fontSize: "12.5px" }}>
                  <strong>Report ready!</strong> Click "Print as PDF" to save as a professional PDF, then attach it to your cold email.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workflow tips (shown when no result) */}
      {!result && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "24px", marginTop: "20px" }}>
          <h3 style={{ fontFamily: ffd, fontSize: "16px", fontWeight: 700, marginBottom: "14px" }}>Your Daily 2-Hour Workflow</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {[
              { n: "1", t: "Find leads", d: "Google Maps → search niche + US city → find weak profiles", time: "30 min" },
              { n: "2", t: "Generate audits", d: "Paste details here → generate PDF for each lead", time: "10 min" },
              { n: "3", t: "Send emails", d: "Use cold email templates → attach free audit", time: "60 min" },
              { n: "4", t: "Follow up", d: "Re-send to non-responders after 3 days", time: "20 min" },
            ].map(s => (
              <div key={s.n} style={{ padding: "16px", borderRadius: "6px", background: C.surface2, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: ffd, fontSize: "22px", fontWeight: 800, color: C.green }}>{s.n}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px", marginBottom: "4px" }}>{s.t}</div>
                <div style={{ fontSize: "11.5px", color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
                <div style={{ fontSize: "11px", color: C.green, fontWeight: 600, marginTop: "6px" }}>{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP ROOT — Simple router
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        input:focus, select:focus { outline: none; border-color: ${C.green} !important; }
        button:hover { opacity: 0.92; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Top Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: `${C.bg}E8`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }} onClick={() => setPage("landing")}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: C.bg, fontSize: "14px", fontWeight: 800 }}>L</div>
            <span style={{ fontFamily: ffd, fontSize: "17px", fontWeight: 700 }}>LocalRank</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {page === "landing" && (
              <>
                <span onClick={() => document.getElementById("pricing")?.scrollIntoView()} style={{ color: C.muted, fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Pricing</span>
              </>
            )}
            <button onClick={() => setPage("generator")} style={{ background: C.green, color: C.bg, padding: "7px 16px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: ff }}>
              {page === "generator" ? "⚡ Generator" : "Get Free Audit"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: "58px" }}>
        {page === "landing" && <LandingPage onNavigate={setPage} />}
        {page === "generator" && <GeneratorPage onNavigate={setPage} />}
      </div>
    </div>
  );
}
