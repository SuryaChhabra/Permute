import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { Sphere } from "../components/Sphere";
import { CheckCircle, DashRing } from "../components/Icons";
import { easeOut, easeInOut, reveal } from "../anim";

const STEPS = [
  {
    title: "Loading your source data",
    note: "Found 10 matching records linking CRM opportunities with bank payments.",
    at: 8,
  },
  {
    title: "Organizing your working files",
    note: "Matched CRM and bank data for each customer.",
    at: 30,
  },
  {
    title: "Reconciling contract-to-cash",
    note: null as string | null,
    at: 58,
  },
];

// Field pairs to draw connectors between the CRM card and the payment card.
const PAIRS = [
  { left: "account_name", lv: "Acme Inc", right: "payer_name", rv: "Acme, Inc.", at: 30 },
  { left: "amount_usd", lv: "$286,612", right: "received_usd", rv: "$286,612", at: 40 },
  { left: "invoice_ref", lv: "INV-4471", right: "payment_ref", rv: "INV-4471", at: 50 },
];

export const Beat3Thinking: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 90], [1.0, 1.07], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [80, 94], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const spin = (frame * 6) % 360;
  const progress = interpolate(frame, [6, 70], [0.05, 0.92], {
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
      <div
        style={{
          transform: `scale(${scale}) translateY(${(1 - enter) * 22}px)`,
        }}
      >
        <AppWindow width={1240} height={680} workspace="Permute Agent">
          <div style={{ display: "flex", height: "100%" }}>
            {/* thinking panel */}
            <div
              style={{
                flex: "1 1 50%",
                padding: "30px 34px",
                borderRight: `1px solid ${colors.border}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* user prompt bubble */}
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: 440,
                  background: colors.surfaceMuted,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: colors.inkSoft,
                  opacity: reveal(frame, 2, 12),
                }}
              >
                …match invoices to payments and create a{" "}
                <span style={{ color: colors.blue, fontWeight: 600 }}>
                  health_signal
                </span>{" "}
                summarizing each account’s contract-to-cash status.
              </div>

              {/* brand row + progress */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 30,
                }}
              >
                <Sphere size={30} />
                <span
                  style={{ fontSize: 22, fontWeight: 700, color: colors.ink }}
                >
                  Permute
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 3,
                  background: colors.border,
                  marginTop: 14,
                  marginBottom: 26,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: `linear-gradient(90deg, ${colors.blue}, ${colors.blueSoft})`,
                    borderRadius: 3,
                  }}
                />
              </div>

              {/* steps */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {STEPS.map((s, i) => {
                  const appear = reveal(frame, s.at, 12);
                  const done = frame > s.at + 16 && i < STEPS.length - 1;
                  const isLast = i === STEPS.length - 1;
                  return (
                    <div
                      key={s.title}
                      style={{
                        display: "flex",
                        gap: 14,
                        opacity: appear,
                        transform: `translateY(${(1 - appear) * 8}px)`,
                        paddingBottom: 18,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {done ? (
                          <CheckCircle size={22} color={colors.inkSoft} />
                        ) : isLast ? (
                          <DashRing size={22} rotate={spin} color={colors.blue} />
                        ) : (
                          <CheckCircle size={22} color={colors.inkSoft} />
                        )}
                        {i < STEPS.length - 1 && (
                          <div
                            style={{
                              width: 1.5,
                              flex: 1,
                              minHeight: 26,
                              background: colors.border,
                              marginTop: 4,
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingTop: 1 }}>
                        <div
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: isLast ? colors.ink : colors.inkSoft,
                          }}
                        >
                          {s.title}
                          {isLast ? " …" : ""}
                        </div>
                        {s.note && (
                          <div
                            style={{
                              fontSize: 14,
                              color: colors.inkMuted,
                              marginTop: 5,
                              lineHeight: 1.5,
                              maxWidth: 360,
                              borderLeft: `2px solid ${colors.border}`,
                              paddingLeft: 11,
                            }}
                          >
                            {s.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* matching visualization */}
            <MatchPanel frame={frame} />
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["CRM meets payments."]}
        enter={6}
        exitStart={78}
        size={66}
      />
    </AbsoluteFill>
  );
};

const CARD_W = 250;
const ROW_H = 46;
const ROW_GAP = 12;
const FIRST_ROW_TOP = 64;

const MatchPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = reveal(frame, 16, 14);
  const panelW = 580;
  const leftX = 34;
  const rightX = panelW - CARD_W - 34;
  const rowY = (i: number) => FIRST_ROW_TOP + 150 + i * (ROW_H + ROW_GAP) + ROW_H / 2;

  return (
    <div
      style={{
        flex: "0 0 580px",
        position: "relative",
        padding: "30px 0",
        background: colors.surfaceMuted,
        opacity: appear,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 28,
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: colors.inkMuted,
        }}
      >
        RECORD MATCHING
      </div>

      {/* connector SVG layer */}
      <svg
        width={panelW}
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {PAIRS.map((p, i) => {
          const draw = interpolate(frame, [p.at, p.at + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          });
          const x1 = leftX + CARD_W;
          const x2 = rightX;
          const y = rowY(i);
          const midX = (x1 + x2) / 2;
          const path = `M ${x1} ${y} C ${midX} ${y}, ${midX} ${y}, ${x2} ${y}`;
          return (
            <g key={i}>
              <path
                d={path}
                stroke={colors.blue}
                strokeWidth={2}
                fill="none"
                strokeDasharray={200}
                strokeDashoffset={(1 - draw) * 200}
                opacity={0.9}
              />
              <circle cx={x1} cy={y} r={3.5} fill={colors.blue} opacity={draw} />
              <circle cx={x2} cy={y} r={3.5} fill={colors.blue} opacity={draw} />
              {draw > 0.85 && (
                <g transform={`translate(${midX - 11}, ${y - 11})`}>
                  <circle cx="11" cy="11" r="11" fill={colors.green} />
                  <path
                    d="M6.5 11.4l3 3L16 8"
                    stroke="#fff"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* CRM card */}
      <RecordCard
        title="CRM · Opportunity"
        tint="#2a9d6e"
        x={leftX}
        top={FIRST_ROW_TOP + 110}
        fields={PAIRS.map((p) => ({ k: p.left, v: p.lv, at: p.at }))}
        frame={frame}
      />
      {/* Payment card */}
      <RecordCard
        title="Bank · Payment"
        tint="#e0742a"
        x={rightX}
        top={FIRST_ROW_TOP + 110}
        fields={PAIRS.map((p) => ({ k: p.right, v: p.rv, at: p.at }))}
        frame={frame}
      />
    </div>
  );
};

const RecordCard: React.FC<{
  title: string;
  tint: string;
  x: number;
  top: number;
  fields: { k: string; v: string; at: number }[];
  frame: number;
}> = ({ title, tint, x, top, fields, frame }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top,
      width: CARD_W,
      background: "#fff",
      borderRadius: radii.card,
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.card,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <span
        style={{ width: 9, height: 9, borderRadius: 3, background: tint }}
      />
      <span style={{ fontSize: 13, fontWeight: 700, color: colors.ink }}>
        {title}
      </span>
    </div>
    {fields.map((f) => {
      const hl = interpolate(frame, [f.at, f.at + 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      });
      return (
        <div
          key={f.k}
          style={{
            height: ROW_H,
            marginBottom: ROW_GAP,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 14px",
            background: `rgba(58,109,240,${0.07 * hl})`,
          }}
        >
          <span style={{ fontSize: 11.5, color: colors.inkMuted }}>{f.k}</span>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: colors.ink }}>
            {f.v}
          </span>
        </div>
      );
    })}
  </div>
);
