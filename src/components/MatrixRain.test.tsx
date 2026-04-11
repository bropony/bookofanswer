import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import MatrixRain from "@/components/MatrixRain";
import type { Answer } from "@/types/answer";

const mockAnswer: Answer = {
  answer: { zh: "随缘自在", en: "Be at ease" },
  interpretation: { zh: "命里有时", en: "What is yours" },
};

describe("MatrixRain", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when answers array is empty", () => {
    const { container } = render(
      <MatrixRain
        answers={[]}
        finalAnswer={mockAnswer}
        color="#d4a849"
        onComplete={() => {}}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when finalAnswer is null", () => {
    const { container } = render(
      <MatrixRain
        answers={[mockAnswer]}
        finalAnswer={null}
        color="#d4a849"
        onComplete={() => {}}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("calls onComplete after reveal delay", () => {
    const onComplete = vi.fn();
    render(
      <MatrixRain
        answers={[mockAnswer]}
        finalAnswer={mockAnswer}
        color="#d4a849"
        onComplete={onComplete}
      />
    );

    vi.advanceTimersByTime(1800 + 600);
    expect(onComplete).toHaveBeenCalled();
  });

  it("respects max column cap on wide screens", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 3000,
      configurable: true,
    });

    const onComplete = vi.fn();
    const { container } = render(
      <MatrixRain
        answers={[mockAnswer]}
        finalAnswer={mockAnswer}
        color="#d4a849"
        onComplete={onComplete}
      />
    );

    // 3000 / 50 = 60 raw columns, capped at 40
    const columns = container.querySelectorAll(".absolute");
    expect(columns.length).toBeLessThanOrEqual(40);
  });
});
