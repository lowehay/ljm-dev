import { ogCard, ogSize } from "../../og";
import { projects } from "../../data";

const project = projects.find((p) => p.caseStudy === "/projects/kaban")!;

export const alt = `${project.title} case study`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Case study",
    title: project.title,
    subtitle: "A phone-first money app for the Philippines: how much you can safely spend each day until payday.",
    tags: project.tech,
  });
}
