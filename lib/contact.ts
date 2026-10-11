/**
 * Contact form validation. Pure functions so the same rules run in the browser
 * (for instant feedback) and on the server (authoritative check).
 */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot field: must stay empty. Real users never see it. */
  company: string;
  /** Milliseconds between form render and submit; bots submit almost instantly. */
  elapsedMs: number;
  /** Optional Cloudflare Turnstile token. */
  turnstileToken?: string;
}

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export const CONTACT_LIMITS = {
  nameMax: 80,
  emailMax: 160,
  messageMin: 20,
  messageMax: 3000,
  /** Submissions faster than this are treated as automated. */
  minElapsedMs: 1500,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(
  input: Pick<ContactPayload, "name" | "email" | "message">,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length === 0) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.nameMax)
    errors.name = `Keep your name under ${CONTACT_LIMITS.nameMax} characters.`;

  if (email.length === 0) errors.email = "Please enter your email address.";
  else if (email.length > CONTACT_LIMITS.emailMax || !EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address, such as name@example.com.";

  if (message.length === 0) errors.message = "Please write a message.";
  else if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Messages need at least ${CONTACT_LIMITS.messageMin} characters.`;
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Keep your message under ${CONTACT_LIMITS.messageMax} characters.`;

  return errors;
}

export function hasErrors(errors: ContactFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Narrows an unknown JSON body into a ContactPayload, or returns null. */
export function parseContactPayload(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  const str = (key: string): string => (typeof record[key] === "string" ? (record[key] as string) : "");
  const elapsed = typeof record.elapsedMs === "number" && Number.isFinite(record.elapsedMs) ? record.elapsedMs : 0;
  const token = typeof record.turnstileToken === "string" ? record.turnstileToken : undefined;
  return {
    name: str("name"),
    email: str("email"),
    message: str("message"),
    company: str("company"),
    elapsedMs: elapsed,
    turnstileToken: token,
  };
}
