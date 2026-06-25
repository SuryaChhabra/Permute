import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fontFamily, radii, shadows } from "../theme";
import { Sphere } from "./Sphere";
import { GridIcon, Chevron } from "./Icons";

// Cinematic backdrop: soft radial light, faint dot grid, drifting blue glow,
// and a gentle vignette. Restrained — it should read premium, not busy.
export const Stage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 30;
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: `radial-gradient(120% 120% at 50% 18%, ${colors.bg1} 0%, ${colors.bg0} 55%, ${colors.bgEdge} 100%)`,
      }}
    >
      {/* dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(58,109,240,0.10) 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
          opacity: 0.5,
          maskImage:
            "radial-gradient(80% 75% at 50% 45%, #000 30%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(80% 75% at 50% 45%, #000 30%, transparent 90%)",
        }}
      />
      {/* drifting glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: `calc(50% - 450px + ${drift}px)`,
          top: -260,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(122,162,255,0.28), rgba(122,162,255,0) 62%)`,
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          right: -180,
          bottom: -260,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(91,134,244,0.16), rgba(91,134,244,0) 60%)`,
        }}
      />
      {children}
      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px rgba(20,40,90,0.16)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// A floating product window with the Permute top chrome, matching the refs.
export const AppWindow: React.FC<{
  width: number;
  height: number;
  workspace?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, workspace = "Marketing Screenshots", children, style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: colors.surface,
        borderRadius: radii.window,
        boxShadow: shadows.window,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <TopBar workspace={workspace} />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

const TopBar: React.FC<{ workspace: string }> = ({ workspace }) => (
  <div
    style={{
      height: 56,
      flex: "0 0 56px",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: 12,
      background: colors.surface,
    }}
  >
    <Sphere size={22} glow={0} />
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <GridIcon size={16} color={colors.inkSoft} />
      <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>
        {workspace}
      </span>
      <Chevron size={15} />
    </div>
    {/* command bar */}
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: 300,
        height: 32,
        borderRadius: radii.pill,
        border: `1px solid ${colors.border}`,
        background: colors.surfaceMuted,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 12px",
      }}
    >
      <Sphere size={14} glow={0} />
      <span style={{ fontSize: 13, color: colors.inkFaint }}>
        Navigate or ask…
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontSize: 11,
          color: colors.inkFaint,
          border: `1px solid ${colors.border}`,
          borderRadius: 5,
          padding: "1px 6px",
        }}
      >
        ⌘ K/P
      </span>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: colors.blueTint,
          color: colors.blueDeep,
          fontSize: 11,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        YO
      </div>
      <span style={{ fontSize: 14, color: colors.inkSoft, fontWeight: 500 }}>
        You
      </span>
      <Chevron size={15} />
    </div>
  </div>
);
