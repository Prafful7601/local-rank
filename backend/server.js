import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

// ── Grok AI audit enhancement ─────────────────────────────────
app.post("/api/audit/enhance", async (req, res) => {
  const { business, city, niche, score, issues } = req.body;

  if (!business || !city || !niche) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return res.json({ success: false, error: "Grok API key not configured" });
  }

  const topIssues = (issues || [])
    .slice(0, 5)
    .map(i => `• ${i.title} (${i.severity})`)
    .join("\n");

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-fast",
        messages: [
          {
            role: "system",
            content: `You are a senior local SEO strategist specializing in Google Business Profile optimization for Indian and US local markets.
You give sharp, specific, data-driven insights. Be direct and avoid filler phrases.
Always respond with valid JSON only — no markdown, no explanation outside the JSON.`,
          },
          {
            role: "user",
            content: `Audit data:
Business: ${business}
City: ${city}
Industry: ${niche}
Profile Health Score: ${score}/100
Top issues found:
${topIssues}

Return a JSON object with exactly these four keys:
{
  "summary": "2-sentence executive summary of what this score means for their revenue",
  "quickWin": "The single most impactful fix they can do in the next 30 minutes — be specific",
  "competitiveRisk": "What specific business they are losing to competitors RIGHT NOW — be concrete",
  "timeToResults": "Realistic timeline for ranking improvement if they act on all issues today"
}`,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Grok API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Extract JSON (Grok occasionally wraps in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Grok response");

    const insights = JSON.parse(jsonMatch[0]);
    return res.json({ success: true, insights });

  } catch (err) {
    console.error("Grok error:", err.message);
    return res.json({ success: false, error: err.message });
  }
});

// ── Contact form ──────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required" });
  }

  // Log the lead (replace with email/CRM integration in production)
  console.log("\n━━━━━━━━━━ NEW LEAD ━━━━━━━━━━");
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Phone:   ${phone || "—"}`);
  console.log(`Service: ${service || "General"}`);
  console.log(`Message: ${message}`);
  console.log(`Time:    ${new Date().toISOString()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Optional: forward to Grok for a lead-scoring summary
  // (add later if needed)

  return res.json({
    success: true,
    message: "Thanks! We will get back to you within 24 hours.",
  });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`LocalRank API → http://localhost:${PORT}`);
});
