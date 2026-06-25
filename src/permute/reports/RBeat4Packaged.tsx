import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { CheckFilled } from "../components/Icons";
import { LightSweep, ConfirmRing } from "../components/Motion";
import { Badge, SectionLabel } from "./parts";
import { easeOut, easeInOut, reveal } from "../anim";

const CARDS = [
  {
    title: "Cash flow",
    value: "$271,253",
    sub: "collected · $332,918 outstanding",
    accent: colors.green,
  },
  {
    title: "Pipeline movement",
    value: "+$763,572",
    sub: "closed · 12 deals advanced",
    accent: colors.blue,
  },
  {
    title: "Sales activity",
    value: "48 updates",
    sub: "across 9 owners this week",
    accent: colors.orange,
  },
];

export const RBeat4Packaged: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  // Settle from a slight push-in to a composed full view (gentle pull-back).
  const scale = interpolate(frame, [0, 90], [1.05, 1.0], {
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [126, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const sent = reveal(frame, 72, 14);
  const sentPulse = rich
    ? interpolate(frame, [74, 98], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

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
          transform: `scale(${scale}) translateY(${(1 - enter) * 18}px)`,
        }}
      >
        <AppWindow width={1240} height={700} workspace="Reports">
          <div
            style={{
              padding: "28px 34px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 14, color: colors.inkMuted }}>
              Reports <span style={{ opacity: 0.5 }}>/</span> Weekly Update
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "8px 0 6px",
              }}
            >
              <div
                style={{ fontSize: 26, fontWeight: 700, color: colors.ink }}
              >
                Weekly Contract-to-Cash
              </div>
              <div style={{ opacity: reveal(frame, 16, 10) }}>
                <Badge text="Report ready" tone="green" />
              </div>
            </div>
            <SectionLabel>Packaged sections</SectionLabel>

            {/* three report cards assembling */}
            <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
              {CARDS.map((c, i) => {
                const a = reveal(frame, 10 + i * 8, 18);
                return (
                  <div
                    key={c.title}
                    style={{
                      flex: "1 1 0",
                      background: "#fff",
                      borderRadius: radii.card,
                      border: `1px solid ${colors.border}`,
                      boxShadow: shadows.card,
                      padding: "20px 22px",
                      opacity: a,
                      transform: `translateY(${(1 - a) * 30}px) scale(${0.96 + a * 0.04})`,
                      minHeight: 188,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: c.accent,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: colors.ink,
                        }}
                      >
                        {c.title}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        color: colors.ink,
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {c.value}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: colors.inkMuted,
                        marginTop: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {c.sub}
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: 14 }}>
                      <Badge text="Included" tone="neutral" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* delivered state */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                borderRadius: radii.card,
                background: colors.greenTint,
                border: `1px solid ${colors.green}33`,
                opacity: sent,
                transform: `translateY(${(1 - sent) * 16}px)`,
                position: "relative",
              }}
            >
              <div style={{ position: "relative", display: "flex" }}>
                <CheckFilled size={26} />
                {sentPulse > 0 && (
                  <ConfirmRing progress={sentPulse} color={colors.green} size={56} />
                )}
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>
                Delivered to team
              </span>
              <span style={{ fontSize: 15, color: colors.inkSoft }}>
                Monday, 9:00 AM · recurring weekly
              </span>
              <span style={{ marginLeft: "auto" }}>
                <Badge text="Sent" tone="green" />
              </span>
            </div>

            {rich && (
              <LightSweep
                progress={reveal(frame, 80, 22)}
                color="rgba(122,162,255,0.16)"
                width={30}
              />
            )}
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={[
          "Cash flow, pipeline movement, sales activity —",
          "already packaged, already sent.",
        ]}
        enter={8}
        exitStart={118}
        exitDur={10}
        size={48}
        accentLast
      />
    </AbsoluteFill>
  );
};
