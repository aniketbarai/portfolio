import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Text link to an external site with a visible external-link indicator and an accessible label. */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "link-underline inline-flex items-center gap-1 text-sm text-silver hover:text-cyan focus-visible:text-cyan",
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
