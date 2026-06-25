import React from "react";

// A compact set of clean business-system glyphs for the reorganizing tiles.
// Drawn on a 24x24 grid; `c` is the accent color.
export type GlyphType =
  | "database"
  | "mail"
  | "pie"
  | "bars"
  | "line"
  | "people"
  | "person"
  | "clock"
  | "doc"
  | "lock"
  | "link"
  | "bell"
  | "card"
  | "table"
  | "check"
  | "cloud";

export const GLYPH_TYPES: GlyphType[] = [
  "database", "mail", "pie", "bars", "line", "people", "person", "clock",
  "doc", "lock", "link", "bell", "card", "table", "check", "cloud",
];

export const Glyph: React.FC<{ type: GlyphType; c: string; size: number }> = ({
  type,
  c,
  size,
}) => {
  const s = { stroke: c, strokeWidth: 1.7, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {type === "database" && (
        <>
          <ellipse cx="12" cy="6" rx="7" ry="2.6" fill={c} />
          <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" {...s} />
          <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" {...s} />
        </>
      )}
      {type === "mail" && (
        <>
          <rect x="3.5" y="6" width="17" height="12" rx="2.5" {...s} />
          <path d="M4 7l8 6 8-6" {...s} />
        </>
      )}
      {type === "pie" && (
        <>
          <path d="M12 3a9 9 0 1 0 9 9h-9z" fill={c} />
          <path d="M12 3v9h9" stroke="#fff" strokeWidth="1.4" fill="none" />
        </>
      )}
      {type === "bars" && (
        <>
          <rect x="4" y="12" width="3.4" height="8" rx="1" fill={c} />
          <rect x="10.3" y="7" width="3.4" height="13" rx="1" fill={c} />
          <rect x="16.6" y="9.5" width="3.4" height="10.5" rx="1" fill={c} />
        </>
      )}
      {type === "line" && (
        <path d="M4 16l5-5 4 3 7-8" {...s} strokeWidth="2" />
      )}
      {type === "people" && (
        <>
          <circle cx="9" cy="9" r="3" {...s} />
          <circle cx="16" cy="10" r="2.4" {...s} />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" {...s} />
          <path d="M15 14c2.6 0 4.5 1.8 4.5 4.4" {...s} />
        </>
      )}
      {type === "person" && (
        <>
          <circle cx="12" cy="8.5" r="3.3" fill={c} />
          <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z" fill={c} />
        </>
      )}
      {type === "clock" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...s} />
          <path d="M12 7.5V12l3 2" {...s} />
        </>
      )}
      {type === "doc" && (
        <>
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" {...s} />
          <path d="M14 3.5V8h4M9 12h6M9 15.5h6" {...s} />
        </>
      )}
      {type === "lock" && (
        <>
          <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" fill={c} />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...s} />
        </>
      )}
      {type === "link" && (
        <>
          <path d="M9.5 14.5l5-5" {...s} strokeWidth="2" />
          <path d="M8 12l-2.2 2.2a3 3 0 0 0 4.2 4.2L12 16" {...s} />
          <path d="M16 12l2.2-2.2a3 3 0 0 0-4.2-4.2L12 8" {...s} />
        </>
      )}
      {type === "bell" && (
        <>
          <path d="M6 17h12l-1.5-2.2V11a4.5 4.5 0 0 0-9 0v3.8L6 17z" fill={c} />
          <path d="M10.3 19.5a1.8 1.8 0 0 0 3.4 0" {...s} />
        </>
      )}
      {type === "card" && (
        <>
          <rect x="3.5" y="6" width="17" height="12" rx="2.5" fill={c} />
          <path d="M3.5 10h17" stroke="#fff" strokeWidth="1.6" />
          <path d="M6.5 14.5h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {type === "table" && (
        <>
          <rect x="4" y="4.5" width="16" height="15" rx="2" {...s} />
          <path d="M4 9.5h16M4 14.5h16M9.5 4.5v15" {...s} />
        </>
      )}
      {type === "check" && (
        <>
          <circle cx="12" cy="12" r="8.5" fill={c} />
          <path d="M8.2 12.3l2.6 2.6L16 9.5" stroke="#fff" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {type === "cloud" && (
        <path d="M7.5 18h9a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6-1.3A3.6 3.6 0 0 0 7.5 18z" fill={c} />
      )}
    </svg>
  );
};
