import React from "react";
import { Sequence } from "remotion";
import { Stage } from "../components/Stage";
import { CutFX, Watermark } from "../components/FilmFX";
import { RBeat1Reports } from "./RBeat1Reports";
import { RBeat2Schedule } from "./RBeat2Schedule";
import { RBeat3Alerts } from "./RBeat3Alerts";
import { RBeat4Packaged } from "./RBeat4Packaged";

export const REPORTS_DURATION = 360; // 12s @ 30fps

// Both Reports options share layout, pacing, and typography with the Tables
// film. `rich` is the only switch: false = Option 1 (restrained, like Tables
// Option 1), true = Option 2 (the same extra motion-design layer as Tables
// Option 2 — cross-cut FX, rings, chips, light sweeps).
const BEATS: { from: number; dur: number; Comp: React.FC<{ rich: boolean }> }[] = [
  { from: 0, dur: 66, Comp: RBeat1Reports },
  { from: 60, dur: 81, Comp: RBeat2Schedule },
  { from: 135, dur: 96, Comp: RBeat3Alerts },
  { from: 225, dur: 135, Comp: RBeat4Packaged },
];

export const ReportsFilm: React.FC<{ rich?: boolean }> = ({ rich = false }) => {
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
          <CutFX center={138} />
          <CutFX center={228} />
        </>
      )}
      <Watermark />
    </Stage>
  );
};
