import React from "react";

// The Permute mark: a glossy blue gradient sphere with a soft top highlight.
export const Sphere: React.FC<{ size?: number; glow?: number }> = ({
  size = 34,
  glow = 1,
}) => {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#eaf1ff" />
          <stop offset="28%" stopColor="#a9c2ff" />
          <stop offset="62%" stopColor="#5b86f4" />
          <stop offset="100%" stopColor="#1f44b0" />
        </radialGradient>
        <radialGradient id={`${id}-hi`} cx="36%" cy="26%" r="34%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(90,134,244,0.55)" />
          <stop offset="100%" stopColor="rgba(90,134,244,0)" />
        </radialGradient>
      </defs>
      {glow > 0 && (
        <circle
          cx="50"
          cy="52"
          r="56"
          fill={`url(#${id}-glow)`}
          opacity={glow}
        />
      )}
      <circle cx="50" cy="50" r="42" fill={`url(#${id}-body)`} />
      <ellipse cx="40" cy="34" rx="22" ry="16" fill={`url(#${id}-hi)`} />
      <ellipse
        cx="60"
        cy="70"
        rx="20"
        ry="10"
        fill="rgba(13,32,96,0.35)"
        opacity={0.5}
      />
    </svg>
  );
};
