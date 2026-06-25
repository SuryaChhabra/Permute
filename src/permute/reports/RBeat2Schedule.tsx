import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Caption } from "../components/Caption";
import { LightSweep, FloatingChip } from "../components/Motion";
import { DemoScreen } from "../dashboards/DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

export const RBeat2Schedule: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [70, 81], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // calm push toward the schedule controls
  const scale = interpolate(frame, [0, 78], [1.0, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <DemoScreen
        src="reports/scheduling.mp4"
        startFrom={8}
        width={1480}
        height={695}
        scale={scale}
        ty={(1 - enter) * 18}
      >
        {rich && (
          <>
            <LightSweep
              progress={reveal(frame, 16, 22)}
              color="rgba(122,162,255,0.16)"
              width={28}
            />
            <FloatingChip
              label="Recurring weekly"
              appear={reveal(frame, 40, 14)}
              tint={colors.blue}
              style={{ right: 24, top: 22, left: "auto" }}
            />
          </>
        )}
      </DemoScreen>

      <Caption
        lines={["Weekly updates", "without weekly setup."]}
        enter={6}
        exitStart={64}
        size={60}
      />
    </AbsoluteFill>
  );
};
