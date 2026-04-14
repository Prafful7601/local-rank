// Vercel serverless function — /api/audit/enhance
// Uses native fetch (Node 18+, available on Vercel by default)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business, city, niche, score, issues } = req.body || {};

  if (!business || !city || !niche) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return res.json({ success: false, error: "API key not configured on server" });
  }

  const topIssues = (issues || [])
    .slice(0, 5)
    .map(i => `• ${i.title} (${i.severity})`)
    .join("\n");

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
            content: `You are a senior local SEO strategist specializing in Google Business Profile optimization.
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
      throw new Error(`Groq API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in Groq response");

    const insights = JSON.parse(jsonMatch[0]);
    return res.json({ success: true, insights });

  } catch (err) {
    console.error("Groq error:", err.message);
    return res.json({ success: false, error: err.message });
  }
}
