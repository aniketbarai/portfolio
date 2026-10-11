import Link from "next/link";

export default function NotFound() {
  return (
    <main className="fine-grid flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display text-[clamp(3rem,8vw,6rem)] text-silver">This dimension is empty.</h1>
      <p className="max-w-md text-silver-dim">The page you were looking for does not exist or has moved.</p>
      <Link href="/" className="rounded-full bg-silver px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-cyan">
        Return home
      </Link>
    </main>
  );
}
