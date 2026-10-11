"use client";

import { MotionConfig } from "motion/react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

/**
 * App-wide client providers. `reducedMotion="user"` makes every Motion
 * transform/layout animation respect the OS-level "reduce motion" setting.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary name="site">{children}</ErrorBoundary>
    </MotionConfig>
  );
}
