"use client";
import { motion } from "motion/react";
import { FlipWords } from "./flip-words";

export default function HeroTitle() {
  const text = ["fine-tuned by AI", "perfected", "automated"];
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: [20, -5, 0],
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="text-5xl max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
    >
      {/* <h1 className=""> */}
      Your resume,
      <FlipWords words={text} duration={1000} className="font-extrabold" />
      <br />
      Your career,{" "}
      <span className="relative inline-block font-extrabold">
        <span className="absolute -left-2 text-primary/20">fast-tracked</span>
        <span className="absolute -left-1.75 text-primary/20">
          fast-tracked
        </span>
        <span className="absolute -left-1.5 text-primary/20">fast-tracked</span>
        <span className="absolute -left-1.25 text-primary/20">
          fast-tracked
        </span>
        <span className="absolute -left-1 text-primary/20">fast-tracked</span>
        <span className="absolute -left-0.75 text-primary/40">
          fast-tracked
        </span>
        <span className="relative bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
          fast-tracked
        </span>
      </span>
      {/* <h1 className="bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">
          fast-tracked
        </h1> */}
      {/* </h1> */}
    </motion.div>
  );
}
