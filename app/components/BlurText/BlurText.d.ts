import type { ElementType, JSX } from "react";

// Types for the React Bits BlurText component (BlurText.jsx); every prop is optional
export interface BlurTextProps {
  text?: string;
  as?: ElementType;
  effect?: "blur" | "zoom" | "tilt" | "focus" | "drift";
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  staggerFrom?: "start" | "center" | "end" | "random";
  trigger?: "view" | "load" | "hover" | "click";
  delay?: number;
  stepDuration?: number;
  loop?: boolean;
  loopDelay?: number;
  blur?: number;
  distance?: number;
  color?: string;
  fromColor?: string;
  focusOnHover?: boolean;
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, unknown>;
  animationTo?: Record<string, unknown>[];
  easing?: unknown;
  className?: string;
  onAnimationComplete?: () => void;
}

declare const BlurText: (props: BlurTextProps) => JSX.Element;
export default BlurText;
