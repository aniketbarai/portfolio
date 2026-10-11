"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { CONTACT_LIMITS, hasErrors, validateContact, type ContactFieldErrors } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void; theme?: string },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

/** Loads the Turnstile widget script once, only when a site key is configured. */
function loadTurnstile(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable"))));
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
  });
}

export function ContactForm({ emailFallback }: { emailFallback: string }) {
  const uid = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");
  const startedAt = useRef<number>(0);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Render the optional anti-spam widget; clean it up on unmount.
  useEffect(() => {
    if (!siteKey || !widgetRef.current) return;
    let cancelled = false;
    const el = widgetRef.current;
    loadTurnstile()
      .then((api) => {
        if (cancelled) return;
        widgetId.current = api.render(el, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token) => {
            setTurnstileToken(token);
            setTurnstileError("");
          },
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => {
            setTurnstileToken("");
            setTurnstileError("The anti-spam check could not load. Refresh the page or email me directly.");
          },
        });
      })
      .catch(() => setTurnstileError("The anti-spam check could not load. Refresh the page or email me directly."));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget already removed */
        }
      }
      widgetId.current = null;
    };
  }, []);

  const update = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (errors[field as keyof ContactFieldErrors]) {
      setErrors(validateContact(next));
    }
  };

  const blur = (field: "name" | "email" | "message") => () => {
    const fieldErrors = validateContact(values);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const validation = validateContact(values);
    setErrors(validation);
    if (hasErrors(validation)) {
      setStatus("error");
      setServerMessage("Please correct the highlighted fields.");
      document.getElementById(`${uid}-name`)?.focus();
      return;
    }
    if (siteKey && !turnstileToken) {
      setStatus("error");
      setServerMessage("Please complete the anti-spam check first.");
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          company: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        error?: string;
        fields?: ContactFieldErrors;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
        setErrors({});
        setTurnstileToken("");
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
        startedAt.current = Date.now();
        return;
      }

      if (data.fields) setErrors(data.fields);
      setServerMessage(data.error ?? "Your message could not be sent. Please try again or email me directly.");
      setStatus("error");
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
        setTurnstileToken("");
      }
    } catch {
      setServerMessage(`Network problem: your message was not sent. Please try again, or email ${emailFallback}.`);
      setStatus("error");
    }
  }

  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full rounded-2xl border bg-ink/60 px-4 py-3.5 text-[0.95rem] text-silver placeholder:text-mist transition-[border-color,box-shadow] duration-300 focus:border-cyan/60 focus:outline-none focus:shadow-[0_0_0_4px_rgb(62_232_255/0.12)]",
      hasError ? "border-red-400/60" : "border-line-strong",
    );

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5" aria-describedby={`${uid}-status`}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={`${uid}-name`} label="Name" error={errors.name}>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            onBlur={blur("name")}
            maxLength={CONTACT_LIMITS.nameMax}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={fieldClass(Boolean(errors.name))}
            placeholder="Your name"
            required
          />
        </Field>
        <Field id={`${uid}-email`} label="Email" error={errors.email}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            onBlur={blur("email")}
            maxLength={CONTACT_LIMITS.emailMax}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={fieldClass(Boolean(errors.email))}
            placeholder="you@company.com"
            required
          />
        </Field>
      </div>

      <Field id={`${uid}-message`} label="Message" error={errors.message} hint={`${values.message.trim().length}/${CONTACT_LIMITS.messageMax}`}>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={update("message")}
          onBlur={blur("message")}
          maxLength={CONTACT_LIMITS.messageMax}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className={cn(fieldClass(Boolean(errors.message)), "resize-y")}
          placeholder="What are you building, and how can we work together?"
          required
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company (leave blank)</label>
        <input id={`${uid}-company`} name="company" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {siteKey ? (
        <div className="space-y-2">
          <div ref={widgetRef} />
          {turnstileError ? <p className="text-xs text-red-300">{turnstileError}</p> : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-silver px-7 py-3.5 text-sm font-medium text-ink transition-[background-color,box-shadow,opacity] duration-500 hover:bg-cyan hover:shadow-[0_0_40px_-8px_rgb(62_232_255/0.7)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p className="text-xs text-mist">Your message is sent securely to my inbox. I read every one.</p>
      </div>

      <div id={`${uid}-status`} role="status" aria-live="polite" className="min-h-[1.5rem]">
        {status === "success" ? (
          <p className="flex items-start gap-3 rounded-2xl border border-lime/40 bg-lime/[0.06] p-4 text-sm text-silver">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-lime" />
            Thank you. Your message has been sent, and I will reply to the email address you provided.
          </p>
        ) : null}
        {status === "error" && serverMessage ? (
          <p className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-400/[0.06] p-4 text-sm text-silver">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red-300" />
            {serverMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
          {label}
        </label>
        {hint ? <span className="font-mono text-[0.62rem] text-mist">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
