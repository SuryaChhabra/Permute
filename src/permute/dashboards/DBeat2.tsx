import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii } from "../theme";
import { Caption } from "../components/Caption";
import { ConfirmRing, LightSweep } from "../components/Motion";
import { DemoScreen } from "./DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

const W = 1380;
const H = 864;

export const DBeat2: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [84, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // single, calm push toward the theme gallery
  const scale = interpolate(frame, [0, 90], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // selection highlight on the chosen theme card (bottom-right of the gallery)
  const selIn = reveal(frame, 46, 14);
  const selPulse = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <DemoScreen
        src="dash/themes.mp4"
        startFrom={10}
        width={W}
        height={H}
        scale={scale}
        ty={(1 - enter) * 18}
      >
        {rich && (
          <LightSweep
            progress={reveal(frame, 18, 22)}
            color="rgba(122,162,255,0.16)"
            width={28}
          />
        )}

        {/* clean selection highlight on a theme card */}
        <div
          style={{
            position: "absolute",
            left: "65.5%",
            top: "56%",
            width: "30%",
            height: "33%",
            borderRadius: 14,
            border: `2px solid ${colors.blue}`,
            boxShadow: `0 0 0 4px rgba(58,109,240,0.12)`,
            opacity: selIn * (rich ? 1 : 0.8),
          }}
        >
          {rich && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
              }}
            >
              <ConfirmRing progress={selPulse} color={colors.blue} size={120} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: -13,
              right: 12,
              background: colors.blue,
              color: "#fff",
              fontSize: 12.5,
              fontWeight: 700,
              borderRadius: radii.pill,
              padding: "3px 11px",
              boxShadow: "0 4px 12px -4px rgba(20,40,90,0.4)",
            }}
          >
            Selected
          </div>
        </div>
      </DemoScreen>

      <Caption
        lines={["Ask for the view.", "Choose a theme, customize it, or edit after."]}
        enter={6}
        exitStart={80}
        size={46}
      />
    </AbsoluteFill>
  );
};
