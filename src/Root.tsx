import "./index.css";
import { Composition } from "remotion";
import { BrandFilm, DURATION } from "./permute/BrandFilm";
import { ReportsFilm, REPORTS_DURATION } from "./permute/reports/ReportsFilm";

// Permute B2B SaaS film series.
//   PermuteBrandFilm        — Tables (15s)
//   PermuteReportsOption1   — Reports, restrained  (12s)
//   PermuteReportsOption2   — Reports, richer motion (12s)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PermuteBrandFilm"
        component={BrandFilm}
        durationInFrames={DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PermuteReportsOption1"
        component={ReportsFilm}
        durationInFrames={REPORTS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ rich: false }}
      />
      <Composition
        id="PermuteReportsOption2"
        component={ReportsFilm}
        durationInFrames={REPORTS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ rich: true }}
      />
    </>
  );
};
