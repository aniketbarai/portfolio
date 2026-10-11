import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] active:scale-[0.98] focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-silver text-ink hover:bg-cyan hover:shadow-[0_0_40px_-8px_rgb(62_232_255/0.7)]",
  secondary:
    "border border-line-strong bg-white/[0.02] text-silver hover:border-cyan/60 hover:bg-cyan/[0.06] hover:text-white",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  icon?: "arrow" | "external" | "none";
  external?: boolean;
  download?: boolean | string;
}

/** Link styled as a button. External links open in a new tab with safe rel. */
export function ButtonLink({ href, variant = "primary", children, className, icon = "arrow", external = false, download }: ButtonLinkProps) {
  const content = (
    <>
      <span>{children}</span>
      {icon === "arrow" ? (
        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
      ) : null}
      {icon === "external" ? (
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  if (external || download) {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], className)}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}
