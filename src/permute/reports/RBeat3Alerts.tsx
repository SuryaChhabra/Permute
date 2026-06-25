import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Caption } from "../components/Caption";
import { LightSweep, FloatingChip } from "../components/Motion";
import { DemoScreen } from "../dashboards/DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

export const RBeat3Alerts: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [86, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // brief alert-rules pre-roll, then the live alerts
  const specOut = interpolate(frame, [18, 28], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const alertsIn = interpolate(frame, [20, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const alertsScale = interpolate(frame, [20, 96], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {specOut > 0 && (
        <DemoScreen
          src="reports/spec_alert.mp4"
          startFrom={6}
          width={1240}
          height={787}
          opacity={specOut}
          scale={1 - (1 - specOut) * 0.03}
        />
      )}

      {alertsIn > 0 && (
        <DemoScreen
          src="reports/runhistory_alerts.mp4"
          startFrom={8}
          width={1300}
          height={821}
          opacity={alertsIn}
          scale={alertsScale}
          ty={(1 - alertsIn) * 16}
        >
          {rich && (
            <>
              <LightSweep
                progress={reveal(frame, 34, 22)}
                color="rgba(224,116,42,0.14)"
                width={28}
              />
              <FloatingChip
                label="Follow-up needed"
                appear={reveal(frame, 56, 14)}
                tint={colors.orange}
                style={{ right: 24, top: 22, left: "auto" }}
              />
            </>
          )}
        </DemoScreen>
      )}

      <Caption
        lines={["Pipeline alerts", "when deals move, stall, or slip."]}
        enter={6}
        exitStart={80}
        size={56}
      />
    </AbsoluteFill>
  );
};
