"use client";
import { useRef } from "react";
import { Roboto_Flex } from "next/font/google";
import VariableProximity from "../common/variable-proximity";
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});
export default function Tranformtext() {
  const ref = useRef(null);
  return (
    <span ref={ref} className="relative">
      <VariableProximity
        label={"transform "}
        className={`bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl italic ${robotoFlex.className}`}
        fromFontVariationSettings="'wght' 300, 'opsz' 8"
        toFontVariationSettings="'wght' 900, 'opsz' 144"
        containerRef={ref}
        radius={100}
        falloff="linear"
      />
    </span>
  );
}
