import { ogCard, ogSize } from "../og";

export const alt = "Notes by Louie Jae Maravillosa";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Notes",
    title: "Real problems, and how I solved them",
    subtitle: "Short write-ups from building web apps: performance, audio, and more.",
  });
}
