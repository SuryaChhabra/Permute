import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { LightSweep } from "../components/Motion";
import { DemoScreen } from "../dashboards/DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

export const RBeat1Reports: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [54, 66], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // brief report-definition pre-roll, then the live run history
  const specOut = interpolate(frame, [16, 26], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const runIn = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const runScale = interpolate(frame, [18, 66], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {specOut > 0 && (
        <DemoScreen
          src="reports/spec_pipeline.mp4"
          startFrom={6}
          width={1240}
          height={787}
          opacity={specOut}
          scale={1 - (1 - specOut) * 0.03}
        />
      )}

      {runIn > 0 && (
        <DemoScreen
          src="reports/runhistory_summary.mp4"
          startFrom={10}
          width={1300}
          height={821}
          opacity={runIn}
          scale={runScale}
          ty={(1 - runIn) * 16}
        >
          {rich && (
            <LightSweep
              progress={reveal(frame, 30, 22)}
              color="rgba(122,162,255,0.16)"
              width={30}
            />
          )}
        </DemoScreen>
      )}

      <Caption
        lines={["Reports that keep running."]}
        enter={6}
        exitStart={52}
        size={64}
      />
    </AbsoluteFill>
  );
};
