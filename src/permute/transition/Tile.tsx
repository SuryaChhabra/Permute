import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TileData } from "./tiles";
import { Glyph } from "./glyphs";
import { easeInOut } from "../anim";

const MOVE_BASE = 30;
const MOVE_DUR = 50;

export const Tile: React.FC<{ t: TileData }> = ({ t }) => {
  const frame = useCurrentFrame();
  const start = MOVE_BASE + t.delay;
  const p = interpolate(frame, [start, start + MOVE_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // subtle pre-move tension (gentle float)
  const breathe = p < 0.02 ? Math.sin(frame / 9 + t.id) * 2.2 : 0;
  const startSize = 100 * t.sscale;

  let cx: number;
  let cy: number;
  let size: number;
  let rot: number;
  let opacity: number;

  if (t.kept) {
    cx = interpolate(p, [0, 1], [t.sx, t.gx + t.gsize / 2]);
    cy = interpolate(p, [0, 1], [t.sy + breathe, t.gy + t.gsize / 2]);
    size = interpolate(p, [0, 1], [startSize, t.gsize]);
    rot = interpolate(p, [0, 1], [t.srot, 0]);
    opacity = 1;
  } else {
    // recede: drift toward center & up, shrink and fade away (cleared)
    const cxTarget = t.sx + (960 - t.sx) * 0.18;
    const cyTarget = t.sy - 60;
    cx = interpolate(p, [0, 1], [t.sx, cxTarget]);
    cy = interpolate(p, [0, 1], [t.sy + breathe, cyTarget]);
    size = interpolate(p, [0, 1], [startSize, startSize * 0.62]);
    rot = interpolate(p, [0, 1], [t.srot, t.srot * 0.4]);
    opacity = interpolate(p, [0.15, 0.85], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (opacity <= 0) return null;

  const radius = size * 0.22;
  // nearer tiles cast a stronger shadow; flatten as they align
  const shadowDepth = 0.18 + t.sdepth * 0.32;
  const shadow = `0 ${10 + t.sdepth * 14}px ${22 + t.sdepth * 20}px -8px rgba(20,40,90,${shadowDepth * (1 - p * 0.4)})`;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(155deg, #ffffff 0%, #eef1f7 100%)",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: shadow,
        transform: `rotate(${rot}deg)`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Glyph type={t.glyph} c={t.color} size={size * 0.5} />
    </div>
  );
};
