/**
 * Static, WebGL-free composition shown during SSR, before the 3D scene loads,
 * and on devices without WebGL. Mirrors the 3D monolith with SVG and CSS.
 */
export function HeroFallback({ className }: { className?: string }) {
  return (
    <div className={`relative h-full w-full ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 800 800" className="absolute inset-0 m-auto h-[92%] w-auto max-w-none opacity-90" fill="none">
        <defs>
          <linearGradient id="fb-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2c3541" />
            <stop offset="0.5" stopColor="#151a21" />
            <stop offset="1" stopColor="#262f3a" />
          </linearGradient>
          <linearGradient id="fb-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dce8f4" stopOpacity="0.22" />
            <stop offset="1" stopColor="#dce8f4" stopOpacity="0.03" />
          </linearGradient>
          <radialGradient id="fb-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#3ee8ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#3ee8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="400" r="330" fill="url(#fb-glow)" />
        <ellipse cx="400" cy="420" rx="290" ry="90" stroke="#d6dee7" strokeOpacity="0.22" />
        <ellipse cx="400" cy="400" rx="330" ry="120" stroke="#d6dee7" strokeOpacity="0.14" transform="rotate(-14 400 400)" />
        <ellipse cx="400" cy="380" rx="370" ry="150" stroke="#3ee8ff" strokeOpacity="0.16" transform="rotate(10 400 380)" />
        <rect x="290" y="150" width="220" height="500" rx="10" fill="url(#fb-metal)" stroke="#d6dee7" strokeOpacity="0.35" />
        <rect x="396" y="200" width="6" height="400" fill="#3ee8ff" />
        <rect x="400" y="560" width="72" height="3" fill="#c4ff4d" />
        <rect x="160" y="240" width="150" height="100" rx="6" fill="url(#fb-glass)" stroke="#d6dee7" strokeOpacity="0.3" transform="rotate(-6 235 290)" />
        <rect x="500" y="430" width="170" height="110" rx="6" fill="url(#fb-glass)" stroke="#d6dee7" strokeOpacity="0.3" transform="rotate(5 585 485)" />
        <rect x="170" y="500" width="140" height="92" rx="6" fill="url(#fb-glass)" stroke="#d6dee7" strokeOpacity="0.25" transform="rotate(-3 240 546)" />
        <circle cx="630" cy="200" r="5" fill="#3ee8ff" />
        <circle cx="180" cy="610" r="3" fill="#d6dee7" />
        <circle cx="610" cy="640" r="2.5" fill="#d6dee7" />
      </svg>
    </div>
  );
}
