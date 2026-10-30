import TechText from "./TechText/TechText";
import { site } from "../site";

// Big interactive wordmark: hovering a letter turns it into a dashed outline inside a measured selection frame;
// letters can be dragged off the baseline or clicked to kick. It follows the theme through currentColor.
export default function Wordmark() {
  return (
    <div className="h-36 sm:h-48 lg:h-56 text-fg print:hidden">
      <TechText
        text={site.brand}
        fontWeight={700}
        fontSize={150}
        letterSpacing={-0.05}
        align="center"
        reveal="letter"
        dashLength={4}
        dashGap={2}
        specks={15}
        // Types itself out under the selection frame the first time it scrolls into view
        intro="type"
        introDuration={2}
        clickKick
        draggable
        guides={false}
        sweep
      />
    </div>
  );
}
