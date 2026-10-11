import { cn } from "@/lib/utils";

/**
 * Custom "AB" monogram: two interlocking strokes forming a monolith-like
 * architecture with a single cyan signal point. Decorative; the name is in text.
 */
export function Monogram({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect x="1" y="1" width="46" height="46" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.22" />
      <path d="M13 36 V13 H22 C27 13 28 17 28 20 C28 23 26 25 22 25 H13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M25 13 V36 M25 36 H35 V25 L30 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.9" />
      <circle cx="37" cy="13" r="2.2" fill="var(--color-cyan)" />
    </svg>
  );
}
