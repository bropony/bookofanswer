import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnswerDisplay from "@/components/AnswerDisplay";
import type { Answer, AnswerCategory } from "@/types/answer";

const mockAnswer: Answer = {
  answer: { zh: "随缘自在", en: "Be at ease with what comes" },
  interpretation: { zh: "命里有时终须有", en: "What is yours will come" },
};

describe("AnswerDisplay", () => {
  it("renders the answer in both languages", () => {
    render(
      <AnswerDisplay
        answer={mockAnswer}
        color="#d4a849"
        category="buddhist"
        onAskAgain={() => {}}
      />
    );

    expect(screen.getByText("随缘自在")).toBeInTheDocument();
    expect(screen.getByText("Be at ease with what comes")).toBeInTheDocument();
  });

  it("renders the interpretation in both languages", () => {
    render(
      <AnswerDisplay
        answer={mockAnswer}
        color="#d4a849"
        category="buddhist"
        onAskAgain={() => {}}
      />
    );

    expect(screen.getByText("命里有时终须有")).toBeInTheDocument();
    expect(screen.getByText("What is yours will come")).toBeInTheDocument();
  });

  it("renders the correct category label", () => {
    render(
      <AnswerDisplay
        answer={mockAnswer}
        color="#d4a849"
        category="taoist"
        onAskAgain={() => {}}
      />
    );

    expect(screen.getByText(/道风/)).toBeInTheDocument();
    expect(screen.getByText(/Taoist Wisdom/)).toBeInTheDocument();
  });

  it("renders the 'ask again' button", () => {
    render(
      <AnswerDisplay
        answer={mockAnswer}
        color="#d4a849"
        category="buddhist"
        onAskAgain={() => {}}
      />
    );

    expect(screen.getByText("再问一次")).toBeInTheDocument();
    expect(screen.getByText("Ask again")).toBeInTheDocument();
  });

  it("calls onAskAgain when button is clicked", async () => {
    const user = userEvent.setup();
    let askedAgain = false;
    render(
      <AnswerDisplay
        answer={mockAnswer}
        color="#d4a849"
        category="buddhist"
        onAskAgain={() => { askedAgain = true; }}
      />
    );

    await user.click(screen.getByText("再问一次"));
    expect(askedAgain).toBe(true);
  });

  it("applies the correct color for each category", () => {
    const categories: { cat: AnswerCategory; color: string }[] = [
      { cat: "buddhist", color: "#d4a849" },
      { cat: "confucian", color: "#8b4513" },
      { cat: "taoist", color: "#2e8b57" },
      { cat: "metaphysical", color: "#6a0dad" },
    ];

    for (const { cat, color } of categories) {
      const { unmount } = render(
        <AnswerDisplay
          answer={mockAnswer}
          color={color}
          category={cat}
          onAskAgain={() => {}}
        />
      );

      const heading = screen.getByText(mockAnswer.answer.zh);
      expect(heading).toHaveStyle({ color });
      unmount();
    }
  });
});
