import { GLYPH_TYPES, GlyphType } from "./glyphs";
import { colors } from "../theme";

export type TileData = {
  id: number;
  glyph: GlyphType;
  color: string;
  solid: boolean; // colored face w/ white glyph (accent tile)
  // start (dense pile)
  sx: number;
  sy: number;
  srot: number;
  ssize: number;
  zback: number; // 0 = back, 1 = front (render + shadow order)
  // resolved grid slot (1:1 mapping — every tile keeps its place)
  gx: number;
  gy: number;
  gsize: number;
  delay: number;
};

const W = 1920;

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
  "#3f7fb3",
  colors.inkSoft,
];

// pyramid pile rows (bottom -> top); sums to 60
const PILE_ROWS = [13, 12, 11, 10, 8, 6];
const N = PILE_ROWS.reduce((a, b) => a + b, 0);

// clean resolved grid
const COLS = 10;
const ROWS = 6;
const G_SIZE = 92;
const G_GAP = 26;
const GRID_W = COLS * G_SIZE + (COLS - 1) * G_GAP;
const GRID_H = ROWS * G_SIZE + (ROWS - 1) * G_GAP;
const GRID_X = (W - GRID_W) / 2;
const GRID_Y = 540 - GRID_H / 2;

function build(): TileData[] {
  const rnd = mulberry32(20260626);

  // 1) dense pyramidal pile
  type Start = {
    glyph: GlyphType;
    color: string;
    solid: boolean;
    sx: number;
    sy: number;
    srot: number;
    ssize: number;
    zback: number;
  };
  const starts: Start[] = [];
  const rowCount = PILE_ROWS.length;
  for (let r = 0; r < rowCount; r++) {
    const count = PILE_ROWS[r];
    const rowWidth = 1540 - (r / (rowCount - 1)) * 1140; // wide at base, narrow on top
    const baseY = 902 - r * 120; // stack upward, heavy overlap
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const x = 960 - rowWidth / 2 + t * rowWidth + (rnd() - 0.5) * 46;
      const y = baseY + (rnd() - 0.5) * 40;
      starts.push({
        glyph: GLYPH_TYPES[Math.floor(rnd() * GLYPH_TYPES.length)],
        color: PALETTE[Math.floor(rnd() * PALETTE.length)],
        solid: rnd() < 0.16,
        sx: x,
        sy: y,
        srot: (rnd() - 0.5) * 26,
        ssize: 104 + (rnd() - 0.5) * 18,
        zback: r / rowCount + (rnd() - 0.5) * 0.08,
      });
    }
  }

  // 2) map each pile tile to a grid cell, left pile -> left columns, so the
  //    pile "combs" directly into the grid without crossing
  const byX = [...starts].sort((a, b) => a.sx - b.sx);
  const tiles: TileData[] = [];
  for (let col = 0; col < COLS; col++) {
    const colTiles = byX.slice(col * ROWS, col * ROWS + ROWS).sort((a, b) => a.sy - b.sy);
    colTiles.forEach((st, row) => {
      tiles.push({
        id: tiles.length,
        glyph: st.glyph,
        color: st.color,
        solid: st.solid,
        sx: st.sx,
        sy: st.sy,
        srot: st.srot,
        ssize: st.ssize,
        zback: st.zback,
        gx: GRID_X + col * (G_SIZE + G_GAP) + G_SIZE / 2,
        gy: GRID_Y + row * (G_SIZE + G_GAP) + G_SIZE / 2,
        gsize: G_SIZE,
        delay: col * 6 + row, // left-to-right comb wave
      });
    });
  }
  return tiles.sort((a, b) => a.id - b.id);
}

export const TILES: TileData[] = build();
export const TILE_COUNT = N;
export const GRID_GEO = { GRID_X, GRID_Y, GRID_W, GRID_H };
