import { GLYPH_TYPES, GlyphType } from "./glyphs";
import { colors } from "../theme";

export type TileData = {
  id: number;
  glyph: GlyphType;
  color: string;
  // start (messy pile)
  sx: number;
  sy: number;
  srot: number;
  sscale: number;
  sdepth: number; // 0 = far/back, 1 = near/front
  // resolution
  kept: boolean;
  gx: number;
  gy: number;
  gsize: number;
  delay: number; // stagger frames
};

const W = 1920;
const H = 1080;

// deterministic PRNG so the layout is identical every frame / render
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = [
  colors.blue,
  colors.blue,
  colors.blueDeep,
  colors.green,
  colors.orange,
  colors.idea,
  "#3f7fb3", // muted teal-blue
  colors.inkSoft,
];

const N = 88;
const KEPT = 24;
const GRID_COLS = 6;
const GRID_ROWS = 4;

// clean grid geometry
const G_SIZE = 104;
const G_GAP = 46;
const GRID_W = GRID_COLS * G_SIZE + (GRID_COLS - 1) * G_GAP;
const GRID_H = GRID_ROWS * G_SIZE + (GRID_ROWS - 1) * G_GAP;
const GRID_X = (W - GRID_W) / 2;
const GRID_Y = 470 - GRID_H / 2;

function pileTopY(x: number) {
  const n = (x - W / 2) / (W / 2); // -1..1
  return 96 + 560 * n * n; // parabola: low (peak) at center
}

function build(): TileData[] {
  const rnd = mulberry32(20260625);
  const tiles: Omit<TileData, "kept" | "gx" | "gy" | "gsize" | "delay">[] = [];

  for (let i = 0; i < N; i++) {
    const x = 40 + rnd() * (W - 80);
    const top = pileTopY(x);
    const r = Math.pow(rnd(), 0.72);
    const y = top + r * (H - 70 - top);
    const depth = 0.25 + (y / H) * 0.75 + (rnd() - 0.5) * 0.15; // lower = nearer
    tiles.push({
      id: i,
      glyph: GLYPH_TYPES[Math.floor(rnd() * GLYPH_TYPES.length)] as GlyphType,
      color: PALETTE[Math.floor(rnd() * PALETTE.length)],
      sx: x,
      sy: y,
      srot: (rnd() - 0.5) * 26,
      sscale: 0.7 + depth * 0.55,
      sdepth: Math.max(0, Math.min(1, depth)),
    });
  }

  // choose kept tiles spread across the pile (every ~Nth by index)
  const keptIds = new Set<number>();
  const step = N / KEPT;
  for (let k = 0; k < KEPT; k++) keptIds.add(Math.floor(k * step));

  // assign grid cells to kept tiles, ordered by start x so they don't cross
  const keptList = tiles
    .filter((t) => keptIds.has(t.id))
    .sort((a, b) => a.sx - b.sx);

  const gridCellOf: Record<number, { gx: number; gy: number }> = {};
  // fill grid column-major-ish by sorting kept by x, then placing row by row
  const sortedForGrid = [...keptList].sort(
    (a, b) => a.sy * 0.45 + a.sx * 0.55 - (b.sy * 0.45 + b.sx * 0.55),
  );
  sortedForGrid.forEach((t, idx) => {
    const col = idx % GRID_COLS;
    const row = Math.floor(idx / GRID_COLS);
    gridCellOf[t.id] = {
      gx: GRID_X + col * (G_SIZE + G_GAP),
      gy: GRID_Y + row * (G_SIZE + G_GAP),
    };
  });

  return tiles.map((t) => {
    const kept = keptIds.has(t.id);
    const cell = gridCellOf[t.id];
    return {
      ...t,
      kept,
      gx: cell ? cell.gx : t.sx,
      gy: cell ? cell.gy : t.sy,
      gsize: G_SIZE,
      // left tiles resolve first; non-kept slightly later as they recede
      delay: Math.round((t.sx / W) * 26 + (kept ? 0 : 8) + (1 - t.sdepth) * 6),
    };
  });
}

export const TILES: TileData[] = build();
export const GRID_GEO = { GRID_X, GRID_Y, GRID_W, GRID_H, G_SIZE };
