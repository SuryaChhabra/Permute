import React from "react";
import { Sequence, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "./components/Stage";
import { Sphere } from "./components/Sphere";
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
      <Watermark />
    </Stage>
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
