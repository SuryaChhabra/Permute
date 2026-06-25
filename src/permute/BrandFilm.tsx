import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Stage } from "./components/Stage";
import { Sphere } from "./components/Sphere";
import { GlowNode, LightSweep } from "./components/Motion";
import { colors } from "./theme";
import { Beat1Describe } from "./beats/Beat1Describe";
import { Beat2Table } from "./beats/Beat2Table";
import { Beat3Thinking } from "./beats/Beat3Thinking";
import { Beat4Lifecycle } from "./beats/Beat4Lifecycle";
import { easeOut } from "./anim";

export const DURATION = 450; // 15s @ 30fps

// Beats overlap slightly so each beat's own enter/exit opacity cross-dissolves.
const BEATS: {
  from: number;
  dur: number;
  Comp: React.FC;
}[] = [
  { from: 0, dur: 96, Comp: Beat1Describe },
  { from: 90, dur: 78, Comp: Beat2Table },
  { from: 162, dur: 96, Comp: Beat3Thinking },
  { from: 252, dur: 198, Comp: Beat4Lifecycle },
];

export const BrandFilm: React.FC = () => {
  return (
    <Stage>
      {BEATS.map(({ from, dur, Comp }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} name={`Beat ${i + 1}`}>
          <Comp />
        </Sequence>
      ))}
      {/* connector motion carried across each cut */}
      <CutFX center={93} />
      <CutFX center={165} />
      <CutFX center={255} />
      <Watermark />
    </Stage>
  );
};

// Restrained cross-cut transition: a glow node travels across screen center
// along a faint connector line, a soft ring expands (circular reveal), and a
// gentle light band wipes the frame. Active only in a short window per cut.
const CutFX: React.FC<{ center: number }> = ({ center }) => {
  const frame = useCurrentFrame();
  const span = 16;
  if (frame < center - span || frame > center + span) return null;

  const t = (frame - (center - span)) / (span * 2); // 0..1
  const W = 1920;
  const H = 1080;
  const y = H / 2;

  const lineT = interpolate(t, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineOut = interpolate(t, [0.6, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringScale = interpolate(t, [0, 1], [0.2, 1.25]);
  const ringOpacity = interpolate(t, [0, 0.25, 1], [0, 0.32, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* expanding soft ring — circular reveal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1300,
          height: 1300,
          marginLeft: -650,
          marginTop: -650,
          borderRadius: "50%",
          border: `1.5px solid ${colors.blue}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />
      {/* faint connector line + travelling node */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={W * 0.18}
          y1={y}
          x2={W * 0.18 + (W * 0.64) * lineT}
          y2={y}
          stroke={colors.blue}
          strokeWidth={1.4}
          opacity={0.32 * lineOut}
        />
      </svg>
      <GlowNode
        x={W * 0.18 + W * 0.64 * lineT}
        y={y}
        size={12}
        color={colors.blueSoft}
        opacity={lineOut}
      />
      {/* soft light wipe */}
      <LightSweep progress={t} color="rgba(122,162,255,0.22)" width={34} />
    </AbsoluteFill>
  );
};

// Quiet persistent brand lockup, top-left — reinforces the film without clutter.
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [10, 28], [0, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 46,
        left: 56,
        display: "flex",
        alignItems: "center",
        gap: 11,
        opacity: a,
      }}
    >
      <Sphere size={26} glow={0.5} />
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: colors.ink,
        }}
      >
        Permute
      </span>
    </div>
  );
};
