import type { CSSProperties, JSX } from "react";

// Types for the React Bits HalftoneReveal component (HalftoneReveal.jsx); every prop is optional
export interface HalftoneRevealProps {
  src?: string;
  fit?: "contain" | "cover";
  mode?: "mono" | "duotone" | "color";
  shape?: "dot" | "ellipse" | "square" | "diamond" | "line" | "cross";
  cellSize?: number;
  angle?: number;
  dotScale?: number;
  inkColor?: string;
  accentColor?: string;
  paperColor?: string;
  contrast?: number;
  brightness?: number;
  invert?: boolean;
  roughness?: number;
  misregistration?: number;
  revealRadius?: number;
  softness?: number;
  linger?: number;
  reverse?: boolean;
  wander?: boolean;
  clickBurst?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const HalftoneReveal: (props: HalftoneRevealProps) => JSX.Element;
export default HalftoneReveal;
