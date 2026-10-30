import type { CSSProperties, JSX, ReactNode } from "react";

// Types for the React Bits GooeyNav component (GooeyNav.jsx)
export interface GooeyNavItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface GooeyNavProps {
  items?: GooeyNavItem[];
  initialActiveIndex?: number;
  activeIndex?: number;
  onChange?: (index: number, item: GooeyNavItem) => void;
  theme?: "dark" | "light";
  color?: string;
  activeTextColor?: string;
  colors?: string[];
  size?: "sm" | "md" | "lg";
  frame?: boolean;
  animationTime?: number;
  particleCount?: number;
  spread?: number;
  timeVariance?: number;
  gooeyness?: number;
  wobble?: number;
  hoverEffect?: boolean;
  className?: string;
  // CSS custom properties such as --gn-frame are allowed alongside regular styles
  style?: CSSProperties & Record<`--${string}`, string>;
}

declare const GooeyNav: (props: GooeyNavProps) => JSX.Element;
export default GooeyNav;
