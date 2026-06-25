import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { CheckCircle } from "../components/Icons";
import { ConfirmRing, FloatingChip } from "../components/Motion";
import { SectionLabel, Badge } from "./parts";
import { easeOut, easeInOut, reveal } from "../anim";

const CADENCE = ["Manual", "Hourly", "Daily", "Weekly", "Monthly"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SELECTED_CADENCE = 3; // Weekly
const SELECTED_DAY = 1; // Mon

export const RBeat2Schedule: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  // Push toward the schedule selector.
  const scale = interpolate(frame, [0, 70], [1.0, 1.1], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const ty = interpolate(frame, [0, 70], [0, 18], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [70, 81], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const cadenceSel = reveal(frame, 22, 10);
  const daySel = reveal(frame, 34, 10);
  const cadencePulse = interpolate(frame, [24, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
          transform: `scale(${scale}) translateY(${ty}px) translateY(${(1 - enter) * 20}px)`,
        }}
      >
        <AppWindow width={1240} height={700}>
          <div style={{ display: "flex", height: "100%" }}>
            {/* main */}
            <div
              style={{
                flex: "1 1 64%",
                padding: "26px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 14, color: colors.inkMuted }}>
                Reports <span style={{ opacity: 0.5 }}>/</span> New Report
              </div>

              <CompletedStep title="Connect data sources" note="3 sources" />
              <CompletedStep
                title="Describe your requirements"
                note="Weekly Contract-to-Cash"
              />

              {/* active step */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 4,
                }}
              >
                <StepBubble n={3} active />
                <span
                  style={{ fontSize: 18, fontWeight: 700, color: colors.ink }}
                >
                  Set schedule
                </span>
              </div>

              <div
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.card,
                  background: colors.surface,
                  boxShadow: shadows.card,
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 14, color: colors.inkMuted }}>
                  How often should this report run?
                </div>

                {/* cadence toggle */}
                <div style={{ display: "flex", gap: 10 }}>
                  {CADENCE.map((c, i) => {
                    const isSel = i === SELECTED_CADENCE;
                    const on = isSel ? cadenceSel : 0;
                    return (
                      <div
                        key={c}
                        style={{
                          position: "relative",
                          padding: "9px 18px",
                          borderRadius: 8,
                          fontSize: 14.5,
                          fontWeight: 600,
                          border: `1px solid ${on > 0.5 ? colors.ink : colors.border}`,
                          background: on > 0.5 ? colors.ink : colors.surface,
                          color: on > 0.5 ? "#fff" : colors.inkSoft,
                        }}
                      >
                        {c}
                        {isSel && rich && (
                          <ConfirmRing
                            progress={cadencePulse}
                            color={colors.blue}
                            size={68}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* time + day */}
                <div style={{ display: "flex", gap: 40 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={{ fontSize: 13, color: colors.inkMuted }}>
                      What time?
                    </span>
                    <div
                      style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: `1px solid ${colors.blue}`,
                        color: colors.blueDeep,
                        fontSize: 15,
                        fontWeight: 600,
                        background: colors.blueTint,
                        width: 120,
                      }}
                    >
                      9:00 AM
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={{ fontSize: 13, color: colors.inkMuted }}>
                      Which day?
                    </span>
                    <div style={{ display: "flex", gap: 7 }}>
                      {DAYS.map((d, i) => {
                        const isSel = i === SELECTED_DAY;
                        const on = isSel ? daySel : 0;
                        return (
                          <div
                            key={d}
                            style={{
                              width: 46,
                              textAlign: "center",
                              padding: "9px 0",
                              borderRadius: 8,
                              fontSize: 13.5,
                              fontWeight: 600,
                              border: `1px solid ${on > 0.5 ? colors.orange : colors.border}`,
                              background:
                                on > 0.5 ? colors.orangeTint : colors.surface,
                              color: on > 0.5 ? colors.orangeDeep : colors.inkSoft,
                            }}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* scheduled confirmation */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: colors.greenTint,
                    border: `1px solid ${colors.green}22`,
                    opacity: reveal(frame, 42, 12),
                  }}
                >
                  <CheckCircle size={18} color={colors.green} />
                  <span
                    style={{ fontSize: 14.5, fontWeight: 600, color: colors.green }}
                  >
                    Scheduled: every Monday at 9:00 AM — recurring
                  </span>
                </div>

                {/* Option 2: calendar chip slides in */}
                {rich && (
                  <div style={{ position: "absolute", right: 22, top: -16 }}>
                    <FloatingChip
                      label="Recurring weekly"
                      appear={reveal(frame, 48, 14)}
                      tint={colors.blue}
                      style={{ position: "relative" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* right rail */}
            <div
              style={{
                flex: "0 0 320px",
                borderLeft: `1px solid ${colors.border}`,
                padding: "26px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: colors.surfaceMuted,
              }}
            >
              <SectionLabel>Schedule</SectionLabel>
              <div style={{ opacity: reveal(frame, 44, 12) }}>
                <Badge text="Weekly · Mon · 9:00 AM" tone="blue" />
              </div>
              <div style={{ height: 1, background: colors.border, margin: "2px 0" }} />
              <SectionLabel>Delivery</SectionLabel>
              <div style={{ opacity: reveal(frame, 50, 12) }}>
                <Badge text="Send to team" tone="green" />
              </div>
              <div style={{ height: 1, background: colors.border, margin: "2px 0" }} />
              <SectionLabel>Requirements</SectionLabel>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: colors.inkSoft,
                  opacity: reveal(frame, 18, 14),
                }}
              >
                Weekly Contract-to-Cash report from reconciled CRM + bank data.
                <br />
                <br />
                <span style={{ color: colors.inkMuted }}>
                  Summary metrics, at-risk renewals, and finance alerts.
                </span>
              </div>
            </div>
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["Weekly updates", "without weekly setup."]}
        enter={6}
        exitStart={64}
        size={60}
      />
    </AbsoluteFill>
  );
};

const StepBubble: React.FC<{ n: number; active?: boolean; done?: boolean }> = ({
  n,
  active,
  done,
}) => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: done ? colors.greenTint : active ? colors.ink : colors.surfaceMuted,
      color: done ? colors.green : active ? "#fff" : colors.inkMuted,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      flex: "0 0 auto",
    }}
  >
    {done ? "✓" : n}
  </div>
);

const CompletedStep: React.FC<{ title: string; note: string }> = ({
  title,
  note,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 14px",
      borderRadius: 10,
      background: colors.surfaceMuted,
    }}
  >
    <CheckCircle size={20} color={colors.green} />
    <span style={{ fontSize: 15.5, fontWeight: 600, color: colors.inkSoft }}>
      {title}
    </span>
    <span style={{ marginLeft: "auto", fontSize: 13, color: colors.inkMuted }}>
      {note}
    </span>
  </div>
);
