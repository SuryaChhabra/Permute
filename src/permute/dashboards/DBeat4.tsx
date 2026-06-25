import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, fontFamily } from "../theme";
import { Caption } from "../components/Caption";
import { LightSweep, SoftRing, FloatingChip } from "../components/Motion";
import { CheckFilled } from "../components/Icons";
import { DemoScreen } from "./DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

const W = 1420;
const H = 854;

// Highlight callouts over key planner sections (frame-space, inside the screen).
const HILITES = [
  { label: "Cash runway · 18+ mo", x: 0.86, y: 0.12, at: 30 },
  { label: "Projected cash trend", x: 0.6, y: 0.34, at: 40 },
  { label: "Net / month · $921", x: 0.2, y: 0.86, at: 50 },
];

export const DBeat4: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [128, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // Pull back from a close section to the full planner.
  const outerScale = interpolate(frame, [4, 58], [1.16, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const innerZoom = interpolate(frame, [4, 58], [1.18, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const innerX = interpolate(frame, [4, 58], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const innerY = interpolate(frame, [4, 58], [-0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // confirmation glow when the full system lands
  const land = reveal(frame, 56, 18);
  // highlights fade out before the terminal moment
  const hiOut = interpolate(frame, [78, 88], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <DemoScreen
        src="dash/runway.mp4"
        startFrom={90}
        width={W}
        height={H}
        scale={outerScale}
        ty={(1 - enter) * 16}
        innerZoom={innerZoom}
        innerX={innerX}
        innerY={innerY}
      >
        {/* section highlights */}
        {HILITES.map((h, i) => {
          const a = reveal(frame, h.at, 12) * hiOut;
          if (a <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${h.x * 100}%`,
                top: `${h.y * 100}%`,
                transform: `translate(-50%, -50%) scale(${0.92 + a * 0.08})`,
                opacity: a,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 13px",
                borderRadius: radii.pill,
                background: "rgba(255,255,255,0.95)",
                border: `1px solid ${colors.blue}40`,
                boxShadow: "0 8px 22px -10px rgba(20,40,90,0.3)",
                fontFamily,
                fontSize: 14,
                fontWeight: 600,
                color: colors.inkSoft,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{ width: 7, height: 7, borderRadius: "50%", background: colors.blue }}
              />
              {h.label}
              {rich && <SoftRing size={40} opacity={0.18 * a} />}
            </div>
          );
        })}

        {/* Option 2: confirmation glow sweep across the full planner */}
        {rich && (
          <LightSweep
            progress={interpolate(frame, [58, 82], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            color="rgba(31,157,107,0.18)"
            width={30}
          />
        )}
        {land > 0.4 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: `inset 0 0 0 2px rgba(31,157,107,${0.22 * (rich ? 1 : 0.6)})`,
              borderRadius: radii.window,
              opacity: land * (1 - hiOut * 0 + 0),
              pointerEvents: "none",
            }}
          />
        )}
      </DemoScreen>

      {/* terminal moment -> dissolves, dashboard remains */}
      <TerminalMoment frame={frame} rich={rich} />

      <Caption
        lines={["Permute builds the full system."]}
        enter={6}
        exitStart={78}
        size={56}
      />
      <Caption
        lines={["No code needed."]}
        enter={92}
        exitStart={126}
        exitDur={9}
        size={62}
        accentLast
      />
    </AbsoluteFill>
  );
};

const TerminalMoment: React.FC<{ frame: number; rich: boolean }> = ({
  frame,
  rich,
}) => {
  const a = interpolate(frame, [88, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  // cross-out then collapse
  const cross = interpolate(frame, [104, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const collapse = interpolate(frame, [114, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  if (a <= 0 || collapse >= 1) return null;

  const caret = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "relative",
          width: 440,
          background: "#0f1827",
          borderRadius: radii.card,
          boxShadow: "0 30px 70px -25px rgba(8,16,30,0.6)",
          padding: "16px 18px",
          opacity: a * (1 - collapse),
          transform: `translateY(${-120 + (1 - a) * 16}px) scale(${1 - collapse * 0.16})`,
          fontFamily,
        }}
      >
        <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{ width: 11, height: 11, borderRadius: "50%", background: c }}
            />
          ))}
        </div>
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            color: "#dfe7f2",
          }}
        >
          <span style={{ color: "#5b86f4" }}>$</span> build dashboard
          {caret && <span style={{ color: "#8fb0ff" }}>▋</span>}
        </div>
        {/* clean cross-out line */}
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 52,
            height: 2,
            background: colors.orangeSoft,
            transformOrigin: "left center",
            transform: `scaleX(${cross})`,
          }}
        />
        {rich && cross > 0.6 && (
          <div
            style={{
              position: "absolute",
              right: -10,
              top: -10,
            }}
          >
            <CheckFilled size={26} color={colors.green} />
          </div>
        )}
      </div>

      {/* Option 2: a few data chips dissolve toward the dashboard */}
      {rich &&
        collapse > 0 &&
        [0, 1, 2].map((i) => {
          const ang = -0.5 + i * 0.5;
          return (
            <FloatingChip
              key={i}
              label={["metrics", "charts", "layout"][i]}
              appear={1 - collapse}
              tint={colors.blue}
              style={{
                left: `calc(50% + ${ang * 220 * collapse}px)`,
                top: `calc(50% + ${120 * collapse}px)`,
                transform: `translate(-50%,-50%) scale(${1 - collapse * 0.4})`,
                opacity: (1 - collapse) * 0.9,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
