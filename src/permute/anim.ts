import { Easing, interpolate } from "remotion";

// Premium, restrained easing curves used across the film.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOutSoft = Easing.bezier(0.22, 1, 0.36, 1);

type Opts = {
  easing?: (n: number) => number;
};

// Local fade/slide-in: 0 -> 1 over [start, start+dur].
export const reveal = (
  frame: number,
  start: number,
  dur: number,
  opts: Opts = {},
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: opts.easing ?? easeOut,
  });

// Window/fade that comes in and goes out, for beat transitions.
export const inOut = (
  frame: number,
  enterStart: number,
  enterDur: number,
  exitStart: number,
  exitDur: number,
) => {
  const a = reveal(frame, enterStart, enterDur);
  const b = 1 - reveal(frame, exitStart, exitDur, { easing: easeInOut });
  return Math.min(a, b);
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
