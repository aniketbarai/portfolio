/**
 * A dimensional, isometric "system stack" that visually continues the hero's
 * monolith. Layers highlight on hover/focus; connectors carry a slow signal.
 * Pure SVG + CSS, so it costs no JavaScript and respects reduced motion.
 */
const layers = [
  { label: "Interface", detail: "React · Next.js · Tailwind", y: 40, tone: "silver" },
  { label: "Services", detail: "Node.js · Express · JWT", y: 118, tone: "silver" },
  { label: "Data", detail: "MongoDB · Mongoose · MySQL", y: 196, tone: "silver" },
  { label: "Intelligence", detail: "Gemini · MediaPipe · FastAPI", y: 274, tone: "cyan" },
] as const;

export function LayerDiagram() {
  return (
    <figure className="group relative w-full" aria-labelledby="layer-diagram-caption">
      <svg
        viewBox="0 0 520 380"
        className="h-auto w-full"
        role="img"
        aria-labelledby="layer-diagram-title layer-diagram-desc"
      >
        <title id="layer-diagram-title">Layered system diagram</title>
        <desc id="layer-diagram-desc">
          Four layers of a typical product: interface, services, data and intelligence, connected by a signal line.
        </desc>
        <defs>
          <linearGradient id="ld-face" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#1f2832" />
            <stop offset="1" stopColor="#0d1116" />
          </linearGradient>
          <linearGradient id="ld-edge" x1="0" x2="1">
            <stop offset="0" stopColor="#d6dee7" stopOpacity="0.5" />
            <stop offset="1" stopColor="#d6dee7" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ld-signal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3ee8ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#3ee8ff" stopOpacity="1" />
            <stop offset="1" stopColor="#3ee8ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Vertical signal line through the stack */}
        <line x1="260" y1="20" x2="260" y2="360" stroke="url(#ld-signal)" strokeWidth="1.5" className="ld-signal" />

        {layers.map((layer, i) => {
          const indent = i * 14;
          const accent = layer.tone === "cyan";
          return (
            <g key={layer.label} className="ld-layer" tabIndex={0} role="group" aria-label={`${layer.label}: ${layer.detail}`}>
              <path
                d={`M${110 + indent} ${layer.y + 40} L${360 - indent} ${layer.y + 40} L${430 - indent} ${layer.y + 10} L${180 + indent} ${layer.y + 10} Z`}
                fill="url(#ld-face)"
                stroke={accent ? "#3ee8ff" : "url(#ld-edge)"}
                strokeOpacity={accent ? 0.7 : 1}
                strokeWidth="1"
                className="ld-plate"
              />
              <path
                d={`M${110 + indent} ${layer.y + 40} L${180 + indent} ${layer.y + 10}`}
                stroke="#d6dee7"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
              <text x={470 - indent} y={layer.y + 14} textAnchor="end" className="ld-label" fill="#eef3f8" fontSize="15" fontFamily="var(--font-geist-mono), ui-monospace, monospace" letterSpacing="2">
                {layer.label.toUpperCase()}
              </text>
              <text x={470 - indent} y={layer.y + 32} textAnchor="end" fill="#8d99a8" fontSize="11" fontFamily="var(--font-geist-mono), ui-monospace, monospace">
                {layer.detail}
              </text>
              {accent ? <circle cx={150 + indent} cy={layer.y + 26} r="3" fill="#c4ff4d" className="ld-pulse" /> : null}
            </g>
          );
        })}
      </svg>
      <figcaption id="layer-diagram-caption" className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-silver-dim">
        Fig. 01 — How the pieces I build connect
      </figcaption>

      <style>{`
        .ld-layer { outline: none; transition: transform 700ms cubic-bezier(0.16,1,0.3,1); transform-box: fill-box; transform-origin: center; }
        .ld-layer:hover, .ld-layer:focus-visible { transform: translateX(-6px); }
        .ld-layer:hover .ld-plate, .ld-layer:focus-visible .ld-plate { stroke: #3ee8ff; stroke-opacity: 0.9; }
        .ld-signal { stroke-dasharray: 10 14; animation: ld-flow 3.2s linear infinite; }
        .ld-pulse { animation: ld-pulse 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes ld-flow { to { stroke-dashoffset: -48; } }
        @keyframes ld-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ld-signal, .ld-pulse { animation: none; }
          .ld-layer { transition: none; }
        }
      `}</style>
    </figure>
  );
}
