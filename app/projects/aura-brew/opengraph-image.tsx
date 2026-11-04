import { ogCard, ogSize } from "../../og";
import { projects } from "../../data";

const project = projects.find((p) => p.caseStudy === "/projects/aura-brew")!;

export const alt = `${project.title} case study`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Case study",
    title: project.title,
    subtitle: "A scroll-driven 3D landing page where one coffee bean travels through every section.",
    tags: project.tech,
  });
}
