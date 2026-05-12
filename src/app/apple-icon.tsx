import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — 180×180 PNG, same AZ monogram as the favicon and the
 * header lockup. The Z carries the ember gradient (the thermolaquage signal);
 * the A stays white for balance. iOS rounds the corners itself, so we ship a
 * full-bleed dark background and let the OS handle the squircle.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F0F1A",
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="az-apple-ember"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="#FF9A5C" />
              <stop offset="55%" stopColor="#E85D2C" />
              <stop offset="100%" stopColor="#8B2E0A" />
            </linearGradient>
          </defs>
          <path
            d="M 8 33 L 16 10 L 24 33 M 11 26 L 21 26"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M 26 12 L 37 12 L 26 32 L 37 32"
            stroke="url(#az-apple-ember)"
            strokeWidth="2.6"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    ),
    size,
  );
}
