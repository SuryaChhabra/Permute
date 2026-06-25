import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TileData } from "./tiles";
import { Glyph } from "./glyphs";
import { easeInOut } from "../anim";

const MOVE_BASE = 46;
const MOVE_DUR = 82;

// cream (problem world) -> white (product world)
function faceColor(p: number, solid: boolean, color: string) {
  if (solid) return color;
  // interpolate cream #efe3cd -> white #ffffff
  const c0 = [0xef, 0xe3, 0xcd];
  const c1 = [0xff, 0xff, 0xff];
  const k = interpolate(p, [0, 1], [0, 1]);
  const ch = c0.map((v, i) => Math.round(v + (c1[i] - v) * k));
  return `rgb(${ch[0]}, ${ch[1]}, ${ch[2]})`;
}

export const Tile: React.FC<{ t: TileData; colorProgress: number }> = ({
  t,
  colorProgress,
}) => {
  const frame = useCurrentFrame();
  const start = MOVE_BASE + t.delay;
  const p = interpolate(frame, [start, start + MOVE_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // subtle settling tension before the tile's move begins
  const breathe = p < 0.02 ? Math.sin(frame / 10 + t.id) * 1.8 : 0;

  const cx = interpolate(p, [0, 1], [t.sx, t.gx]);
  const cy = interpolate(p, [0, 1], [t.sy + breathe, t.gy]);
  const size = interpolate(p, [0, 1], [t.ssize, t.gsize]);
  const rot = interpolate(p, [0, 1], [t.srot, 0]);
  const radius = size * 0.22;

  // shadow: weighted in the pile, flattening as tiles align
  const depthShadow = 0.16 + t.zback * 0.26;
  const shadow = `0 ${9 + t.zback * 13}px ${20 + t.zback * 18}px -8px rgba(20,40,90,${depthShadow * (1 - p * 0.45)})`;

  const face = faceColor(colorProgress, t.solid, t.color);
  const glyphColor = t.solid ? "#ffffff" : t.color;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: radius,
        background: t.solid
          ? `linear-gradient(155deg, ${face} 0%, ${face} 100%)`
          : `linear-gradient(155deg, #ffffff 0%, ${face} 100%)`,
        border: t.solid
          ? "1px solid rgba(255,255,255,0.35)"
          : "1px solid rgba(255,255,255,0.85)",
        boxShadow: shadow,
        transform: `rotate(${rot}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Glyph type={t.glyph} c={glyphColor} size={size * 0.5} />
    </div>
  );
};
