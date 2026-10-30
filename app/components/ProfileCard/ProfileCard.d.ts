import type { JSX, NamedExoticComponent, ReactNode } from "react";

// Types for the React Bits ProfileCard component (ProfileCard.jsx); every prop is optional
export interface ProfileCardProps {
  avatarUrl?: string;
  // Local addition: interactive content rendered in place of the photo
  photo?: ReactNode;
  iconUrl?: string;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  statusColor?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  theme?: "dark" | "light";
  backdropColor?: string;
  radius?: number;
  holo?: number;
  glare?: number;
  enableTilt?: boolean;
  tiltStrength?: number;
  parallax?: number;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  intro?: boolean;
  className?: string;
}

declare const ProfileCard: NamedExoticComponent<ProfileCardProps> & ((props: ProfileCardProps) => JSX.Element);
export default ProfileCard;
