type ErrorContext = Record<string, string | number | boolean>;

/**
 * Report an error with optional context.
 * Swap in Sentry.captureException or similar in production.
 */
export function reportError(error: Error, context?: ErrorContext): void {
  if (process.env.NODE_ENV === "production") {
    console.error("[monitoring]", error.message, context);
  } else {
    console.error("[monitoring:dev]", error, context);
  }
}

/**
 * Report an error tied to a specific app phase.
 */
export function reportPhaseError(phase: string, error: Error): void {
  reportError(error, {
    phase,
    url: typeof window !== "undefined" ? window.location.href : "ssr",
  });
}
