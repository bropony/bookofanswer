export type AnswerCategory = "buddhist" | "confucian" | "taoist" | "metaphysical";

export interface Answer {
  answer: {
    zh: string;
    en: string;
  };
  interpretation: {
    zh: string;
    en: string;
  };
}

export interface AnswerBook {
  category: AnswerCategory;
  label: {
    zh: string;
    en: string;
  };
  answers: Answer[];
}

export type AppPhase = "loading" | "idle" | "dropping" | "revealed" | "error";
