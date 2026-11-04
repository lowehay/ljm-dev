import { ogCard, ogSize } from "../../og";
import { getPost, posts } from "../posts";

export const alt = "Note by Louie Jae Maravillosa";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogCard({
    eyebrow: "Notes",
    title: post?.title ?? "Notes",
    subtitle: post?.summary ?? "",
    tags: post?.tags,
  });
}
