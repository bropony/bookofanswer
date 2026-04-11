"use client";

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { reportError } from "@/lib/monitoring";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack ?? "unknown" });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-black gap-6">
          <p className="text-lg text-gray-400 text-center">
            出了点问题，请刷新页面
            <br />
            <span className="text-sm opacity-60">Something went wrong. Please refresh.</span>
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 rounded-lg text-gray-300 border border-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
          >
            重试 Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
