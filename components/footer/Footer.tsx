import { profile, navigation } from "@/data/portfolio";
import { Monogram } from "@/components/ui/Monogram";

/** Site footer: identity, section links and a restrained colophon. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink-2">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-4">
          <Monogram size={40} className="text-silver" />
          <div>
            <p className="font-sans text-sm font-medium text-silver">{profile.name}</p>
            <p className="mt-1 text-xs text-mist">{profile.title}</p>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-silver-dim">
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={`/#${item.id}`} className="link-underline hover:text-cyan focus-visible:text-cyan">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist">
          © {year} {profile.name}. Built with Next.js & React Three Fiber.
        </p>
      </div>
    </footer>
  );
}
