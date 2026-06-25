import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, radii, shadows, fontFamily } from "../theme";
import { Caption } from "../components/Caption";
import { SoftRing } from "../components/Motion";
import { easeOut, easeInOut, reveal } from "../anim";

// The real Permute "Ideas" suggestions.
const CHIPS = [
  "Add weighted pipeline trend",
  "Collection rate gauge",
  "Export alert digest",
];

export const DBeat3: React.FC<{ rich: boolean }> = ({ rich }) => {
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

  const light = reveal(frame, 6, 14);

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      {/* softened dashboard context */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1380,
          height: 855,
          marginLeft: -690,
          marginTop: -427,
          borderRadius: radii.window,
          boxShadow: shadows.window,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          transform: `scale(${interpolate(frame, [0, 81], [1.02, 1.05], {
            extrapolateRight: "clamp",
          })})`,
        }}
      >
        <Img
          src={staticFile("dash/overview-still.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(8px) saturate(0.9)",
            transform: "scale(1.06)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(244,247,251,0.66)" }} />
      </div>

      {/* Ideas panel — matches the real product UI */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "47%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily,
        }}
      >
        {/* row 1: bulb + Ideas label + first chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: reveal(frame, 4, 12),
              transform: `translateY(${(1 - reveal(frame, 4, 12)) * 8}px)`,
            }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              {rich && <SoftRing size={64} color={colors.idea} opacity={0.16 * light} />}
              <IdeaBulb light={light} />
            </div>
            <span style={{ fontSize: 26, fontWeight: 600, color: colors.inkMuted }}>
              Ideas
            </span>
          </div>
          <IdeaChip label={CHIPS[0]} appear={reveal(frame, 18, 12)} />
        </div>

        {/* row 2: remaining chips */}
        <div style={{ display: "flex", gap: 16, paddingLeft: 4 }}>
          <IdeaChip label={CHIPS[1]} appear={reveal(frame, 28, 12)} />
          <IdeaChip label={CHIPS[2]} appear={reveal(frame, 36, 12)} />
        </div>
      </div>

      <Caption
        lines={["Get ideas to improve the dashboard."]}
        enter={6}
        exitStart={64}
        size={52}
      />
    </AbsoluteFill>
  );
};

const IdeaChip: React.FC<{ label: string; appear: number }> = ({
  label,
  appear,
}) => (
  <div
    style={{
      padding: "14px 24px",
      borderRadius: radii.pill,
      background: "#eceef2",
      border: `1px solid ${colors.border}`,
      fontSize: 21,
      fontWeight: 600,
      color: colors.inkSoft,
      whiteSpace: "nowrap",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 12}px)`,
      boxShadow: "0 6px 18px -10px rgba(20,40,90,0.18)",
    }}
  >
    {label}
  </div>
);

// Thin purple outline bulb, matching the product's Ideas glyph.
const IdeaBulb: React.FC<{ light: number }> = ({ light }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" style={{ overflow: "visible" }}>
    <path
      d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.9 1 .9 1.6v.5h5.2v-.5c0-.6.4-1.2.9-1.6A6 6 0 0 0 12 3z"
      stroke={colors.idea}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.5 + light * 0.5}
    />
  </svg>
);
