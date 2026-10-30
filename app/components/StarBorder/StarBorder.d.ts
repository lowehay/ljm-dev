import type { CSSProperties, ElementType, JSX, ReactNode } from "react";

// Types for the React Bits StarBorder component (StarBorder.jsx); extra props pass through to the root element
export interface StarBorderProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  color?: string;
  trailColor?: string;
  duration?: number;
  direction?: "clockwise" | "counterclockwise";
  stars?: number;
  trailLength?: number;
  thickness?: number;
  radius?: number;
  glow?: number;
  sparkle?: boolean;
  hover?: "lap" | "brighten" | "reveal" | "none";
  clickPulse?: boolean;
  theme?: "dark" | "light";
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  [prop: string]: unknown;
}

declare const StarBorder: (props: StarBorderProps) => JSX.Element;
export default StarBorder;
