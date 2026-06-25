import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { Sphere } from "../components/Sphere";
import { LightSweep, SoftRing } from "../components/Motion";
import { SectionLabel, SourceChip, MetricCard, Badge } from "./parts";
import { easeOut, easeInOut, reveal } from "../anim";

const SOURCES = ["Deals", "Pipeline Stages", "Companies", "Associations"];

const METRICS = [
  { label: "Pipeline closed", value: "$763,572", accent: colors.blue },
  { label: "Cash collected", value: "$271,253", accent: colors.green },
  { label: "Outstanding invoices", value: "$332,918", accent: colors.orange },
];

export const RBeat1Reports: React.FC<{ rich: boolean }> = ({ rich }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 60], [1.0, 1.05], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [54, 66], [1, 0], {
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
        <AppWindow width={1240} height={700}>
          <div
            style={{
              padding: "28px 34px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              position: "relative",
            }}
          >
            <div style={{ fontSize: 14, color: colors.inkMuted }}>
              Reports <span style={{ opacity: 0.5 }}>/</span> Weekly
              Contract-to-Cash
            </div>

            {/* title row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginTop: -8,
              }}
            >
              <div style={{ position: "relative", display: "flex" }}>
                {rich && <SoftRing size={50} opacity={0.16} />}
                <Sphere size={30} glow={rich ? 0.5 : 0} />
              </div>
              <div
                style={{ fontSize: 27, fontWeight: 700, color: colors.ink }}
              >
                Weekly Contract-to-Cash
              </div>
              <div style={{ marginLeft: 10, opacity: reveal(frame, 20, 12) }}>
                <Badge text="Auto-generated" tone="green" />
              </div>
            </div>

            {/* data sources */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <SectionLabel>Data Sources</SectionLabel>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {SOURCES.map((s, i) => (
                  <SourceChip
                    key={s}
                    label={s}
                    appear={reveal(frame, 6 + i * 4, 12)}
                  />
                ))}
              </div>
            </div>

            {/* overview */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionLabel>Overview</SectionLabel>
              <div
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.55,
                  color: colors.inkSoft,
                  maxWidth: 980,
                  opacity: reveal(frame, 16, 16),
                }}
              >
                Classifies each deal by stage and payment status to produce a
                weekly contract-to-cash report — pipeline metrics, open and
                at-risk deals, alerts for finance and sales.
              </div>
            </div>

            {/* metric cards forming */}
            <div style={{ display: "flex", gap: 18, marginTop: 2 }}>
              {METRICS.map((m, i) => (
                <MetricCard
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  accent={m.accent}
                  appear={reveal(frame, 28 + i * 6, 16)}
                />
              ))}
            </div>

            {rich && (
              <LightSweep
                progress={reveal(frame, 40, 20)}
                color="rgba(122,162,255,0.18)"
                width={32}
              />
            )}
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["Reports that keep running."]}
        enter={6}
        exitStart={52}
        size={64}
      />
    </AbsoluteFill>
  );
};
