import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii } from "../theme";
import { Caption } from "../components/Caption";
import { ConfirmRing, LightSweep, FloatingChip } from "../components/Motion";
import { DemoScreen } from "./DemoScreen";
import { easeOut, easeInOut, reveal } from "../anim";

const OVR_W = 1380;
const OVR_H = 855;
const CON_W = 980;
const CON_H = 849;

const THEMES = [
  { name: "Default", swatch: "#1f2733" },
  { name: "Ocean", swatch: "#3a6df0" },
  { name: "Slate", swatch: "#475569" },
  { name: "Minimal", swatch: "#cbd5e1" },
];

export const DBeat2: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [84, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // Sub-cut: connector modal cutaway -> themed dashboard.
  const conOut = interpolate(frame, [22, 32], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const ovrIn = interpolate(frame, [24, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // gentle push toward the theme selector (lower area)
  const ovrScale = interpolate(frame, [30, 96], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // theme tint envelopes (subtle, blue/neutral only)
  const ocean = interpolate(frame, [40, 48, 60, 68], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slate = interpolate(frame, [66, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const selected = frame < 40 ? 0 : frame < 66 ? 1 : 2;

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {/* connector cutaway */}
      {conOut > 0 && (
        <DemoScreen
          src="dash/connectors.mp4"
          startFrom={14}
          width={CON_W}
          height={CON_H}
          opacity={conOut}
          scale={1 + (1 - conOut) * 0.03}
        />
      )}

      {/* themed dashboard */}
      {ovrIn > 0 && (
        <DemoScreen
          src="dash/overview.mp4"
          startFrom={40}
          width={OVR_W}
          height={OVR_H}
          opacity={ovrIn}
          scale={ovrScale}
          ty={interpolate(frame, [30, 96], [0, -14], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {/* tasteful theme tints */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, rgba(58,109,240,0.16), rgba(36,71,184,0.10))`,
              mixBlendMode: "multiply",
              opacity: ocean * 0.9,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, rgba(71,85,105,0.20), rgba(15,24,42,0.14))`,
              mixBlendMode: "multiply",
              opacity: slate * 0.9,
              pointerEvents: "none",
            }}
          />

          {rich && (
            <LightSweep
              progress={interpolate(frame, [40, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              color="rgba(122,162,255,0.22)"
              width={28}
            />
          )}

          {/* theme selector strip (top, clear of the caption) */}
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: radii.card,
              background: "rgba(255,255,255,0.94)",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 12px 30px -14px rgba(20,40,90,0.28)",
              opacity: reveal(frame, 36, 12),
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: colors.inkMuted,
                letterSpacing: "0.04em",
              }}
            >
              THEME
            </span>
            {THEMES.map((t, i) => (
              <div
                key={t.name}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${i === selected ? colors.blue : colors.border}`,
                  background: i === selected ? colors.blueTint : "#fff",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: t.swatch,
                  }}
                />
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: i === selected ? colors.blueDeep : colors.inkSoft,
                  }}
                >
                  {t.name}
                </span>
                {rich && i === selected && (
                  <ConfirmRing
                    progress={interpolate(
                      frame,
                      [selected === 0 ? 36 : selected === 1 ? 42 : 68, selected === 0 ? 58 : selected === 1 ? 64 : 90],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )}
                    color={colors.blue}
                    size={54}
                  />
                )}
              </div>
            ))}
            <span
              style={{
                marginLeft: 6,
                fontSize: 13,
                color: colors.inkMuted,
                fontWeight: 600,
              }}
            >
              · Customize · Edit after
            </span>
          </div>

          {rich && (
            <FloatingChip
              label="Editable layout"
              appear={reveal(frame, 56, 12)}
              tint={colors.blue}
              style={{ right: 26, top: 24, left: "auto" }}
            />
          )}
        </DemoScreen>
      )}

      <Caption
        lines={["Ask for the view.", "Choose a theme, customize it, or edit after."]}
        enter={6}
        exitStart={80}
        size={46}
      />
    </AbsoluteFill>
  );
};
