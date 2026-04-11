import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StartButton from "@/components/StartButton";

describe("StartButton", () => {
  it("renders the start button with Chinese and English text", () => {
    render(<StartButton glowColor="#d4a849" onClick={() => {}} />);

    expect(screen.getByText("开始")).toBeInTheDocument();
    expect(screen.getByText("Begin")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<StartButton glowColor="#d4a849" onClick={() => { clicked = true; }} />);

    await user.click(screen.getByText("开始"));
    expect(clicked).toBe(true);
  });

  it("applies the glow color to the button", () => {
    render(<StartButton glowColor="#2e8b57" onClick={() => {}} />);

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ color: "#2e8b57" });
  });
});
