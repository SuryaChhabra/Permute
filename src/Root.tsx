import "./index.css";
import { Composition } from "remotion";
import { BrandFilm, DURATION } from "./permute/BrandFilm";

// Permute — 15-second B2B SaaS brand film.
// Render with: npx remotion render PermuteBrandFilm out/permute.mp4
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
    </>
  );
};
