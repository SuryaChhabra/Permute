import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows, fontFamily } from "../theme";
import { Caption } from "../components/Caption";
import { CheckFilled } from "../components/Icons";
import { LightSweep, ConfirmRing } from "../components/Motion";
import { DemoScreen } from "../dashboards/DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

export const RBeat4Packaged: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [126, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // gentle settle (footage already scrolls, so keep camera quiet)
  const scale = interpolate(frame, [0, 120], [1.03, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const sent = reveal(frame, 78, 14);
  const sentPulse = rich
    ? interpolate(frame, [80, 104], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <DemoScreen
        src="reports/excel.mp4"
        startFrom={0}
        playbackRate={0.45}
        width={1500}
        height={736}
        scale={scale}
        ty={(1 - enter) * 16}
      >
        {rich && (
          <LightSweep
            progress={reveal(frame, 86, 24)}
            color="rgba(122,162,255,0.16)"
            width={28}
          />
        )}
      </DemoScreen>

      {/* delivered / sent confirmation above the sheet */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 116,
          transform: `translateX(-50%) translateY(${(1 - sent) * 12}px)`,
          opacity: sent,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#fff",
          border: `1px solid ${colors.green}33`,
          boxShadow: shadows.card,
          borderRadius: radii.pill,
          padding: "10px 20px",
          fontFamily,
        }}
      >
        <div style={{ position: "relative", display: "flex" }}>
          <CheckFilled size={22} />
          {sentPulse > 0 && (
            <ConfirmRing progress={sentPulse} color={colors.green} size={48} />
          )}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: colors.ink }}>
          Report delivered to team
        </span>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: colors.green,
            background: colors.greenTint,
            borderRadius: radii.pill,
            padding: "3px 11px",
          }}
        >
          Sent
        </span>
      </div>

      <Caption
        lines={[
          "Cash flow, pipeline movement, sales activity —",
          "already packaged, already sent.",
        ]}
        enter={8}
        exitStart={118}
        exitDur={10}
        size={48}
        accentLast
      />
    </AbsoluteFill>
  );
};
