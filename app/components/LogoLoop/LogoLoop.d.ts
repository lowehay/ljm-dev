// Types for the React Bits LogoLoop component (LogoLoop.jsx)
import type { CSSProperties, ReactElement, ReactNode } from "react";

export type LogoItem =
  | { node: ReactNode; title?: string; href?: string; ariaLabel?: string }
  | { src: string; srcSet?: string; alt?: string; title?: string; href?: string; width?: number; height?: number };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutWidth?: number;
  scaleOnHover?: boolean;
  layout?: string;
  bend?: number;
  focus?: number;
  magnify?: number;
  tiltX?: number;
  tiltY?: number;
  step?: boolean;
  muted?: number;
  labels?: "none" | "inline" | "below" | "hover";
  draggable?: boolean;
  scrollBoost?: number;
  intro?: boolean;
  renderItem?: (item: LogoItem, key: string) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export const LogoLoop: (props: LogoLoopProps) => ReactElement;
export default LogoLoop;
