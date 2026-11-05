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
    subtitle: "A 3D café website where one coffee bean travels with you, from the hero to a brewing timer.",
    tags: project.tech,
  });
}
