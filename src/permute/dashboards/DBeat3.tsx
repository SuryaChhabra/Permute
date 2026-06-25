import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, radii, shadows, fontFamily } from "../theme";
import { Caption } from "../components/Caption";
import { SoftRing } from "../components/Motion";
import { easeOut, easeInOut, reveal } from "../anim";

// Bulb anchor (screen coords); chips fan to the right.
const BX = 660;
const BY = 470;

type Chip = { label: string; x: number; y: number; at: number };
const CHIPS: Chip[] = [
  { label: "Add cash runway trend", x: 1020, y: 360, at: 16 },
  { label: "Compare burn vs revenue", x: 1080, y: 470, at: 24 },
  { label: "Highlight overdue invoices", x: 1020, y: 580, at: 32 },
  { label: "Add scenario planning", x: 880, y: 660, at: 40 },
];

export const DBeat3: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();
  const chips = rich ? CHIPS : CHIPS.slice(0, 3);

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [70, 81], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // bulb lights up
  const light = reveal(frame, 6, 16);
  // ideas flow back into the dashboard near the end
  const flow = interpolate(frame, [56, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {/* softened dashboard context */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1380,
          height: 855,
          marginLeft: -690,
          marginTop: -427,
          borderRadius: radii.window,
          boxShadow: shadows.window,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          transform: `scale(${interpolate(frame, [0, 81], [1.02, 1.06], {
            extrapolateRight: "clamp",
          })})`,
        }}
      >
        <Img
          src={staticFile("dash/overview-still.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(7px) saturate(0.92)",
            transform: "scale(1.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(244,247,251,0.62)",
          }}
        />
      </div>

      {/* Option 2: connector lines from bulb to chips */}
      {rich && (
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {chips.map((c, i) => {
            const d = interpolate(frame, [c.at, c.at + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            });
            const fx = c.x + (BX - c.x) * flow;
            const fy = c.y + (BY - c.y) * flow;
            return (
              <line
                key={i}
                x1={BX}
                y1={BY}
                x2={BX + (fx - BX) * d}
                y2={BY + (fy - BY) * d}
                stroke={colors.blue}
                strokeWidth={1.4}
                opacity={0.34 * (1 - flow * 0.6)}
              />
            );
          })}
        </svg>
      )}

      {/* suggestion chips */}
      {chips.map((c, i) => {
        const a = reveal(frame, c.at, 12);
        const fx = c.x + (BX - c.x) * flow;
        const fy = c.y + (BY - c.y) * flow;
        const fade = 1 - flow;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: fx,
              top: fy,
              transform: `translate(-50%, -50%) scale(${(0.9 + a * 0.1) * (1 - flow * 0.25)})`,
              opacity: a * fade,
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 16px",
              borderRadius: radii.pill,
              background: "#fff",
              border: `1px solid ${colors.blue}33`,
              boxShadow: shadows.card,
              fontFamily,
              fontSize: 16,
              fontWeight: 600,
              color: colors.inkSoft,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{ width: 8, height: 8, borderRadius: "50%", background: colors.blue }}
            />
            {c.label}
          </div>
        );
      })}

      {/* the bulb */}
      <div
        style={{
          position: "absolute",
          left: BX,
          top: BY,
          transform: "translate(-50%, -50%)",
        }}
      >
        {rich && (
          <>
            <SoftRing size={150} opacity={0.18 * light} />
            <SoftRing size={210} opacity={0.1 * light} />
          </>
        )}
        <Bulb light={light} />
      </div>

      <Caption
        lines={["Get ideas to improve the dashboard."]}
        enter={6}
        exitStart={64}
        size={52}
      />
    </AbsoluteFill>
  );
};

const Bulb: React.FC<{ light: number }> = ({ light }) => {
  const id = React.useId();
  return (
    <svg width={120} height={120} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-g`} cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#eaf1ff" />
          <stop offset="45%" stopColor="#8fb0ff" />
          <stop offset="100%" stopColor="#3a6df0" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(90,134,244,0.55)" />
          <stop offset="100%" stopColor="rgba(90,134,244,0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="44" r="46" fill={`url(#${id}-glow)`} opacity={light} />
      {/* glass */}
      <circle
        cx="50"
        cy="42"
        r="26"
        fill={`url(#${id}-g)`}
        opacity={0.35 + light * 0.65}
      />
      <ellipse cx="42" cy="34" rx="9" ry="6" fill="rgba(255,255,255,0.85)" opacity={light} />
      {/* filament */}
      <path
        d="M44 44 Q50 36 56 44"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity={light}
      />
      {/* base */}
      <rect x="42" y="64" width="16" height="7" rx="2" fill="#cdd6e4" />
      <rect x="44" y="71" width="12" height="6" rx="2" fill="#aab6c8" />
      <rect x="46" y="77" width="8" height="4" rx="2" fill="#8f9cb0" />
    </svg>
  );
};
