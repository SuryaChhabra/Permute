import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { ConfirmRing, FloatingChip, GlowNode } from "../components/Motion";
import { Badge } from "./parts";
import { easeOut, easeInOut, reveal } from "../anim";

const STAGES = ["Qualified", "Demo", "Proposal", "Negotiation", "Closed Won"];
const BOARD_W = 1180;
const colCenter = (i: number) => ((i + 0.5) * BOARD_W) / STAGES.length;

type Lane = {
  name: string;
  amount: string;
  from: number;
  to: number;
  moveAt: number;
  badge: { text: string; tone: "green" | "orange" | "neutral"; at: number };
  state: "move" | "stall" | "slip";
};

const LANES: Lane[] = [
  {
    name: "Northwind Pilot",
    amount: "$182,940",
    from: 1,
    to: 2,
    moveAt: 16,
    badge: { text: "Deal moved", tone: "green", at: 34 },
    state: "move",
  },
  {
    name: "Globex Expansion",
    amount: "$160,112",
    from: 3,
    to: 3,
    moveAt: 0,
    badge: { text: "Stalled", tone: "orange", at: 30 },
    state: "stall",
  },
  {
    name: "Acme Renewal",
    amount: "$159,401",
    from: 2,
    to: 2,
    moveAt: 0,
    badge: { text: "At risk", tone: "orange", at: 38 },
    state: "slip",
  },
];

export const RBeat3Alerts: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 60], [1.0, 1.04], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [86, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const laneTop = 150;
  const laneH = 104;

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
          transform: `scale(${scale}) translateY(${(1 - enter) * 20}px)`,
        }}
      >
        <AppWindow width={1280} height={700} workspace="Pipeline">
          <div style={{ padding: "26px 34px", height: "100%", position: "relative" }}>
            <div style={{ fontSize: 14, color: colors.inkMuted, marginBottom: 4 }}>
              Reports <span style={{ opacity: 0.5 }}>/</span> Pipeline Alerts
            </div>
            <div
              style={{ fontSize: 22, fontWeight: 700, color: colors.ink, marginBottom: 18 }}
            >
              Pipeline movement
            </div>

            {/* board */}
            <div style={{ position: "relative", width: BOARD_W, height: 430 }}>
              {/* stage headers + column guides */}
              {STAGES.map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    style={{
                      position: "absolute",
                      left: colCenter(i) - BOARD_W / STAGES.length / 2 + 6,
                      top: 0,
                      width: BOARD_W / STAGES.length - 12,
                      textAlign: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.inkMuted,
                      padding: "8px 0",
                      borderRadius: 8,
                      background: colors.surfaceMuted,
                      opacity: reveal(frame, 4 + i * 2, 10),
                    }}
                  >
                    {s}
                  </div>
                  {i > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: (colCenter(i) + colCenter(i - 1)) / 2,
                        top: 40,
                        bottom: 0,
                        width: 1,
                        background: colors.border,
                        opacity: 0.7,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}

              {/* lanes */}
              {LANES.map((lane, li) => {
                const y = laneTop + li * laneH;
                const moveT =
                  lane.state === "move"
                    ? reveal(frame, lane.moveAt, 18)
                    : 0;
                const cx = colCenter(
                  lane.from + (lane.to - lane.from) * moveT,
                );
                const slip =
                  lane.state === "slip" ? reveal(frame, 38, 12) * 8 : 0;
                const stallPulse =
                  rich && lane.state === "stall"
                    ? interpolate(frame, [30, 52], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })
                    : 0;
                const slipRing =
                  rich && lane.state === "slip"
                    ? interpolate(frame, [38, 60], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })
                    : 0;
                const appear = reveal(frame, 8 + li * 3, 12);

                return (
                  <React.Fragment key={lane.name}>
                    {/* Option 2: motion trail for the moving deal */}
                    {rich && lane.state === "move" && (
                      <>
                        <svg
                          style={{ position: "absolute", left: 0, top: 0 }}
                          width={BOARD_W}
                          height={430}
                        >
                          <line
                            x1={colCenter(lane.from)}
                            y1={y + 34}
                            x2={cx}
                            y2={y + 34}
                            stroke={colors.blue}
                            strokeWidth={1.5}
                            opacity={0.35 * moveT}
                          />
                        </svg>
                        <GlowNode
                          x={cx}
                          y={y + 34}
                          size={9}
                          color={colors.blueSoft}
                          opacity={moveT > 0 && moveT < 1 ? 1 : 0}
                        />
                      </>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        left: cx - 95,
                        top: y + slip,
                        width: 190,
                        background: "#fff",
                        borderRadius: radii.card,
                        border: `1px solid ${
                          lane.state === "move"
                            ? colors.border
                            : colors.orange + "55"
                        }`,
                        boxShadow: shadows.card,
                        padding: "12px 14px",
                        opacity: appear,
                        transform: `scale(${0.96 + appear * 0.04})`,
                      }}
                    >
                      <div
                        style={{ fontSize: 14.5, fontWeight: 700, color: colors.ink }}
                      >
                        {lane.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: colors.inkMuted,
                          margin: "3px 0 9px",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {lane.amount}
                      </div>
                      <div style={{ opacity: reveal(frame, lane.badge.at, 10) }}>
                        <Badge text={lane.badge.text} tone={lane.badge.tone} />
                      </div>
                      {stallPulse > 0 && (
                        <ConfirmRing progress={stallPulse} color={colors.amber} size={48} />
                      )}
                      {slipRing > 0 && (
                        <ConfirmRing progress={slipRing} color={colors.orange} size={52} />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* alert card slides in */}
            <AlertCard frame={frame} rich={rich} />
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["Pipeline alerts", "when deals move, stall, or slip."]}
        enter={6}
        exitStart={80}
        size={56}
      />
    </AbsoluteFill>
  );
};

const AlertCard: React.FC<{ frame: number; rich: boolean }> = ({
  frame,
  rich,
}) => {
  const a = reveal(frame, 48, 16);
  if (a <= 0) return null;
  const ring = rich
    ? interpolate(frame, [50, 74], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <div
      style={{
        position: "absolute",
        right: 34,
        bottom: 28,
        width: 360,
        background: "#fff",
        borderRadius: radii.card,
        border: `1px solid ${colors.orange}44`,
        boxShadow: `0 18px 50px -20px rgba(184,85,26,0.30), ${shadows.card}`,
        padding: "18px 20px",
        opacity: a,
        transform: `translateX(${(1 - a) * 40}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", display: "flex" }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: colors.orangeTint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.orangeDeep,
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            !
          </span>
          {ring > 0 && (
            <ConfirmRing progress={ring} color={colors.orange} size={46} />
          )}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: colors.ink }}>
          Pipeline alert
        </span>
        <span style={{ marginLeft: "auto" }}>
          <Badge text="High" tone="orange" dot={false} />
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: colors.inkSoft,
          margin: "12px 0",
        }}
      >
        3 renewal deals are overdue or stuck in the Contract Sent stage.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Badge text="Owner · Sales" tone="neutral" />
        {rich && (
          <FloatingChip
            label="Follow-up needed"
            appear={reveal(frame, 60, 14)}
            tint={colors.orange}
            style={{ position: "relative" }}
          />
        )}
      </div>
    </div>
  );
};
