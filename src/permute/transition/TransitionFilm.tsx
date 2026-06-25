import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage, AppWindow } from "../components/Stage";
import { Sphere } from "../components/Sphere";
import { Watermark } from "../components/FilmFX";
import { LightSweep } from "../components/Motion";
import { colors } from "../theme";
import { easeOut, easeInOut } from "../anim";
import { TILES } from "./tiles";
import { Tile } from "./Tile";

export const TRANSITION_DURATION = 150; // 5s @ 30fps

// back-to-front render order so the pile layers correctly
const ORDERED = [...TILES].sort((a, b) => a.sdepth - b.sdepth);

export const TransitionFilm: React.FC = () => {
  const frame = useCurrentFrame();

  // camera: gentle push-in, then settle back as the window reveals
  const camScale =
    interpolate(frame, [0, 115], [1.0, 1.04], {
      extrapolateRight: "clamp",
      easing: easeOut,
    }) -
    interpolate(frame, [124, 150], [0, 0.04], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    });

  // warm "office" wash fades to reveal the clean Stage world
  const warm = interpolate(frame, [26, 108], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // laptop echo from the problem scene, fades early
  const laptop = interpolate(frame, [0, 14, 54, 82], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // tiles consolidate, then the layer clears as the window forms
  const tilesOut = interpolate(frame, [120, 143], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  return (
    <Stage>
      {/* warm office wash over the clean Stage bg */}
      <AbsoluteFill
        style={{
          opacity: warm,
          background:
            "linear-gradient(180deg, #d8e9f8 0%, #eaf2fb 36%, #f4ead8 60%, #e4cfac 100%)",
        }}
      />

      {/* scene (tiles + laptop) under a single gentle camera */}
      <AbsoluteFill
        style={{
          transform: `scale(${camScale})`,
          transformOrigin: "50% 46%",
          opacity: tilesOut,
        }}
      >
        <Laptop opacity={laptop} />
        {ORDERED.map((t) => (
          <Tile key={t.id} t={t} />
        ))}
      </AbsoluteFill>

      {/* final state: the systems unify into the Permute window */}
      <WindowReveal frame={frame} />

      {/* persistent brand lockup matching the demo clips */}
      <div style={{ opacity: interpolate(frame, [120, 144], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Watermark />
      </div>
    </Stage>
  );
};

const Laptop: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0) return null;
  return (
    <div style={{ opacity }}>
      {/* closed silver laptop slab, echoing the reference */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 712,
          width: 760,
          height: 348,
          marginLeft: -380,
          borderRadius: 26,
          background:
            "linear-gradient(170deg, #e3e7ee 0%, #c7cedb 48%, #aab2c2 100%)",
          boxShadow: "0 40px 90px -30px rgba(20,40,90,0.45)",
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 26,
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 40%)",
          }}
        />
      </div>
    </div>
  );
};

const WindowReveal: React.FC<{ frame: number }> = ({ frame }) => {
  const a = interpolate(frame, [124, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (a <= 0) return null;
  const scale = interpolate(a, [0, 1], [0.93, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: a, transform: `scale(${scale})` }}>
        <AppWindow width={1240} height={700} workspace="Permute">
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <Sphere size={92} glow={1} />
            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: colors.ink,
              }}
            >
              Permute
            </div>
            <div style={{ fontSize: 20, color: colors.inkMuted, fontWeight: 500 }}>
              One unified system
            </div>
            <LightSweep
              progress={interpolate(frame, [138, 150], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              color="rgba(122,162,255,0.18)"
              width={28}
            />
          </AbsoluteFill>
        </AppWindow>
      </div>
    </AbsoluteFill>
  );
};
