// A slow light sweep across text; the gradient and animation live in globals.css (.shiny-text)
export default function ShinyText({ children }: { children: React.ReactNode }) {
  return <span className="shiny-text">{children}</span>;
}
