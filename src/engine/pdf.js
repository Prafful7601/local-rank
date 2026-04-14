// ─── PDF / HTML Export ───────────────────────────────────────────────────────
export function auditToHTML(data, type) {
  const { business, city, niche, score, issues, competitors, fixes } = data;
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const sc = (s) => s==="HIGH" ? "#DC3545" : s==="MEDIUM" ? "#E8950A" : "#16A34A";
  const sb = (s) => s==="HIGH" ? "#FFF0F0" : s==="MEDIUM" ? "#FFFBEB" : "#F0FDF4";
  const displayIssues = type==="free" ? issues.filter(i=>i.severity==="HIGH").slice(0,3) : issues;

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
${competitors.map((c,i)=>`<tr class="${i===0?"you":""}"><td>${i===0?"<b>"+c.name+" (YOU)</b>":c.name}</td><td>${c.reviews}</td><td>${c.rating}</td><td>${c.photos}</td><td>${c.categories}</td><td>${c.posts}</td></tr>`).join("")}
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
