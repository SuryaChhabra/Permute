import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Caption } from "../components/Caption";
import { LightSweep, SoftRing, FloatingChip } from "../components/Motion";
import { DemoScreen } from "./DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

const W = 1380;
const H = 855;

export const DBeat1: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 60], [1.0, 1.05], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [54, 66], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <DemoScreen
        src="dash/overview.mp4"
        startFrom={190}
        width={W}
        height={H}
        scale={scale}
        ty={(1 - enter) * 20}
      >
        {rich && (
          <LightSweep
            progress={reveal(frame, 14, 22)}
            color="rgba(122,162,255,0.18)"
            width={30}
          />
        )}
      </DemoScreen>

      {/* Option 2: a couple of quiet supporting accents in negative space */}
      {rich && (
        <>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-640px, -360px)",
            }}
          >
            <SoftRing size={140} opacity={0.1} />
          </div>
          <FloatingChip
            label="Revenue"
            appear={reveal(frame, 22, 12)}
            tint={colors.blue}
            style={{ left: "calc(50% + 560px)", top: "calc(50% - 300px)" }}
          />
          <FloatingChip
            label="Pipeline"
            appear={reveal(frame, 30, 12)}
            tint={colors.green}
            style={{ left: "calc(50% + 560px)", top: "calc(50% - 250px)" }}
          />
        </>
      )}

      <Caption lines={["Dashboards."]} enter={6} exitStart={50} size={70} />
    </AbsoluteFill>
  );
};
