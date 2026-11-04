// Types for the React Bits PromptBar component (PromptBar.jsx)
import type { ComponentType, ReactNode } from "react";

type Icon = ComponentType<{ size?: number; strokeWidth?: number }> | ReactNode;

export interface PromptBarSource {
  key: string;
  name: string;
  description?: string;
  icon?: Icon;
  attach?: boolean;
}

export interface PromptBarCommand {
  key: string;
  name: string;
  description?: string;
  /** When set, picking the row sends this text straight away */
  prompt?: string;
}

export interface PromptBarModel {
  key: string;
  name: string;
  tag?: string;
}

export interface PromptBarSendOptions {
  attachments: string[];
  model?: PromptBarModel;
  effort: string;
}

export interface PromptBarProps {
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  sources?: PromptBarSource[];
  commands?: PromptBarCommand[];
  models?: PromptBarModel[];
  defaultModel?: string;
  efforts?: string[];
  defaultEffort?: string;
  onEffortChange?: (effort: string) => void;
  busy?: boolean;
  onSend?: (text: string, options: PromptBarSendOptions) => void;
  onStop?: () => void;
  onAttach?: () => string | string[] | Promise<string | string[]>;
  onDictate?: () => string | Promise<string>;
  background?: string;
  color?: string;
  menuBackground?: string;
  borderColor?: string;
  sparkColor?: string;
  sparkBoost?: number;
  width?: number;
  radius?: number;
  maxRows?: number;
  morphDuration?: number;
  squash?: number;
  tilt?: number;
  pressScale?: number;
  autoFocus?: boolean;
  className?: string;
}

export default function PromptBar(props: PromptBarProps): React.JSX.Element;
