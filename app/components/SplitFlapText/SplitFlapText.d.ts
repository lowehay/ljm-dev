// Types for the React Bits SplitFlapText component (SplitFlapText.jsx)
import type { CSSProperties, ReactElement } from "react";

export interface SplitFlapTextProps {
  words?: string[];
  text?: string;
  flipDuration?: number;
  stagger?: number;
  cycleDelay?: number;
  charset?: string;
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number;
  gap?: number;
  fontSize?: number | string;
  loop?: boolean;
  padTo?: number;
  align?: "left" | "center" | "right";
  intro?: boolean;
  glare?: number;
  depth?: number;
  order?: string;
  tileStyle?: "board" | "minimal";
  className?: string;
  style?: CSSProperties;
}

export default function SplitFlapText(props: SplitFlapTextProps): ReactElement;
