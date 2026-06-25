import React from "react";
import { Sequence } from "remotion";
import { Stage } from "../components/Stage";
import { CutFX, Watermark } from "../components/FilmFX";
import { DBeat1 } from "./DBeat1";
import { DBeat2 } from "./DBeat2";
import { DBeat3 } from "./DBeat3";
import { DBeat4 } from "./DBeat4";

export const DASHBOARDS_DURATION = 360; // 12s @ 30fps

// Both Dashboards options share layout, pacing, and typography with the Tables
// and Reports films, and are built around the real Permute demo footage
// (overview, connectors, cash-runway). `rich` is the only switch:
// false = Option 1 (restrained), true = Option 2 (the same extra motion layer
// as Tables Option 2).
const BEATS: { from: number; dur: number; Comp: React.FC<{ rich: boolean }> }[] = [
  { from: 0, dur: 66, Comp: DBeat1 },
  { from: 60, dur: 96, Comp: DBeat2 },
  { from: 150, dur: 81, Comp: DBeat3 },
  { from: 225, dur: 135, Comp: DBeat4 },
];

export const DashboardsFilm: React.FC<{ rich?: boolean }> = ({ rich = false }) => {
  return (
    <Stage>
      {BEATS.map(({ from, dur, Comp }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} name={`Beat ${i + 1}`}>
          <Comp rich={rich} />
        </Sequence>
      ))}
      {rich && (
        <>
          <CutFX center={63} />
          <CutFX center={153} />
          <CutFX center={228} />
        </>
      )}
      <Watermark />
    </Stage>
  );
};
