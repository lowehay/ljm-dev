// Types for the React Bits ClickSpark component (ClickSpark.jsx)
import type { CSSProperties, ReactElement, ReactNode } from "react";

export interface ClickSparkProps {
  sparkColor?: string | string[];
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  sparkWidth?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
  shape?: "line" | "streak" | "dot" | "star";
  randomness?: number;
  gravity?: number;
  spread?: number;
  direction?: number;
  glow?: number;
  ring?: boolean;
  layer?: "front" | "back";
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function ClickSpark(props: ClickSparkProps): ReactElement;
