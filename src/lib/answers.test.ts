import { describe, it, expect } from "vitest";
import {
  pickRandomAnswer,
  pickRandomCategory,
  getNextCategory,
  isValidAnswer,
  validateAnswerBook,
  FALLBACK_ANSWER,
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  HINTS,
} from "@/lib/answers";
import type { Answer } from "@/types/answer";

const mockAnswer: Answer = {
  answer: { zh: "测试答案", en: "Test answer" },
  interpretation: { zh: "测试解语", en: "Test interpretation" },
};

const mockAnswers: Answer[] = [
  mockAnswer,
  {
    answer: { zh: "第二个答案", en: "Second answer" },
    interpretation: { zh: "第二个解语", en: "Second interpretation" },
  },
];

describe("pickRandomAnswer", () => {
  it("returns fallback when answer list is empty", () => {
    const result = pickRandomAnswer([]);
    expect(result).toEqual(FALLBACK_ANSWER);
  });

  it("returns a valid answer from the list", () => {
    const result = pickRandomAnswer(mockAnswers);
    expect(mockAnswers).toContain(result);
  });

  it("returns the only answer when list has one item", () => {
    const result = pickRandomAnswer([mockAnswer]);
    expect(result).toBe(mockAnswer);
  });
});

describe("pickRandomCategory", () => {
  it("returns a valid category", () => {
    const result = pickRandomCategory();
    expect(ALL_CATEGORIES).toContain(result);
  });

  it("returns all categories over many calls (statistical)", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(pickRandomCategory());
    }
    expect(seen.size).toBe(ALL_CATEGORIES.length);
  });
});

describe("getNextCategory", () => {
  it("cycles through categories in order", () => {
    expect(getNextCategory("buddhist")).toBe("confucian");
    expect(getNextCategory("confucian")).toBe("taoist");
    expect(getNextCategory("taoist")).toBe("metaphysical");
    expect(getNextCategory("metaphysical")).toBe("buddhist");
  });

  it("wraps around from last to first", () => {
    expect(getNextCategory("metaphysical")).toBe("buddhist");
  });
});

describe("constants", () => {
  it("CATEGORY_COLORS has entries for all categories", () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_COLORS[cat]).toBeDefined();
      expect(CATEGORY_COLORS[cat]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("HINTS has bilingual entries for all categories", () => {
    for (const cat of ALL_CATEGORIES) {
      expect(HINTS[cat]).toBeDefined();
      expect(HINTS[cat].zh).toBeTruthy();
      expect(HINTS[cat].en).toBeTruthy();
    }
  });

  it("ALL_CATEGORIES contains exactly 4 categories", () => {
    expect(ALL_CATEGORIES).toHaveLength(4);
    expect(ALL_CATEGORIES).toEqual(["buddhist", "confucian", "taoist", "metaphysical"]);
  });
});

describe("isValidAnswer", () => {
  it("accepts a valid answer object", () => {
    expect(isValidAnswer(mockAnswer)).toBe(true);
  });

  it("rejects null", () => {
    expect(isValidAnswer(null)).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(isValidAnswer("string")).toBe(false);
    expect(isValidAnswer(42)).toBe(false);
    expect(isValidAnswer(undefined)).toBe(false);
  });

  it("rejects missing answer field", () => {
    expect(isValidAnswer({ interpretation: { zh: "a", en: "b" } })).toBe(false);
  });

  it("rejects missing interpretation field", () => {
    expect(isValidAnswer({ answer: { zh: "a", en: "b" } })).toBe(false);
  });

  it("rejects answer with missing language", () => {
    expect(isValidAnswer({ answer: { zh: "a" }, interpretation: { zh: "a", en: "b" } })).toBe(false);
    expect(isValidAnswer({ answer: { zh: "a", en: "b" }, interpretation: { en: "b" } })).toBe(false);
  });

  it("rejects answer with non-string fields", () => {
    expect(isValidAnswer({ answer: { zh: 1, en: "b" }, interpretation: { zh: "a", en: "b" } })).toBe(false);
  });
});

describe("validateAnswerBook", () => {
  it("extracts valid answers from a well-formed book", () => {
    const book = {
      category: "buddhist",
      label: { zh: "佛风", en: "Buddhist Wisdom" },
      answers: mockAnswers,
    };
    expect(validateAnswerBook(book)).toEqual(mockAnswers);
  });

  it("filters out invalid answers", () => {
    const book = {
      answers: [
        mockAnswer,
        { bad: "data" },
        { answer: { zh: "only zh" }, interpretation: { zh: "a", en: "b" } },
      ],
    };
    const result = validateAnswerBook(book);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockAnswer);
  });

  it("returns empty array for null input", () => {
    expect(validateAnswerBook(null)).toEqual([]);
  });

  it("returns empty array when answers field is missing", () => {
    expect(validateAnswerBook({ category: "buddhist" })).toEqual([]);
  });

  it("returns empty array when answers field is not an array", () => {
    expect(validateAnswerBook({ answers: "not an array" })).toEqual([]);
  });
});
