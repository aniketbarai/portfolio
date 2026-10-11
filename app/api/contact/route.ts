import { NextResponse, type NextRequest } from "next/server";
import { CONTACT_LIMITS, parseContactPayload, validateContact, hasErrors } from "@/lib/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { profile } from "@/data/portfolio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } as const;
const EMAIL_TIMEOUT_MS = 10_000;

interface JsonBody {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
  retryAfter?: number;
}

function json(body: JsonBody, status: number, headers?: HeadersInit): NextResponse<JsonBody> {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Rejects cross-site form posts: the Origin header, when present, must match this host. */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile is optional; the other protections still apply.
  if (!token) return false;

  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function safeHeaderText(value: string, max: number): string {
  // Strip line breaks so user input cannot inject email headers.
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function POST(request: NextRequest): Promise<NextResponse<JsonBody>> {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: "This request could not be verified." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "Send the form as JSON." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "That message is too large to send." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "The request body was not valid JSON." }, 400);
  }

  const payload = parseContactPayload(parsed);
  if (!payload) {
    return json({ ok: false, error: "The request is missing form fields." }, 400);
  }

  const ip = clientIp(request);
  const limit = checkRateLimit(`contact:${ip}`, RATE_LIMIT);
  if (!limit.allowed) {
    return json(
      {
        ok: false,
        error: "You have sent several messages recently. Please wait a few minutes, or email me directly.",
        retryAfter: limit.retryAfterSeconds,
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  // Honeypot and timing checks: silent to humans, effective against naive bots.
  if (payload.company.length > 0 || payload.elapsedMs < CONTACT_LIMITS.minElapsedMs) {
    return json(
      { ok: false, error: "Your message could not be sent. Please email me directly instead." },
      400,
    );
  }

  const fieldErrors = validateContact(payload);
  if (hasErrors(fieldErrors)) {
    return json({ ok: false, error: "Please correct the highlighted fields.", fields: fieldErrors }, 422);
  }

  if (!(await verifyTurnstile(payload.turnstileToken, ip))) {
    return json(
      { ok: false, error: "The anti-spam check failed. Please try again." },
      403,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // Never pretend a message was delivered when no mail provider is configured.
    console.error("[contact] Email delivery is not configured (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL).");
    return json(
      {
        ok: false,
        error: `The contact form is not connected to an email service yet. Please email ${profile.email} directly.`,
      },
      503,
    );
  }

  const name = safeHeaderText(payload.name, CONTACT_LIMITS.nameMax);
  const email = payload.email.trim();
  const message = payload.message.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
      }),
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`[contact] Email provider responded with HTTP ${res.status}.`);
      return json(
        { ok: false, error: `Your message could not be sent right now. Please email ${profile.email} directly.` },
        502,
      );
    }
  } catch (error) {
    console.error("[contact] Email provider request failed.", error instanceof Error ? error.name : "unknown");
    return json(
      { ok: false, error: `Your message could not be sent right now. Please email ${profile.email} directly.` },
      502,
    );
  }

  return json({ ok: true }, 200);
}

export function GET(): NextResponse<JsonBody> {
  return json({ ok: false, error: "Method not allowed." }, 405, { Allow: "POST" });
}
