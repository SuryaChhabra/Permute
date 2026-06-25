// Inter is loaded locally (self-hosted via @fontsource in index.css) so renders
// stay fully offline. It's the closest free match to Permute's UI grotesque.
export const fontFamily =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Core palette grounded in the reference clips: near-white surfaces,
// dark-slate text, a vivid product blue, and the classic spreadsheet blue.
export const colors = {
  // Cinematic stage
  bg0: "#eef2f8",
  bg1: "#ffffff",
  bgEdge: "#e3e9f2",

  // Surfaces
  surface: "#ffffff",
  surfaceMuted: "#f7f9fc",
  border: "#e7ebf1",
  borderStrong: "#d8dee7",

  // Text
  ink: "#10182a", // headings / wordmark
  inkSoft: "#3a4456", // body
  inkMuted: "#8b94a6", // secondary / labels
  inkFaint: "#aab2c2",

  // Brand blue
  blue: "#3a6df0",
  blueSoft: "#5b86f4",
  blueDeep: "#2347b8",
  blueGlowA: "#7aa2ff",
  blueGlowB: "#bcd0ff",
  blueTint: "#eef3ff",

  // Spreadsheet
  excelBlue: "#4472c4",
  excelGrid: "#e4e7ec",

  // Semantic
  green: "#1f9d6b",
  greenTint: "#e7f6ef",
  amber: "#d99a23",
  amberTint: "#fbf3df",

  // Soft orange — pipeline alerts & HubSpot source chips only
  orange: "#e0742a",
  orangeSoft: "#ed7d3a",
  orangeDeep: "#b8551a",
  orangeTint: "#fdf0e7",

  // Indigo — the product "Ideas" glyph accent
  idea: "#6d5ae6",
} as const;

export const shadows = {
  window:
    "0 50px 120px -30px rgba(20,40,90,0.35), 0 18px 50px -20px rgba(20,40,90,0.20)",
  card: "0 12px 32px -12px rgba(20,40,90,0.18), 0 2px 8px -2px rgba(20,40,90,0.08)",
  pill: "0 1px 3px rgba(20,40,90,0.10)",
} as const;

export const radii = {
  window: 18,
  card: 12,
  pill: 999,
  chip: 9,
} as const;
