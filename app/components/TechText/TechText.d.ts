import type { CSSProperties, JSX } from "react";

// Types for the React Bits TechText component (TechText.jsx); every prop is optional
export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  align?: "left" | "center" | "right";
  color?: string;
  accentColor?: string;
  reveal?: "area" | "letter" | "off";
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  lineStyle?: "dashed" | "solid";
  strokeWidth?: number;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  clickKick?: boolean;
  intro?: "none" | "type" | "assemble" | "metrics";
  introDuration?: number;
  guides?: boolean;
  sweep?: boolean;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

declare const TechText: (props: TechTextProps) => JSX.Element;
export default TechText;
