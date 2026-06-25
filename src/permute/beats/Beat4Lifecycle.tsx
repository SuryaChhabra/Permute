import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { CheckFilled } from "../components/Icons";
import { ConfirmRing, TravelNode } from "../components/Motion";
import { easeOut, easeInOut } from "../anim";

const VW = 1280;
const VH = 624;
const CARD_W = 300;
const CARD_H = 300;
const GAP = 90;
const RAIL_Y = 250; // world-y center of the rail
const cardX = (i: number) => 70 + i * (CARD_W + GAP);
const cardCenter = (i: number) => cardX(i) + CARD_W / 2;

type Stage = {
  kicker: string;
  tint: string;
  ref: string;
  title: string;
  fields: { k: string; v: string; strong?: boolean }[];
  status: string;
  appearAt: number;
};

const AMOUNT = "$286,612";

const STAGES: Stage[] = [
  {
    kicker: "OPPORTUNITY",
    tint: "#2a9d6e",
    ref: "OPP-2208",
    title: "Acme Inc",
    fields: [
      { k: "Stage", v: "Closed Won" },
      { k: "Owner", v: "Scott Nelson" },
      { k: "Value", v: AMOUNT, strong: true },
    ],
    status: "Won",
    appearAt: 8,
  },
  {
    kicker: "CONTRACT",
    tint: "#5b86f4",
    ref: "MSA-4471",
    title: "Acme Inc — MSA",
    fields: [
      { k: "Status", v: "Signed" },
      { k: "Term", v: "12 months" },
      { k: "Value", v: AMOUNT, strong: true },
    ],
    status: "Executed",
    appearAt: 30,
  },
  {
    kicker: "INVOICE",
    tint: "#7a5af0",
    ref: "INV-4471",
    title: "Invoice · Acme Inc",
    fields: [
      { k: "Issued", v: "Net 30" },
      { k: "Ref", v: "INV-4471" },
      { k: "Amount", v: AMOUNT, strong: true },
    ],
    status: "Issued",
    appearAt: 52,
  },
  {
    kicker: "PAYMENT",
    tint: "#e0742a",
    ref: "ACH-9920",
    title: "Bank Transfer",
    fields: [
      { k: "Payer", v: "Acme, Inc." },
      { k: "Ref", v: "INV-4471" },
      { k: "Received", v: AMOUNT, strong: true },
    ],
    status: "Received",
    appearAt: 74,
  },
  {
    kicker: "RECONCILED",
    tint: "#1f9d6b",
    ref: "ACME-2208",
    title: "Acme Inc",
    fields: [
      { k: "Lifecycle", v: "Complete" },
      { k: "Variance", v: "$0.00" },
      { k: "Health", v: "Green", strong: true },
    ],
    status: "Reconciled",
    appearAt: 98,
  },
];

const RECONCILE_AT = 112;

export const Beat4Lifecycle: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  // Camera: track each card during the build, then zoom out to reveal all.
  const focus = interpolate(
    frame,
    [8, 30, 52, 74, 98, 120, 150],
    [
      cardCenter(0),
      cardCenter(1),
      cardCenter(2),
      cardCenter(3),
      cardCenter(4),
      cardCenter(4),
      cardCenter(2),
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );
  const scale = interpolate(frame, [8, 112, 152], [1.24, 1.24, 0.605], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const camX = VW / 2 - focus * scale;
  const camY = VH / 2 - RAIL_Y * scale;

  const reconcileGlow = interpolate(
    frame,
    [RECONCILE_AT, RECONCILE_AT + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
      }}
    >
      <div style={{ transform: `translateY(${(1 - enter) * 22}px)` }}>
        <AppWindow width={1280} height={680} workspace="Contract-to-Cash">
          <AbsoluteFill style={{ overflow: "hidden" }}>
            {/* world / camera */}
            <div
              style={{
                position: "absolute",
                transform: `translate(${camX}px, ${camY}px) scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              {/* flow connectors behind cards */}
              <svg
                width={cardX(STAGES.length - 1) + CARD_W + 70}
                height={RAIL_Y * 2}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                {STAGES.slice(0, -1).map((_, i) => {
                  const drawAt = STAGES[i + 1].appearAt - 6;
                  const d = interpolate(frame, [drawAt, drawAt + 14], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: easeOut,
                  });
                  const x1 = cardX(i) + CARD_W;
                  const x2 = cardX(i + 1);
                  const y = RAIL_Y;
                  const matched = reconcileGlow;
                  return (
                    <g key={i}>
                      <line
                        x1={x1}
                        y1={y}
                        x2={x1 + (x2 - x1) * d}
                        y2={y}
                        stroke={
                          matched > 0.5 ? colors.green : colors.borderStrong
                        }
                        strokeWidth={2.5}
                      />
                      <polygon
                        points={`${x2 - 2},${y} ${x2 - 14},${y - 7} ${x2 - 14},${y + 7}`}
                        fill={matched > 0.5 ? colors.green : colors.borderStrong}
                        opacity={d}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* glow node carrying motion along each flow arrow */}
              {STAGES.slice(0, -1).map((_, i) => {
                const drawAt = STAGES[i + 1].appearAt - 6;
                const prog = interpolate(frame, [drawAt, drawAt + 16], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <TravelNode
                    key={`tn-${i}`}
                    x1={cardX(i) + CARD_W}
                    x2={cardX(i + 1)}
                    y={RAIL_Y}
                    progress={prog}
                    color={colors.blueSoft}
                    size={11}
                  />
                );
              })}

              {STAGES.map((s, i) => (
                <StageCard
                  key={i}
                  stage={s}
                  frame={frame}
                  reconcile={reconcileGlow}
                />
              ))}

              {/* confirmation ring as each record reconciles */}
              {STAGES.map((_, i) => {
                const pulse = interpolate(
                  frame,
                  [RECONCILE_AT + i * 4, RECONCILE_AT + i * 4 + 24],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={`rp-${i}`}
                    style={{
                      position: "absolute",
                      left: cardX(i) + CARD_W / 2,
                      top: RAIL_Y,
                    }}
                  >
                    <ConfirmRing progress={pulse} color={colors.green} size={120} thickness={2.5} />
                  </div>
                );
              })}

              {/* matched-amount link between invoice & payment */}
              <AmountLink frame={frame} />
            </div>
          </AbsoluteFill>

          {/* fully-reconciled summary bar (screen-space, appears at reveal) */}
          <ReconciledBar frame={frame} />
        </AppWindow>
      </div>

      <Caption
        lines={["Contract-to-cash,", "reconciled."]}
        enter={8}
        exitStart={184}
        exitDur={10}
        size={64}
        accentLast
        position="bottom"
      />
    </AbsoluteFill>
  );
};

const StageCard: React.FC<{
  stage: Stage;
  frame: number;
  reconcile: number;
}> = ({ stage, frame, reconcile }) => {
  const i = STAGES.indexOf(stage);
  const a = interpolate(frame, [stage.appearAt, stage.appearAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const isReconciledCard = i === STAGES.length - 1;
  const glow = isReconciledCard ? reconcile : reconcile;

  return (
    <div
      style={{
        position: "absolute",
        left: cardX(i),
        top: RAIL_Y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        background: "#fff",
        borderRadius: radii.card,
        border: `1px solid ${glow > 0.4 ? colors.green + "66" : colors.border}`,
        boxShadow:
          glow > 0.4
            ? `0 0 0 ${glow * 3}px rgba(31,157,107,0.14), ${shadows.card}`
            : shadows.card,
        opacity: a,
        transform: `translateY(${(1 - a) * 26}px) scale(${0.96 + a * 0.04})`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: stage.tint,
            }}
          >
            {stage.kicker}
          </span>
          <span style={{ fontSize: 11.5, color: colors.inkFaint }}>
            {stage.ref}
          </span>
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.ink,
            marginTop: 6,
          }}
        >
          {stage.title}
        </div>
      </div>

      {/* fields */}
      <div style={{ padding: "12px 16px", flex: 1 }}>
        {stage.fields.map((f) => (
          <div
            key={f.k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: `1px solid ${colors.surfaceMuted}`,
            }}
          >
            <span style={{ fontSize: 13.5, color: colors.inkMuted }}>
              {f.k}
            </span>
            <span
              style={{
                fontSize: f.strong ? 15.5 : 14,
                fontWeight: f.strong ? 700 : 500,
                color: f.strong ? colors.ink : colors.inkSoft,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {f.v}
            </span>
          </div>
        ))}
      </div>

      {/* status footer */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: glow > 0.4 ? colors.green : stage.tint,
            background: glow > 0.4 ? colors.greenTint : stage.tint + "14",
            borderRadius: radii.pill,
            padding: "4px 12px",
          }}
        >
          {glow > 0.4 ? "Reconciled" : stage.status}
        </span>
        {glow > 0.5 && (
          <div style={{ marginLeft: "auto", opacity: glow }}>
            <CheckFilled size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

// Curved link showing the amount matching between Invoice (i=2) and Payment (i=3).
const AmountLink: React.FC<{ frame: number }> = ({ frame }) => {
  const d = interpolate(frame, [86, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (d <= 0) return null;
  const x1 = cardX(2) + CARD_W - 20;
  const x2 = cardX(3) + 20;
  const y0 = RAIL_Y + 40; // near the amount row
  const dip = 86;
  const midX = (x1 + x2) / 2;
  return (
    <svg
      width={cardX(4) + CARD_W}
      height={RAIL_Y * 2}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      <path
        d={`M ${x1} ${y0} C ${x1} ${y0 + dip}, ${x2} ${y0 + dip}, ${x2} ${y0}`}
        stroke={colors.blue}
        strokeWidth={2}
        fill="none"
        strokeDasharray={260}
        strokeDashoffset={(1 - d) * 260}
      />
      {d > 0.8 && (
        <g transform={`translate(${midX}, ${y0 + dip - 4})`}>
          <rect
            x={-58}
            y={-15}
            width={116}
            height={30}
            rx={15}
            fill="#fff"
            stroke={colors.blue + "55"}
          />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            fill={colors.blue}
            fontFamily="inherit"
          >
            amount matched
          </text>
        </g>
      )}
    </svg>
  );
};

const ReconciledBar: React.FC<{ frame: number }> = ({ frame }) => {
  const a = interpolate(frame, [150, 166], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (a <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 30,
        transform: `translateX(-50%) translateY(${(1 - a) * 14}px)`,
        opacity: a,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        border: `1px solid ${colors.green}33`,
        boxShadow: shadows.card,
        borderRadius: radii.pill,
        padding: "10px 20px",
      }}
    >
      <CheckFilled size={22} />
      <span style={{ fontSize: 16, fontWeight: 700, color: colors.ink }}>
        Opportunity → Contract → Invoice → Payment
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: colors.green,
          background: colors.greenTint,
          borderRadius: radii.pill,
          padding: "4px 12px",
        }}
      >
        Fully reconciled
      </span>
    </div>
  );
};
