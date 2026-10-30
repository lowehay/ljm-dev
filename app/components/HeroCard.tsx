"use client";

import ProfileCard from "./ProfileCard/ProfileCard";
import AvatarReveal from "./AvatarReveal";
import { useTheme } from "./useTheme";

// ProfileCard frame around the pixel/photo avatar: the card tilts and catches the light,
// while the avatar inside keeps its hover lens and tap-to-dissolve
export default function HeroCard() {
  const theme = useTheme() ?? "dark";
  const light = theme === "light";

  return (
    <ProfileCard
      photo={<AvatarReveal />}
      // Name and role already sit beside the card in the hero, so the photo stays clean
      name=""
      title=""
      handle="lowehay"
      // Short enough to fit beside the Contact button in the 256px card
      status="Full-Stack Dev"
      statusColor={light ? "#525252" : "#a3a3a3"}
      contactText="Contact"
      onContactClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
      theme={theme}
      // No rainbow foil, to keep the site monochrome; the white glare still follows the cursor
      holo={0}
      glare={0.5}
      tiltStrength={12}
      parallax={8}
      radius={16}
      enableTilt
      intro
      showUserInfo
      enableMobileTilt={false}
      className="profile-card--compact"
    />
  );
}
