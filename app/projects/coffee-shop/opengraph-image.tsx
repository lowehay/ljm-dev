import { ogCard, ogSize } from "../../og";
import { projects } from "../../data";

const project = projects.find((p) => p.caseStudy === "/projects/coffee-shop")!;

export const alt = `${project.title} case study`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Case study",
    title: project.title,
    subtitle: "Drinks are made from recipes, so selling one deducts its ingredients from stock, safely.",
    tags: project.tech,
  });
}
