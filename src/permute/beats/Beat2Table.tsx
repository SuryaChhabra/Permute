import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { easeOut, easeInOut } from "../anim";

type Row = {
  customer: string;
  stage: string;
  contract: string;
  invoice: string;
  received: string;
  status: string;
  overdue: number;
  health: "Green" | "Yellow";
};

const COLS = [
  { key: "customer", label: "Customer", w: 196, align: "left" as const },
  { key: "stage", label: "Deal stage", w: 150, align: "left" as const },
  { key: "contract", label: "Contract value", w: 138, align: "right" as const },
  { key: "invoice", label: "Invoice amount", w: 138, align: "right" as const },
  { key: "received", label: "Amount received", w: 146, align: "right" as const },
  { key: "status", label: "Payment status", w: 226, align: "left" as const },
  { key: "overdue", label: "Days overdue", w: 118, align: "right" as const },
  { key: "health", label: "Health", w: 110, align: "left" as const },
];

const ROWS: Row[] = [
  { customer: "Northwind LLC", stage: "Closed Won", contract: "$310,844", invoice: "$310,844", received: "$310,844", status: "Paid — Reconciled", overdue: 0, health: "Green" },
  { customer: "Acme Inc", stage: "Negotiation", contract: "$286,612", invoice: "$286,612", received: "$140,000", status: "Contract Sent — Awaiting Signature", overdue: 195, health: "Yellow" },
  { customer: "Globex Corp", stage: "Closing", contract: "$264,991", invoice: "$264,991", received: "$264,991", status: "Paid — Reconciled", overdue: 0, health: "Green" },
  { customer: "Initech", stage: "Negotiation", contract: "$189,784", invoice: "$189,784", received: "$0", status: "In Pipeline", overdue: 143, health: "Yellow" },
  { customer: "Umbrella Co", stage: "Closed Won", contract: "$114,197", invoice: "$114,197", received: "$114,197", status: "Paid — Reconciled", overdue: 0, health: "Green" },
  { customer: "Soylent Ltd", stage: "Renewal", contract: "$98,420", invoice: "$98,420", received: "$60,000", status: "Contract Sent — Awaiting Signature", overdue: 78, health: "Yellow" },
  { customer: "Hooli", stage: "Closed Won", contract: "$72,510", invoice: "$72,510", received: "$72,510", status: "Paid — Reconciled", overdue: 0, health: "Green" },
];

const ROW_H = 42;
const HEAD_H = 40;

export const Beat2Table: React.FC = () => {
  const frame = useCurrentFrame();

  // Wide establishing view -> gentle push into the cleaned rows.
  const scale = interpolate(frame, [0, 22, 74], [0.9, 0.97, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const ty = interpolate(frame, [0, 74], [10, -34], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [62, 76], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const totalW = COLS.reduce((a, c) => a + c.w, 0) + 46;

  // Cleaning sweep moves left -> right; cells "resolve" as it passes.
  const sweep = interpolate(frame, [10, 52], [-0.15, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(enter, exit),
      }}
    >
      <div style={{ transform: `scale(${scale}) translateY(${ty}px)` }}>
        <AppWindow width={1180} height={620} workspace="Contract-to-Cash">
          <div style={{ padding: "22px 26px", height: "100%" }}>
            <div
              style={{
                fontSize: 14,
                color: colors.inkMuted,
                marginBottom: 4,
              }}
            >
              Data Tables <span style={{ opacity: 0.5 }}>/</span> Unified View
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: colors.ink,
                marginBottom: 16,
              }}
            >
              contract_to_cash_lifecycle
            </div>

            {/* spreadsheet */}
            <div
              style={{
                width: totalW,
                border: `1px solid ${colors.excelGrid}`,
                borderRadius: radii.card,
                overflow: "hidden",
                boxShadow: shadows.card,
                position: "relative",
                background: "#fff",
              }}
            >
              {/* header */}
              <div style={{ display: "flex", height: HEAD_H }}>
                <Corner />
                {COLS.map((c) => (
                  <div
                    key={c.key}
                    style={{
                      width: c.w,
                      height: HEAD_H,
                      background: colors.excelBlue,
                      color: "#fff",
                      fontSize: 12.5,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        c.align === "right" ? "flex-end" : "flex-start",
                      padding: "0 12px",
                      borderRight: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    {c.label}
                  </div>
                ))}
              </div>

              {/* rows */}
              {ROWS.map((r, ri) => {
                const rowStart = 6 + ri * 3;
                const rowIn = interpolate(
                  frame,
                  [rowStart, rowStart + 12],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: easeOut,
                  },
                );
                // per-cell cleaning based on sweep position across columns
                return (
                  <div
                    key={ri}
                    style={{
                      display: "flex",
                      height: ROW_H,
                      opacity: rowIn,
                      background: ri % 2 ? colors.surfaceMuted : "#fff",
                    }}
                  >
                    <RowNum n={ri + 1} />
                    {COLS.map((c, ci) => {
                      const colPos = ci / (COLS.length - 1);
                      const cleaned = sweep > colPos;
                      return (
                        <Cell
                          key={c.key}
                          col={c}
                          row={r}
                          cleaned={cleaned}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {/* sweep highlight band */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `calc(46px + ${sweep} * ${totalW - 46}px - 60px)`,
                  width: 120,
                  background:
                    "linear-gradient(90deg, rgba(58,109,240,0) 0%, rgba(58,109,240,0.16) 50%, rgba(58,109,240,0) 100%)",
                  opacity: sweep > 0 && sweep < 1.1 ? 1 : 0,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["Get one clean view."]}
        enter={6}
        exitStart={60}
        size={66}
        accentLast
      />
    </AbsoluteFill>
  );
};

const Corner = () => (
  <div
    style={{
      width: 46,
      height: HEAD_H,
      background: "#f3f5f9",
      borderRight: `1px solid ${colors.excelGrid}`,
    }}
  />
);

const RowNum: React.FC<{ n: number }> = ({ n }) => (
  <div
    style={{
      width: 46,
      height: ROW_H,
      background: "#f3f5f9",
      color: colors.inkFaint,
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: `1px solid ${colors.excelGrid}`,
    }}
  >
    {n}
  </div>
);

const Cell: React.FC<{
  col: (typeof COLS)[number];
  row: Row;
  cleaned: boolean;
}> = ({ col, row, cleaned }) => {
  const raw = (row as unknown as Record<string, string | number>)[col.key];

  let content: React.ReactNode = raw;
  if (col.key === "status") content = <StatusPill text={String(raw)} />;
  if (col.key === "health") content = <HealthDot v={row.health} />;
  if (col.key === "overdue")
    content = row.overdue === 0 ? "—" : String(row.overdue);

  return (
    <div
      style={{
        width: col.w,
        height: ROW_H,
        display: "flex",
        alignItems: "center",
        justifyContent: col.align === "right" ? "flex-end" : "flex-start",
        padding: "0 12px",
        borderRight: `1px solid ${colors.excelGrid}`,
        borderBottom: `1px solid ${colors.excelGrid}`,
        fontSize: 13,
        color: cleaned ? colors.inkSoft : colors.inkFaint,
        // Uncleaned cells read as slightly raw/unaligned, then settle.
        transform: cleaned ? "none" : "translateX(-3px)",
        filter: cleaned ? "none" : "blur(0.6px)",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {cleaned ? content : <span style={{ opacity: 0.55 }}>{content}</span>}
    </div>
  );
};

const StatusPill: React.FC<{ text: string }> = ({ text }) => {
  const paid = text.startsWith("Paid");
  const pipeline = text.startsWith("In Pipeline");
  const bg = paid ? colors.greenTint : pipeline ? colors.surfaceMuted : colors.amberTint;
  const fg = paid ? colors.green : pipeline ? colors.inkMuted : colors.amber;
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        color: fg,
        background: bg,
        border: `1px solid ${fg}22`,
        borderRadius: radii.pill,
        padding: "3px 9px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%",
      }}
    >
      {text}
    </span>
  );
};

const HealthDot: React.FC<{ v: "Green" | "Yellow" }> = ({ v }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: v === "Green" ? colors.green : colors.amber,
      }}
    />
    <span style={{ fontSize: 12.5, color: colors.inkSoft }}>{v}</span>
  </span>
);
