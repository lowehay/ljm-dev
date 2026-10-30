import type { JSX, ReactNode } from "react";

// Types for the React Bits BorderGlow component (BorderGlow.jsx); every prop except children is optional
export interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

declare const BorderGlow: (props: BorderGlowProps) => JSX.Element;
export default BorderGlow;
