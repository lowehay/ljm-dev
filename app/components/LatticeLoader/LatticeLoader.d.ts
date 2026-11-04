// Types for the React Bits LatticeLoader component (LatticeLoader.jsx)
import type { CSSProperties } from "react";

export interface LatticeLoaderProps {
  label?: string;
  doneLabel?: string;
  errorLabel?: string;
  status?: "working" | "done" | "error";
  pattern?: string | { cells: (number | null)[]; loop?: number; scale?: number; lit?: 0.25 | 0.35 | 0.45 | 0.62 };
  grid?: 3 | 4;
  shape?: "square" | "round";
  color?: string;
  doneColor?: string;
  errorColor?: string;
  cellSize?: number;
  gap?: number;
  fontSize?: number;
  step?: number;
  idleOpacity?: number;
  glow?: boolean;
  glowColor?: string;
  showTimer?: boolean;
  elapsed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function LatticeLoader(props: LatticeLoaderProps): React.JSX.Element;
