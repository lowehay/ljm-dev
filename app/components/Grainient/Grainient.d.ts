import type { CSSProperties, HTMLAttributes, JSX } from "react";

// Types for the React Bits Grainient component (Grainient.jsx); every prop is optional
export interface GrainientProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "className"> {
  colors?: string[];
  type?: "linear" | "radial";
  angle?: number;
  bands?: number;
  softness?: number;
  flow?: number;
  scale?: number;
  speed?: number;
  silk?: number;
  grainAmount?: number;
  grainSize?: number;
  grainAnimated?: boolean;
  contrast?: number;
  saturation?: number;
  variation?: number;
  interactive?: boolean;
  stir?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare const Grainient: (props: GrainientProps) => JSX.Element;
export default Grainient;
