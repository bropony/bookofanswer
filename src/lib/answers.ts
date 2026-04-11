import type { Answer, AnswerCategory, AnswerBook } from "@/types/answer";

export const CATEGORY_COLORS: Record<AnswerCategory, string> = {
  buddhist: "#d4a849",
  confucian: "#8b4513",
  taoist: "#2e8b57",
  metaphysical: "#6a0dad",
};

export const HINTS: Record<AnswerCategory, { zh: string; en: string }> = {
  buddhist: { zh: "心无挂碍，答案自来", en: "With an unburdened heart, answers reveal themselves" },
  confucian: { zh: "正心诚意，问必有答", en: "With sincerity of heart, every question finds its answer" },
  taoist: { zh: "道法自然，顺应天意", en: "The Way follows nature, align with the heavenly will" },
  metaphysical: { zh: "冥冥之中，自有定数", en: "In the unseen realm, destiny has its design" },
};

export const ALL_CATEGORIES: AnswerCategory[] = ["buddhist", "confucian", "taoist", "metaphysical"];

export const FALLBACK_ANSWER: Answer = {
  answer: { zh: "缘未到，再问一次", en: "The time has not come, ask again" },
  interpretation: { zh: "命里有时终须有，命里无时莫强求", en: "What is yours will come in time; what is not, let it be" },
};

/**
 * Validate that an answer object has the required structure.
 */
export function isValidAnswer(data: unknown): data is Answer {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  const answer = obj.answer;
  const interpretation = obj.interpretation;
  if (typeof answer !== "object" || answer === null) return false;
  if (typeof interpretation !== "object" || interpretation === null) return false;
  const a = answer as Record<string, unknown>;
  const i = interpretation as Record<string, unknown>;
  return typeof a.zh === "string" && typeof a.en === "string" &&
    typeof i.zh === "string" && typeof i.en === "string";
}

/**
 * Validate and parse a loaded answer book JSON.
 * Returns valid answers only, filtering out malformed entries.
 */
export function validateAnswerBook(data: unknown): Answer[] {
  if (typeof data !== "object" || data === null) return [];
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.answers)) return [];
  return obj.answers.filter(isValidAnswer);
}

/**
 * Load and validate answers for a single category.
 */
export async function loadCategoryAnswers(category: AnswerCategory): Promise<Answer[]> {
  const res = await fetch(`/answers/${category}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load ${category} answers: ${res.status}`);
  }
  const data: unknown = await res.json();
  return validateAnswerBook(data);
}

/**
 * Load answers for all categories.
 * Returns a map of category -> answers, with empty arrays for failed loads.
 */
export async function loadAllAnswers(): Promise<Record<AnswerCategory, Answer[]>> {
  const results = await Promise.allSettled(
    ALL_CATEGORIES.map(async (cat) => {
      const answers = await loadCategoryAnswers(cat);
      return { cat, answers };
    })
  );

  const loaded: Record<AnswerCategory, Answer[]> = {
    buddhist: [],
    confucian: [],
    taoist: [],
    metaphysical: [],
  };

  let hasAnyFailure = false;
  for (const result of results) {
    if (result.status === "fulfilled") {
      loaded[result.value.cat] = result.value.answers;
    } else {
      hasAnyFailure = true;
    }
  }

  // If all categories failed, throw to signal a total failure
  const totalAnswers = Object.values(loaded).flat().length;
  if (totalAnswers === 0 && hasAnyFailure) {
    throw new Error("Failed to load any answer data");
  }

  return loaded;
}

/**
 * Pick a random answer from a given category's answer list.
 * Returns a fallback answer if the list is empty.
 */
export function pickRandomAnswer(answers: Answer[]): Answer {
  if (answers.length === 0) return FALLBACK_ANSWER;
  return answers[Math.floor(Math.random() * answers.length)];
}

/**
 * Pick a random category from all available categories.
 */
export function pickRandomCategory(): AnswerCategory {
  return ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)];
}

/**
 * Get the next category in the cycling order.
 */
export function getNextCategory(current: AnswerCategory): AnswerCategory {
  const idx = ALL_CATEGORIES.indexOf(current);
  return ALL_CATEGORIES[(idx + 1) % ALL_CATEGORIES.length];
}
