// Types for the React Bits StatusMark component (StatusMark.jsx)
import type { CSSProperties, ReactElement, ReactNode } from "react";

export interface StatusMarkProps {
  status?: "pending" | "running" | "done" | "failed";
  progress?: number;
  label?: ReactNode;
  color?: string;
  doneColor?: string;
  errorColor?: string;
  size?: number;
  strokeWidth?: number;
  dashes?: number;
  fontSize?: number;
  spinDuration?: number;
  arcLength?: number;
  drawDuration?: number;
  fillOpacity?: number;
  strike?: boolean;
  strikeDelay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function StatusMark(props: StatusMarkProps): ReactElement;
