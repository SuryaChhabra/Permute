import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, radii, shadows } from "../theme";
import { AppWindow } from "../components/Stage";
import { Caption } from "../components/Caption";
import { CheckCircle, ConnectorGlyph, SearchIcon } from "../components/Icons";
import { easeOut, easeInOut, reveal } from "../anim";

const PROMPT = `Create a contract-to-cash lifecycle table by reconciling CRM opportunity data with bank transfer / payment data.

Row grain: one row per customer / account.

Join CRM account_name to bank customer_name / payer_name, allowing slight name variations.`;

const SOURCES = [
  { name: "Salesforce CRM", kind: "CRM · Opportunities", tint: "#2a9d6e" },
  { name: "Bank Transfers", kind: "Payments · Ledger", tint: "#e0742a" },
  { name: "Stripe Invoices", kind: "Billing · Invoices", tint: "#5b86f4" },
];

export const Beat1Describe: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow push-in across the whole beat, drifting focus toward the sources card.
  const scale = interpolate(frame, [0, 90], [1.0, 1.085], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const ty = interpolate(frame, [0, 90], [0, -26], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const exit = interpolate(frame, [82, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // Prompt reveals as a soft "type-in" wipe.
  const promptWipe = interpolate(frame, [8, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
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
          transform: `scale(${scale}) translateY(${ty}px) translateY(${(1 - enter) * 24}px)`,
        }}
      >
        <AppWindow width={1240} height={720}>
          <div style={{ display: "flex", height: "100%" }}>
            {/* main column */}
            <div
              style={{
                flex: "1 1 64%",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ fontSize: 14, color: colors.inkMuted }}>
                Data Tables <span style={{ opacity: 0.5 }}>/</span> New Data
                Table
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: colors.ink,
                  marginTop: -6,
                }}
              >
                New Data Table
              </div>

              {/* Step 1 — Describe */}
              <StepHeader
                index={1}
                done
                title="Describe your requirements"
                appear={reveal(frame, 4, 12)}
              />
              <div
                style={{
                  border: `1px solid ${colors.borderStrong}`,
                  borderRadius: radii.card,
                  padding: "18px 20px",
                  background: colors.surface,
                  boxShadow: shadows.card,
                  position: "relative",
                  minHeight: 168,
                }}
              >
                <div
                  style={{
                    fontSize: 16.5,
                    lineHeight: 1.55,
                    color: colors.inkSoft,
                    whiteSpace: "pre-wrap",
                    clipPath: `inset(0 ${(1 - promptWipe) * 100}% 0 0)`,
                  }}
                >
                  {PROMPT}
                </div>
                <Caret visible={promptWipe < 1} wipe={promptWipe} />
              </div>

              {/* Step 2 — Connect sources */}
              <StepHeader
                index={2}
                title="Connect data sources"
                appear={reveal(frame, 30, 12)}
              />
              <div
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.card,
                  background: colors.surface,
                  boxShadow: shadows.card,
                  overflow: "hidden",
                  opacity: reveal(frame, 30, 12),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 14px",
                    margin: 10,
                    borderRadius: 8,
                    background: colors.surfaceMuted,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <SearchIcon />
                  <span style={{ fontSize: 13.5, color: colors.inkFaint }}>
                    Search sources & upstream outputs…
                  </span>
                </div>
                {SOURCES.map((s, i) => (
                  <SourceRow key={s.name} src={s} index={i} frame={frame} />
                ))}
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
                gap: 18,
                background: colors.surfaceMuted,
              }}
            >
              <RailLabel text="Data sources" />
              <RailLabel text="Refresh" muted />
              <div
                style={{
                  height: 1,
                  background: colors.border,
                  margin: "2px 0",
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: colors.inkMuted,
                }}
              >
                TABLE LOGIC
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: colors.inkSoft,
                  opacity: reveal(frame, 18, 16),
                }}
              >
                Reconcile CRM opportunity data with bank transfer / payment
                data.
                <br />
                <br />
                <span style={{ color: colors.inkMuted }}>
                  Row grain: one row per customer / account.
                </span>
              </div>
            </div>
          </div>
        </AppWindow>
      </div>

      <Caption
        lines={["Describe the logic.", "Select the sources."]}
        enter={10}
        exitStart={80}
        size={62}
      />
    </AbsoluteFill>
  );
};

const Caret: React.FC<{ visible: boolean; wipe: number }> = ({
  visible,
  wipe,
}) =>
  visible ? (
    <span
      style={{
        position: "absolute",
        left: `calc(20px + ${wipe * 78}%)`,
        bottom: 26,
        width: 2,
        height: 20,
        background: colors.blue,
      }}
    />
  ) : null;

const StepHeader: React.FC<{
  index: number;
  title: string;
  done?: boolean;
  appear: number;
}> = ({ index, title, done, appear }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 8}px)`,
    }}
  >
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: done ? colors.greenTint : colors.ink,
        color: done ? colors.green : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {done ? "✓" : index}
    </div>
    <span style={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>
      {title}
    </span>
  </div>
);

const SourceRow: React.FC<{
  src: { name: string; kind: string; tint: string };
  index: number;
  frame: number;
}> = ({ src, index, frame }) => {
  const selectAt = 50 + index * 9;
  const sel = interpolate(frame, [selectAt, selectAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "13px 16px",
        borderTop: `1px solid ${colors.border}`,
        background: `rgba(58,109,240,${0.06 * sel})`,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `1.6px solid ${sel > 0.5 ? colors.blue : colors.borderStrong}`,
          background: sel > 0.5 ? colors.blue : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {sel > 0.5 && (
          <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>
        )}
      </div>
      <ConnectorGlyph tint={src.tint} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>
          {src.name}
        </span>
        <span style={{ fontSize: 12.5, color: colors.inkMuted }}>
          {src.kind}
        </span>
      </div>
      <span
        style={{
          marginLeft: "auto",
          fontSize: 12,
          color: colors.inkFaint,
          opacity: 1 - sel * 0.4,
        }}
      >
        Connector
      </span>
      <div style={{ width: 20, opacity: sel }}>
        <CheckCircle size={18} color={colors.blue} />
      </div>
    </div>
  );
};

const RailLabel: React.FC<{ text: string; muted?: boolean }> = ({
  text,
  muted,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12.5,
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: muted ? colors.inkFaint : colors.inkMuted,
      textTransform: "uppercase",
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: `1.5px solid ${colors.borderStrong}`,
      }}
    />
    {text}
  </div>
);
