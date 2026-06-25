import React from "react";
import { OffthreadVideo, staticFile } from "remotion";
import { colors, radii, shadows } from "../theme";

// Presents real Permute demo footage inside a clean floating window frame,
// matching the Tables film's device look. Camera moves (push-in / pull-back)
// are applied to the outer frame; an optional inner zoom focuses a region.
export const DemoScreen: React.FC<{
  src: string;
  startFrom?: number;
  width: number;
  height: number;
  // outer camera
  scale?: number;
  tx?: number;
  ty?: number;
  // inner focus (zoom into a region of the footage)
  innerZoom?: number;
  innerX?: number; // -1..1 horizontal bias
  innerY?: number; // -1..1 vertical bias
  opacity?: number;
  children?: React.ReactNode; // overlays in frame space
}> = ({
  src,
  startFrom = 0,
  width,
  height,
  scale = 1,
  tx = 0,
  ty = 0,
  innerZoom = 1,
  innerX = 0,
  innerY = 0,
  opacity = 1,
  children,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        borderRadius: radii.window,
        boxShadow: shadows.window,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        background: colors.surface,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${innerZoom}) translate(${innerX * 12}%, ${innerY * 12}%)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={startFrom}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {children}
    </div>
  );
};
