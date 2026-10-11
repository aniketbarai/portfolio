/** Fine-line separator with a single signal point, used between major sections. */
export function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-px max-w-7xl px-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan)]" />
    </div>
  );
}
