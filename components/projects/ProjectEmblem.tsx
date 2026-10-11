import type { Project } from "@/data/types";

/** 2D counterpart of each 3D emblem. Used on mobile cards and as a no-WebGL visual. */
export function ProjectEmblem({ emblem, accent, className }: { emblem: Project["emblem"]; accent: Project["accent"]; className?: string }) {
  const stroke = accent === "lime" ? "#c4ff4d" : accent === "cyan" ? "#3ee8ff" : "#d6dee7";
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`em-${emblem}-${accent}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#222b36" />
          <stop offset="1" stopColor="#0c1015" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="239" height="149" fill="none" stroke="rgb(214 222 231 / 0.1)" />
      {emblem === "stack" ? (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={70 + i * 10}
              y={110 - i * 20}
              width="100"
              height="14"
              rx="3"
              fill={`url(#em-${emblem}-${accent})`}
              stroke={i === 3 ? stroke : "#d6dee7"}
              strokeOpacity={i === 3 ? 0.9 : 0.35}
            />
          ))}
        </g>
      ) : null}
      {emblem === "grid" ? (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 78 + (i % 3) * 30;
            const y = 28 + Math.floor(i / 3) * 30;
            const lit = i === 4 || i === 6;
            return (
              <rect key={i} x={x} y={y} width="24" height="24" rx="3" fill={lit ? stroke : `url(#em-${emblem}-${accent})`} fillOpacity={lit ? 0.85 : 1} stroke="#d6dee7" strokeOpacity="0.3" />
            );
          })}
        </g>
      ) : null}
      {emblem === "rings" ? (
        <g fill="none" stroke="#d6dee7" strokeOpacity="0.5">
          <ellipse cx="120" cy="75" rx="62" ry="22" transform="rotate(-12 120 75)" />
          <ellipse cx="120" cy="75" rx="44" ry="44" transform="rotate(8 120 75)" strokeOpacity="0.3" />
          <ellipse cx="120" cy="75" rx="80" ry="30" transform="rotate(20 120 75)" stroke={stroke} strokeOpacity="0.45" />
          <circle cx="120" cy="75" r="9" fill={stroke} stroke="none" />
        </g>
      ) : null}
      {emblem === "prism" ? (
        <g fill="none" stroke="#d6dee7" strokeOpacity="0.55">
          <path d="M120 22 L168 98 L120 128 L72 98 Z" fill={`url(#em-${emblem}-${accent})`} />
          <path d="M120 22 L120 128 M72 98 L168 98" strokeOpacity="0.4" />
          <path d="M120 60 L144 98 L120 112 L96 98 Z" stroke={stroke} strokeOpacity="0.9" />
        </g>
      ) : null}
    </svg>
  );
}
