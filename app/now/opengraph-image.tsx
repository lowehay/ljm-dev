import { ogCard, ogSize } from "../og";

export const alt = "What Louie Jae Maravillosa is doing now";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Now",
    title: "What I'm doing now",
    subtitle: "A monthly snapshot of what I'm building, writing, and focusing on.",
  });
}
