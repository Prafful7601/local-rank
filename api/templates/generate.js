// Vercel serverless function — /api/templates/generate
// Uses Groq (llama-3.3-70b) to write fully personalized cold email sequences

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business, city, niche, score, issues } = req.body || {};

  if (!business || !city || !niche) {
    return res.status(400).json({ success: false, error: "Missing audit data" });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) return res.json({ success: false, error: "API key not configured" });

  const highIssues = (issues || [])
    .filter(i => i.severity === "HIGH")
    .slice(0, 3)
    .map(i => `• ${i.title}`)
    .join("\n");

  const allIssues = (issues || [])
    .slice(0, 6)
    .map(i => `• [${i.severity}] ${i.title}`)
    .join("\n");

  const totalIssues = (issues || []).length;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert cold email copywriter who specializes in local SEO outreach.
You write short, punchy, human-sounding emails that get replies.
You reference specific audit findings to make each email feel personal and researched.
Never sound like a template. Always respond with valid JSON only — no markdown fences.`,
          },
          {
            role: "user",
            content: `I ran a Google Business Profile audit for a real business. Write 4 personalized cold email templates to sell them on fixing their profile.

AUDIT DATA:
Business Name: ${business}
City: ${city}
Industry: ${niche}
Profile Score: ${score}/100
Critical issues found:
${highIssues}

All issues (${totalIssues} total):
${allIssues}

Write these 4 emails — keep each body under 160 words, sound like a real person, reference the specific business and findings:

1. INITIAL OUTREACH — deliver the free audit, mention 1-2 specific issues by name, soft CTA
2. 3-DAY FOLLOW-UP — no reply yet, mention a specific competitor advantage they're missing out on, urgency without pressure
3. PAID OPTIMIZATION PITCH ($49) — they've engaged, now pitch the full fix, reference all ${totalIssues} issues, make the $49 feel like a no-brainer
4. DONE-FOR-YOU BUNDLE ($149) — for businesses too busy to implement, pitch the website + GBP bundle

Return ONLY this JSON array, no other text:
[
  {
    "id": "initial",
    "tag": "Step 1",
    "tagColor": "#EF4444",
    "title": "Initial Outreach — Free Audit Delivery",
    "desc": "Send with the PDF attached. Reference real issues you found.",
    "subject": "<subject line here>",
    "body": "<email body here>"
  },
  {
    "id": "followup",
    "tag": "Step 2",
    "tagColor": "#F97316",
    "title": "3-Day Follow-Up",
    "desc": "No reply yet. Hit them with a specific competitor comparison.",
    "subject": "<subject line here>",
    "body": "<email body here>"
  },
  {
    "id": "upgrade",
    "tag": "Step 3",
    "tagColor": "#00D26A",
    "title": "Full Optimization Pitch — $49",
    "desc": "They've engaged. Close them on the paid fix.",
    "subject": "<subject line here>",
    "body": "<email body here>"
  },
  {
    "id": "dfy",
    "tag": "Upsell",
    "tagColor": "#F59E0B",
    "title": "Done-For-You Bundle — $149",
    "desc": "Too busy to implement? We do everything.",
    "subject": "<subject line here>",
    "body": "<email body here>"
  }
]`,
          },
        ],
        temperature: 0.85,
        max_tokens: 2400,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array in Groq response");

    const templates = JSON.parse(jsonMatch[0]);
    return res.json({ success: true, templates });

  } catch (err) {
    console.error("Groq templates error:", err.message);
    return res.json({ success: false, error: err.message });
  }
}
