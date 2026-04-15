// Vercel serverless function — /api/audit/analyze
// Groq-powered audit: generates contextually accurate issues for a real business
// Optionally fetches the GBP URL for extra signals

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { business, city, niche, gbpUrl } = req.body || {};
  if (!business || !city || !niche) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) return res.json({ success: false, error: "API key not configured" });

  // Try to fetch the GBP page for extra signals (best-effort; Google Maps is JS-rendered so we get limited data)
  let pageSnippet = "";
  if (gbpUrl) {
    try {
      const r = await fetch(gbpUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LocalRankBot/1.0)" },
        signal: AbortSignal.timeout(5000),
      });
      const html = await r.text();
      // Pull the meta description — often contains rating/review count on GBP pages
      const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
      const title    = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
      // Pull any JSON-LD blocks (structured data)
      const jsonLd   = (html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [])
        .map(s => s.replace(/<[^>]+>/g, "").trim())
        .join(" ")
        .slice(0, 800);
      pageSnippet = `\nPage title: ${title}\nMeta description: ${metaDesc}\nStructured data: ${jsonLd}`.trim();
    } catch {
      // silently skip — Groq will still work without it
    }
  }

  const urlContext = gbpUrl
    ? `\nGoogle Business Profile URL: ${gbpUrl}${pageSnippet ? `\nExtracted page data:\n${pageSnippet}` : "\n(URL provided but page content was not extractable — use your expertise for this business type)"}`
    : "\n(No URL provided — generate realistic issues typical for this business type and city)";

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
            content: `You are an expert Google Business Profile auditor with 10 years of local SEO experience.
You generate highly specific, realistic GBP audits that reflect what a real business profile for this niche and city typically looks like.
Never generate generic, template-sounding issues. Always reference the specific business type, city market, and niche.
Always respond with valid JSON only — no markdown fences, no explanation outside JSON.`,
          },
          {
            role: "user",
            content: `Run a detailed Google Business Profile audit for this business.

Business Name: ${business}
City / Market: ${city}
Industry / Niche: ${niche}${urlContext}

Generate a realistic audit that a local SEO professional would produce. Base the score and issues on what's typical for a ${niche} business in ${city} that has NOT been professionally optimized.

Return ONLY this JSON (no other text):
{
  "score": <integer 18–62, realistic unoptimized range>,
  "issues": [
    { "title": "<specific issue name>", "severity": "<HIGH|MEDIUM|LOW>", "impact": "<one concrete sentence — what revenue/ranking this costs them>" }
  ],
  "competitors": [
    { "name": "<competitor name realistic for ${city} ${niche}>", "reviews": <number>, "rating": <number>, "photos": <number>, "categories": <number> }
  ],
  "fixes": [
    {
      "week": "Week 1 — Quick Wins",
      "items": [
        { "title": "<action>", "description": "<specific how-to for this business>" }
      ]
    },
    {
      "week": "Week 2 — Content & Photos",
      "items": [
        { "title": "<action>", "description": "<specific how-to>" }
      ]
    },
    {
      "week": "Week 3-4 — Authority & Reviews",
      "items": [
        { "title": "<action>", "description": "<specific how-to>" }
      ]
    }
  ]
}

Rules:
- Generate 8–14 issues total (3–5 HIGH, 3–5 MEDIUM, 2–4 LOW)
- Competitors array: first entry is the audited business (lower stats), then 4 realistic local rivals with better numbers
- Each competitor should have: name (realistic local business name for ${city}), reviews (5–400), rating (3.2–4.9), photos (2–180), categories (1–4)
- Fix items: 3–4 items per week group, concrete and specific to ${niche}
- Score should reflect the issue count and severity — more HIGH issues = lower score`,
          },
        ],
        temperature: 0.75,
        max_tokens: 2800,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw  = data.choices?.[0]?.message?.content || "";

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object in Groq response");

    const audit = JSON.parse(jsonMatch[0]);
    // Attach metadata
    audit.business = business;
    audit.city     = city;
    audit.niche    = niche;
    audit.aiPowered = true;

    return res.json({ success: true, audit });

  } catch (err) {
    console.error("Groq analyze error:", err.message);
    return res.json({ success: false, error: err.message });
  }
}
