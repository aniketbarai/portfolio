"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/**
 * Fades and lifts content into view once. Content is fully visible in the
 * server HTML and under reduced motion (MotionConfig handles the transform).
 */
export function Reveal({ delay = 0, y = 24, children, transition, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay, ...transition }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
