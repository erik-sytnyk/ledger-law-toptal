import Anthropic from "@anthropic-ai/sdk";

// Simple in-memory rate limit (100 req / 15 min per identifier)
// For production: use Upstash Redis (@upstash/ratelimit)
const limit = 100;
const windowMs = 15 * 60 * 1000;
const store = new Map(); // ip -> { count, resetAt }

function checkRateLimit(identifier) {
  const now = Date.now();
  let entry = store.get(identifier);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(identifier, entry);
  }
  entry.count++;
  if (entry.count > limit) {
    return false;
  }
  return true;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.headers["x-real-ip"] || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again in 15 minutes." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const {
      clientName = "Client",
      caseType = "Motor Vehicle Accident",
      carrier = "Allstate",
      accidentSummary = "",
      policyLimit = "$100,000",
      attorney = "Emery Brett Ledger",
    } = body;

    const anthropic = new Anthropic({ apiKey });
    const prompt = `You are a legal AI assistant for LedgerLaw.ai, a personal injury law firm. Generate a professional demand letter outline (2-3 paragraphs) for the following case. Format for Colossus optimization: lead with liability, then injuries, then damages. Use professional legal tone.

Case details:
- Client: ${clientName}
- Case type: ${caseType}
- Insurance carrier: ${carrier}
- Policy limit: ${policyLimit}
- Attorney: ${attorney}
- Accident summary: ${accidentSummary || "Not provided"}

Output only the demand letter content, no meta-commentary.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({
      success: true,
      demand: text,
      pages: Math.ceil(text.length / 3000) || 1,
    });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate demand",
    });
  }
}
