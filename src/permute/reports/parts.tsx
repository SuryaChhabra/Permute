import React from "react";
import { interpolate } from "remotion";
import { colors, radii, shadows } from "../theme";
import { easeOut } from "../anim";

export const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = colors.inkMuted,
}) => (
  <div
    style={{
      fontSize: 12.5,
      fontWeight: 700,
      letterSpacing: "0.09em",
      color,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

// Small branching glyph approximating the HubSpot connector mark.
const HubGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 15,
  color = colors.orange,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="12" r="2.4" fill={color} />
    <circle cx="18" cy="6" r="2.4" fill={color} />
    <circle cx="18" cy="18" r="2.4" fill={color} />
    <path
      d="M8 11l8-4M8 13l8 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SourceChip: React.FC<{ label: string; appear?: number }> = ({
  label,
  appear = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 13px",
      borderRadius: radii.chip,
      background: colors.orangeTint,
      border: `1px solid ${colors.orange}33`,
      fontSize: 14.5,
      fontWeight: 700,
      color: colors.orangeDeep,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 8}px)`,
      whiteSpace: "nowrap",
    }}
  >
    <HubGlyph />
    {label}
  </div>
);

export const MetricCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  appear: number;
  width?: number;
}> = ({ label, value, sub, accent = colors.blue, appear, width }) => (
  <div
    style={{
      width,
      flex: width ? "0 0 auto" : "1 1 0",
      background: "#fff",
      borderRadius: radii.card,
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.card,
      padding: "18px 20px",
      opacity: interpolate(appear, [0, 1], [0, 1], { easing: easeOut }),
      transform: `translateY(${(1 - appear) * 22}px) scale(${0.97 + appear * 0.03})`,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: accent,
        }}
      />
      <span style={{ fontSize: 13.5, color: colors.inkMuted, fontWeight: 600 }}>
        {label}
      </span>
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: colors.ink,
        letterSpacing: "-0.02em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 13, color: colors.inkMuted, marginTop: 6 }}>
        {sub}
      </div>
    )}
  </div>
);

type Tone = "neutral" | "green" | "orange" | "blue";

const toneColor = (t: Tone) =>
  t === "green"
    ? { fg: colors.green, bg: colors.greenTint }
    : t === "orange"
      ? { fg: colors.orangeDeep, bg: colors.orangeTint }
      : t === "blue"
        ? { fg: colors.blueDeep, bg: colors.blueTint }
        : { fg: colors.inkMuted, bg: colors.surfaceMuted };

export const Badge: React.FC<{ text: string; tone?: Tone; dot?: boolean }> = ({
  text,
  tone = "neutral",
  dot = true,
}) => {
  const c = toneColor(tone);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: 12.5,
        fontWeight: 600,
        color: c.fg,
        background: c.bg,
        border: `1px solid ${c.fg}22`,
        borderRadius: radii.pill,
        padding: "4px 11px",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: c.fg,
          }}
        />
      )}
      {text}
    </span>
  );
};
