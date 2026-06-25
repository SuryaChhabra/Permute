import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fontFamily } from "../theme";
import { easeOut, easeInOut } from "../anim";

// Cinematic on-screen text. Lines reveal with a staggered mask-slide + blur,
// then the whole block eases away before the cut. Tight tracking, large weight.
export const Caption: React.FC<{
  lines: string[];
  enter: number; // local frame to start revealing
  exitStart: number; // local frame to begin fading out
  exitDur?: number;
  position?: "bottom" | "top" | "center";
  align?: "center" | "left";
  size?: number;
  accentLast?: boolean; // tint the final line in brand blue
}> = ({
  lines,
  enter,
  exitStart,
  exitDur = 14,
  position = "bottom",
  align = "center",
  size = 64,
  accentLast = false,
}) => {
  const frame = useCurrentFrame();

  const groupOut = interpolate(
    frame,
    [exitStart, exitStart + exitDur],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );
  const groupShift = interpolate(
    frame,
    [exitStart, exitStart + exitDur],
    [0, -18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );

  const vpos =
    position === "bottom"
      ? { bottom: 96, top: "auto" as const }
      : position === "top"
        ? { top: 96, bottom: "auto" as const }
        : { top: 0, bottom: 0 };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...vpos,
        display: "flex",
        flexDirection: "column",
        alignItems:
          align === "center"
            ? "center"
            : position === "center"
              ? "flex-start"
              : "flex-start",
        justifyContent: position === "center" ? "center" : undefined,
        paddingLeft: align === "left" ? 120 : 0,
        textAlign: align,
        opacity: groupOut,
        transform: `translateY(${groupShift}px)`,
        fontFamily,
        pointerEvents: "none",
      }}
    >
      {lines.map((line, i) => {
        const start = enter + i * 9;
        const t = interpolate(frame, [start, start + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
        const y = (1 - t) * 26;
        const blur = (1 - t) * 8;
        const isAccent = accentLast && i === lines.length - 1;
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              paddingBottom: 2,
            }}
          >
            <div
              style={{
                fontSize: size,
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: isAccent ? colors.blue : colors.ink,
                transform: `translateY(${y}px)`,
                opacity: t,
                filter: `blur(${blur}px)`,
                textShadow: "0 2px 30px rgba(255,255,255,0.9)",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
