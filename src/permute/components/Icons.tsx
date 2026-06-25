import React from "react";
import { colors } from "../theme";

export const CheckCircle: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = colors.inkSoft,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.5" />
    <path
      d="M8 12.2l2.6 2.6L16 9.4"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Filled confirmation check used for reconciliation glows.
export const CheckFilled: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = colors.green,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill={color} />
    <path
      d="M7.2 12.4l3 3L17 8.6"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Dashed "in progress" ring. Pass `rotate` for spin.
export const DashRing: React.FC<{
  size?: number;
  color?: string;
  rotate?: number;
}> = ({ size = 22, color = colors.inkMuted, rotate = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      stroke={color}
      strokeWidth="1.6"
      strokeDasharray="3 3.4"
    />
  </svg>
);

export const Chevron: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = colors.inkMuted,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 15,
  color = colors.inkFaint,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.7" />
    <path
      d="M16 16l4 4"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const GridIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 15,
  color = colors.inkMuted,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="2.5"
      stroke={color}
      strokeWidth="1.6"
    />
    <path d="M3.5 9.5h17M9.5 3.5v17" stroke={color} strokeWidth="1.4" />
  </svg>
);

// Small source-connector glyph (colored rounded square with mark).
export const ConnectorGlyph: React.FC<{ tint: string; size?: number }> = ({
  tint,
  size = 22,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 6,
      background: tint,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
    }}
  >
    <div
      style={{
        width: size * 0.42,
        height: size * 0.42,
        borderRadius: 3,
        background: "rgba(255,255,255,0.92)",
      }}
    />
  </div>
);

export const Cursor: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3l13 7.5-5.4 1.3L9.7 17 5 3z"
      fill="#1b2336"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);
