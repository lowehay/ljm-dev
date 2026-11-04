import { SYSTEM_PROMPT } from "../../ask-facts";

// "Ask about me" chat, answered by Google Gemini from the portfolio's own content (app/ask-facts.ts).
// Needs GEMINI_API_KEY; GEMINI_MODEL overrides the model.
// The "-latest" aliases follow Google's current Flash models, so the chat doesn't break when a version is retired.
// If the main model is overloaded (Google answers 429/503 under high demand), the lighter model is tried once.
const MODELS = [process.env.GEMINI_MODEL ?? "gemini-flash-latest", "gemini-flash-lite-latest"];

const MAX_MESSAGES = 12; // six back-and-forths
const MAX_CHARS = 500; // per message
const RATE_LIMIT = 10; // questions per visitor...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per ten minutes

type Message = { role: "user" | "model"; text: string };

// Best effort: each server instance keeps its own counts, which is enough to stop one visitor draining the free quota
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

function parseMessages(body: unknown): Message[] | null {
  const list = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGES) return null;
  const messages: Message[] = [];
  for (const item of list) {
    const role = (item as Message)?.role;
    const text = String((item as Message)?.text ?? "").trim();
    if ((role !== "user" && role !== "model") || !text || text.length > MAX_CHARS) return null;
    messages.push({ role, text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: "The assistant isn't set up yet." }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "You've asked a lot of questions! Please try again in a few minutes." }, { status: 429 });
  }

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) return Response.json({ error: "Please keep questions under 500 characters." }, { status: 400 });

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: {
      // Thinking tokens count toward this limit, so it's higher than a short answer needs
      maxOutputTokens: 1024,
      temperature: 0.3,
      // Short factual answers don't need much thinking, and less of it means faster replies
      thinkingConfig: { thinkingLevel: "low" },
    },
  });

  try {
    let res: Response | undefined;
    for (const model of MODELS) {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(25_000),
      });
      if (res.status !== 429 && res.status !== 503) break;
    }
    if (!res?.ok) throw new Error(`Gemini responded ${res?.status}: ${await res?.text()}`);

    const data = await res.json();
    const reply = (data.candidates?.[0]?.content?.parts ?? [])
      .filter((part: { thought?: boolean }) => !part.thought)
      .map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();
    if (!reply) throw new Error(`Gemini returned no text: ${JSON.stringify(data).slice(0, 500)}`);
    return Response.json({ reply });
  } catch (error) {
    console.error("Ask about me failed", error);
    return Response.json(
      { error: "Sorry, I couldn't answer that right now. You can always email Louie directly." },
      { status: 502 }
    );
  }
}
