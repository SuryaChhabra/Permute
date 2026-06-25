import React from "react";
import { interpolate } from "remotion";
import { colors } from "../theme";
import { easeOut } from "../anim";

// A single elegant confirmation pulse — a ring that expands once and fades.
// Anchor it inside a position:relative element; it centers on that point.
export const ConfirmRing: React.FC<{
  progress: number; // 0..1
  size?: number;
  color?: string;
  thickness?: number;
}> = ({ progress, size = 44, color = colors.green, thickness = 2 }) => {
  if (progress <= 0 || progress >= 1) return null;
  const scale = interpolate(progress, [0, 1], [0.45, 1.7]);
  const opacity = interpolate(progress, [0, 0.18, 1], [0, 0.7, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `${thickness}px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Soft, static ambient ring — used as a quiet halo behind a focal point.
export const SoftRing: React.FC<{
  size: number;
  color?: string;
  opacity?: number;
  thickness?: number;
}> = ({ size, color = colors.blue, opacity = 0.12, thickness = 1.5 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: "50%",
      border: `${thickness}px solid ${color}`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// Glowing node — a small dot with a soft halo. Position via left/top on parent.
export const GlowNode: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, size = 10, color = colors.blue, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 ${size * 1.6}px ${size * 0.5}px ${color}66`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// A glow node travelling along a horizontal segment as `progress` goes 0->1.
export const TravelNode: React.FC<{
  x1: number;
  x2: number;
  y: number;
  progress: number;
  color?: string;
  size?: number;
}> = ({ x1, x2, y, progress, color = colors.blue, size = 9 }) => {
  if (progress <= 0 || progress >= 1) return null;
  const x = interpolate(progress, [0, 1], [x1, x2]);
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  return <GlowNode x={x} y={y} size={size} color={color} opacity={opacity} />;
};

// A thin light band sweeping across a relative/overflow-hidden parent.
export const LightSweep: React.FC<{
  progress: number; // 0..1 across the parent
  color?: string;
  width?: number;
}> = ({ progress, color = "rgba(255,255,255,0.55)", width = 26 }) => {
  if (progress <= 0 || progress >= 1) return null;
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: "-20%",
        bottom: "-20%",
        left: `${progress * 120 - 10}%`,
        width: `${width}%`,
        background: `linear-gradient(105deg, transparent, ${color}, transparent)`,
        transform: "skewX(-12deg)",
        opacity,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

// Small floating data chip that eases in and drifts up slightly.
export const FloatingChip: React.FC<{
  label: string;
  appear: number; // 0..1
  tint?: string;
  style?: React.CSSProperties;
}> = ({ label, appear, tint = colors.blue, style }) => {
  const y = (1 - appear) * 12;
  return (
    <div
      style={{
        position: "absolute",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.92)",
        border: `1px solid ${tint}33`,
        boxShadow: "0 6px 18px -8px rgba(20,40,90,0.25)",
        fontSize: 12.5,
        fontWeight: 600,
        color: colors.inkSoft,
        opacity: interpolate(appear, [0, 1], [0, 1], { easing: easeOut }),
        transform: `translateY(${y}px)`,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: tint,
        }}
      />
      {label}
    </div>
  );
};
