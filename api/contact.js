// Vercel serverless function — /api/contact

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required" });
  }

  // Log the lead (visible in Vercel function logs → your dashboard)
  console.log("NEW LEAD", JSON.stringify({ name, email, phone, service, message, ts: new Date().toISOString() }));

  return res.json({
    success: true,
    message: "Thanks! I'll get back to you within 24 hours.",
  });
}
