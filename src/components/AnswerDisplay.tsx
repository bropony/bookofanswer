"use client";

import type { Answer, AnswerCategory } from "@/types/answer";

const CATEGORY_LABELS: Record<AnswerCategory, { zh: string; en: string }> = {
  buddhist: { zh: "佛", en: "Buddhist Wisdom" },
  confucian: { zh: "儒", en: "Confucian Wisdom" },
  taoist: { zh: "道", en: "Taoist Wisdom" },
  metaphysical: { zh: "玄", en: "Mystical Wisdom" },
};

interface AnswerDisplayProps {
  answer: Answer;
  color: string;
  category: AnswerCategory;
  onAskAgain: () => void;
}

export default function AnswerDisplay({
  answer,
  color,
  category,
  onAskAgain,
}: AnswerDisplayProps) {
  const label = CATEGORY_LABELS[category];

  return (
    <div className="flex flex-col items-center justify-center z-10 max-w-2xl px-6">
      {/* Category label */}
      <div
        className="text-sm mb-8 opacity-50 tracking-widest"
        style={{ color }}
      >
        {label.zh} · {label.en}
      </div>

      {/* Main answer */}
      <div className="answer-reveal text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ color }}
        >
          {answer.answer.zh}
        </h1>
        <p className="text-xl opacity-80 text-gray-300">
          {answer.answer.en}
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-24 h-px mb-8 opacity-30"
        style={{ backgroundColor: color }}
      />

      {/* Interpretation */}
      <div className="text-center mb-12 opacity-80">
        <p className="text-lg italic text-gray-400 mb-2">
          {answer.interpretation.zh}
        </p>
        <p className="text-sm text-gray-500">
          {answer.interpretation.en}
        </p>
      </div>

      {/* Ask again button */}
      <button
        onClick={onAskAgain}
        aria-label="再问一次 Ask again"
        className="px-8 py-3 rounded-lg text-lg transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          color,
          border: `1px solid ${color}60`,
          backgroundColor: `${color}10`,
        }}
      >
        再问一次
        <br />
        <span className="text-sm opacity-60">Ask again</span>
      </button>
    </div>
  );
}
