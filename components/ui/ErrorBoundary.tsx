"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Shown instead of the children when rendering fails. */
  fallback?: ReactNode;
  /** Label used in the console for easier debugging. */
  name: string;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates failures. A broken 3D scene or gallery should degrade to a static
 * fallback instead of taking down the whole page.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[${this.props.name}] render failed`, error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback name={this.props.name} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ name }: { name: string }) {
  return (
    <div role="alert" className="glass m-4 rounded-xl p-6 text-sm text-silver-dim">
      This part of the page could not load ({name}). The rest of the portfolio is unaffected; please refresh to try again.
    </div>
  );
}
