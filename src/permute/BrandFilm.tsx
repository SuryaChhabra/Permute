import React from "react";
import { Sequence } from "remotion";
import { Stage } from "./components/Stage";
import { CutFX, Watermark } from "./components/FilmFX";
import { Beat1Describe } from "./beats/Beat1Describe";
import { Beat2Table } from "./beats/Beat2Table";
import { Beat3Thinking } from "./beats/Beat3Thinking";
import { Beat4Lifecycle } from "./beats/Beat4Lifecycle";

export const DURATION = 450; // 15s @ 30fps

// Beats overlap slightly so each beat's own enter/exit opacity cross-dissolves.
const BEATS: {
  from: number;
  dur: number;
  Comp: React.FC;
}[] = [
  { from: 0, dur: 96, Comp: Beat1Describe },
  { from: 90, dur: 78, Comp: Beat2Table },
  { from: 162, dur: 96, Comp: Beat3Thinking },
  { from: 252, dur: 198, Comp: Beat4Lifecycle },
];

export const BrandFilm: React.FC = () => {
  return (
    <Stage>
      {BEATS.map(({ from, dur, Comp }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} name={`Beat ${i + 1}`}>
          <Comp />
        </Sequence>
      ))}
      {/* connector motion carried across each cut */}
      <CutFX center={93} />
      <CutFX center={165} />
      <CutFX center={255} />
      <Watermark />
    </Stage>
  );
};
