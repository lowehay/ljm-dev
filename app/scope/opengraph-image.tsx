import { ogCard, ogSize } from "../og";

export const alt = "Scope your project with Louie Jae Maravillosa";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Project scoper",
    title: "Scope your project",
    subtitle: "Pick what you want to build, get a rough timeline, and send it over in one click.",
    tags: ["Websites", "Web apps", "Dashboards", "AI features"],
  });
}
