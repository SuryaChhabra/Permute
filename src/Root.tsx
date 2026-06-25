import "./index.css";
import { Composition } from "remotion";
import { BrandFilm, DURATION } from "./permute/BrandFilm";
import { ReportsFilm, REPORTS_DURATION } from "./permute/reports/ReportsFilm";
import {
  DashboardsFilm,
  DASHBOARDS_DURATION,
} from "./permute/dashboards/DashboardsFilm";
import {
  TransitionFilm,
  TRANSITION_DURATION,
} from "./permute/transition/TransitionFilm";

// Permute B2B SaaS film series.
//   PermuteBrandFilm          — Tables (15s)
//   PermuteReportsOption1/2    — Reports (12s)
//   PermuteDashboardsOption1/2 — Dashboards (12s, built on real demo footage)
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
      <Composition
        id="PermuteDashboardsOption1"
        component={DashboardsFilm}
        durationInFrames={DASHBOARDS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ rich: false }}
      />
      <Composition
        id="PermuteDashboardsOption2"
        component={DashboardsFilm}
        durationInFrames={DASHBOARDS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ rich: true }}
      />
      <Composition
        id="PermuteTransition"
        component={TransitionFilm}
        durationInFrames={TRANSITION_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
