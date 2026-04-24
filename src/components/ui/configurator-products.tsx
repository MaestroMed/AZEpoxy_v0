/**
 * SVG product illustrations for the visual configurator.
 *
 * Each product accepts a `color` prop (hex) used as the primary fill for
 * paintable areas. Shadow / accent paths are derived from the base color via
 * darkening so the illustration reads as a painted 3D object rather than a
 * flat sticker.
 */

export type ConfiguratorProductId = "jante" | "portail" | "chaise" | "moto";

interface ProductIllustrationProps {
  color: string;
  /** 0-100 brightness tweak for finish (mat vs brillant). Default 100. */
  brightness?: number;
  className?: string;
}

/** Hex color → darker version by mixing with black. ratio 0-1 */
function darken(hex: string, ratio: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const mix = (v: number) => Math.max(0, Math.round(v * (1 - ratio)));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

/** Hex color → lighter version by mixing with white. ratio 0-1 */
function lighten(hex: string, ratio: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const mix = (v: number) =>
    Math.min(255, Math.round(v + (255 - v) * ratio));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

// ── Jante (5-spoke alloy wheel) ──────────────────────────────────────
function JanteSVG({ color, className }: ProductIllustrationProps) {
  const dark = darken(color, 0.35);
  const darker = darken(color, 0.55);
  const light = lighten(color, 0.25);
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Jante alliage 5 branches"
    >
      {/* Tire */}
      <circle cx="200" cy="200" r="190" fill="#1A1A1A" />
      <circle cx="200" cy="200" r="178" fill="#0D0D0D" />
      {/* Rim outer */}
      <circle cx="200" cy="200" r="160" fill={color} />
      <circle
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke={dark}
        strokeWidth="2"
      />
      {/* Highlight ring */}
      <circle
        cx="200"
        cy="200"
        r="152"
        fill="none"
        stroke={light}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* 5 spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 360) / 5 - 90;
        const rad = (angle * Math.PI) / 180;
        const x2 = 200 + Math.cos(rad) * 140;
        const y2 = 200 + Math.sin(rad) * 140;
        return (
          <g key={i}>
            <path
              d={`M 200 200 L ${x2} ${y2}`}
              stroke={dark}
              strokeWidth="32"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 200 200 L ${x2} ${y2}`}
              stroke={color}
              strokeWidth="24"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 200 200 L ${x2} ${y2}`}
              stroke={light}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>
        );
      })}
      {/* Hub */}
      <circle cx="200" cy="200" r="38" fill={darker} />
      <circle cx="200" cy="200" r="30" fill={dark} />
      <circle cx="200" cy="200" r="22" fill={color} />
      <circle cx="200" cy="200" r="8" fill={darker} />
      {/* Lug nuts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 360) / 5 - 54;
        const rad = (angle * Math.PI) / 180;
        const x = 200 + Math.cos(rad) * 52;
        const y = 200 + Math.sin(rad) * 52;
        return <circle key={i} cx={x} cy={y} r="5" fill={darker} />;
      })}
    </svg>
  );
}

// ── Portail (double-leaf gate) ──────────────────────────────────────
function PortailSVG({ color, className }: ProductIllustrationProps) {
  const dark = darken(color, 0.35);
  const light = lighten(color, 0.2);
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Portail double battant"
    >
      {/* Ground shadow */}
      <ellipse cx="200" cy="370" rx="170" ry="8" fill="#000" opacity="0.2" />
      {/* Left pillar */}
      <rect x="30" y="60" width="30" height="310" fill={dark} rx="3" />
      <rect x="36" y="66" width="18" height="298" fill={color} rx="2" />
      {/* Right pillar */}
      <rect x="340" y="60" width="30" height="310" fill={dark} rx="3" />
      <rect x="346" y="66" width="18" height="298" fill={color} rx="2" />
      {/* Left leaf frame */}
      <rect x="66" y="90" width="132" height="280" fill={dark} rx="3" />
      <rect x="72" y="96" width="120" height="268" fill={color} rx="2" />
      {/* Right leaf frame */}
      <rect x="202" y="90" width="132" height="280" fill={dark} rx="3" />
      <rect x="208" y="96" width="120" height="268" fill={color} rx="2" />
      {/* Vertical bars left */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={`l-${i}`}
          x={82 + i * 22}
          y="110"
          width="8"
          height="244"
          fill={dark}
          rx="2"
        />
      ))}
      {/* Vertical bars right */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={`r-${i}`}
          x={218 + i * 22}
          y="110"
          width="8"
          height="244"
          fill={dark}
          rx="2"
        />
      ))}
      {/* Top rail */}
      <rect x="72" y="96" width="120" height="14" fill={color} rx="2" />
      <rect x="208" y="96" width="120" height="14" fill={color} rx="2" />
      <rect x="72" y="96" width="120" height="3" fill={light} opacity="0.7" />
      <rect x="208" y="96" width="120" height="3" fill={light} opacity="0.7" />
      {/* Mid rail */}
      <rect x="72" y="210" width="120" height="10" fill={color} rx="2" />
      <rect x="208" y="210" width="120" height="10" fill={color} rx="2" />
      {/* Bottom rail */}
      <rect x="72" y="354" width="120" height="10" fill={color} rx="2" />
      <rect x="208" y="354" width="120" height="10" fill={color} rx="2" />
      {/* Decorative arched top */}
      <path
        d={`M 72 96 Q 132 60 192 96`}
        stroke={color}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 208 96 Q 268 60 328 96`}
        stroke={color}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 72 96 Q 132 60 192 96`}
        stroke={dark}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d={`M 208 96 Q 268 60 328 96`}
        stroke={dark}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

// ── Chaise (bistrot métal) ──────────────────────────────────────────
function ChaiseSVG({ color, className }: ProductIllustrationProps) {
  const dark = darken(color, 0.35);
  const light = lighten(color, 0.25);
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Chaise bistrot métal"
    >
      {/* Ground shadow */}
      <ellipse cx="200" cy="380" rx="110" ry="8" fill="#000" opacity="0.2" />
      {/* Back rest frame */}
      <rect x="120" y="50" width="160" height="10" fill={color} rx="5" />
      <rect x="120" y="50" width="160" height="3" fill={light} opacity="0.7" />
      <rect x="120" y="200" width="160" height="10" fill={color} rx="5" />
      <rect x="120" y="60" width="8" height="150" fill={color} />
      <rect x="272" y="60" width="8" height="150" fill={color} />
      {/* Vertical back bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={`b-${i}`}
          x={138 + i * 28}
          y="60"
          width="6"
          height="150"
          fill={dark}
          rx="2"
        />
      ))}
      {/* Seat */}
      <ellipse cx="200" cy="225" rx="90" ry="22" fill={dark} />
      <ellipse cx="200" cy="222" rx="88" ry="20" fill={color} />
      <ellipse
        cx="200"
        cy="216"
        rx="82"
        ry="8"
        fill={light}
        opacity="0.4"
      />
      {/* 4 legs */}
      {[
        { x1: 128, x2: 100 },
        { x1: 272, x2: 300 },
        { x1: 158, x2: 140 },
        { x1: 242, x2: 260 },
      ].map((leg, i) => (
        <g key={i}>
          <path
            d={`M ${leg.x1} 232 L ${leg.x2} 378`}
            stroke={dark}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={`M ${leg.x1} 232 L ${leg.x2} 378`}
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Stretcher ring */}
      <ellipse
        cx="200"
        cy="320"
        rx="78"
        ry="10"
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
      <ellipse
        cx="200"
        cy="320"
        rx="78"
        ry="10"
        fill="none"
        stroke={dark}
        strokeWidth="5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
    </svg>
  );
}

// ── Cadre moto (motorcycle frame) ───────────────────────────────────
function MotoSVG({ color, className }: ProductIllustrationProps) {
  const dark = darken(color, 0.35);
  const darker = darken(color, 0.6);
  const light = lighten(color, 0.25);
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cadre moto"
    >
      {/* Ground shadow */}
      <ellipse cx="200" cy="340" rx="150" ry="8" fill="#000" opacity="0.2" />

      {/* Rear wheel */}
      <circle cx="90" cy="300" r="54" fill="#1A1A1A" />
      <circle cx="90" cy="300" r="44" fill="#0D0D0D" />
      <circle cx="90" cy="300" r="22" fill={darker} />
      <circle cx="90" cy="300" r="6" fill="#000" />

      {/* Front wheel */}
      <circle cx="310" cy="300" r="54" fill="#1A1A1A" />
      <circle cx="310" cy="300" r="44" fill="#0D0D0D" />
      <circle cx="310" cy="300" r="22" fill={darker} />
      <circle cx="310" cy="300" r="6" fill="#000" />

      {/* Main frame — triangulated */}
      {/* Top tube: seat area to headstock */}
      <path
        d="M 230 120 L 300 130 L 310 150 L 238 142 Z"
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      {/* Down tube */}
      <path
        d="M 310 150 L 295 245 L 270 245 L 280 150 Z"
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      {/* Tank silhouette */}
      <path
        d="M 180 140 Q 200 110 260 125 L 268 155 Q 220 170 180 160 Z"
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      <path
        d="M 180 140 Q 200 110 260 125"
        stroke={light}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      {/* Seat */}
      <path
        d="M 110 160 Q 140 145 180 155 L 180 175 L 110 185 Z"
        fill={darker}
      />
      {/* Rear sub-frame */}
      <path
        d="M 180 160 L 120 190 L 110 220 L 150 195 L 180 180 Z"
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      {/* Swing arm → rear wheel */}
      <path
        d="M 170 220 L 90 298 L 82 290 L 160 205 Z"
        fill={color}
        stroke={dark}
        strokeWidth="2"
      />
      {/* Front forks */}
      <path
        d="M 298 155 L 304 295 L 316 295 L 310 155 Z"
        fill={dark}
      />
      {/* Handlebars */}
      <path
        d="M 285 105 L 330 95 L 336 105 L 290 118 Z"
        fill={darker}
      />
      {/* Headlight */}
      <circle cx="325" cy="135" r="14" fill={light} opacity="0.9" />
      <circle cx="325" cy="135" r="10" fill="#FFF" opacity="0.8" />
      {/* Engine block */}
      <path
        d="M 195 200 L 260 210 L 264 245 L 195 240 Z"
        fill={darker}
      />
      <rect x="208" y="210" width="4" height="30" fill="#000" opacity="0.4" />
      <rect x="220" y="210" width="4" height="30" fill="#000" opacity="0.4" />
      <rect x="232" y="210" width="4" height="30" fill="#000" opacity="0.4" />
      <rect x="244" y="210" width="4" height="30" fill="#000" opacity="0.4" />
    </svg>
  );
}

const PRODUCT_MAP: Record<
  ConfiguratorProductId,
  React.FC<ProductIllustrationProps>
> = {
  jante: JanteSVG,
  portail: PortailSVG,
  chaise: ChaiseSVG,
  moto: MotoSVG,
};

export function ProductIllustration({
  product,
  color,
  brightness = 100,
  className,
}: {
  product: ConfiguratorProductId;
  color: string;
  brightness?: number;
  className?: string;
}) {
  const Component = PRODUCT_MAP[product];
  return (
    <div
      className={className}
      style={{
        filter: `brightness(${brightness}%)`,
        transition: "filter 300ms ease",
      }}
    >
      <Component color={color} />
    </div>
  );
}
