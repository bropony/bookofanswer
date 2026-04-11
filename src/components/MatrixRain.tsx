"use client";

import { useEffect, useRef, useState } from "react";
import type { Answer } from "@/types/answer";
import { ANIM } from "@/lib/constants";

interface MatrixRainProps {
  answers: Answer[];
  finalAnswer: Answer | null;
  color: string;
  onComplete: () => void;
}

interface Column {
  id: number;
  x: number;
  speed: number;
  texts: string[];
  opacity: number;
  isFinal: boolean;
}

export default function MatrixRain({
  answers,
  finalAnswer,
  color,
  onComplete,
}: MatrixRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [finalRevealed, setFinalRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (answers.length === 0 || !finalAnswer) return;

    const rawColumns = Math.floor(window.innerWidth / ANIM.MATRIX_COLUMN_SPACING_PX);
    const numColumns = Math.min(rawColumns, ANIM.MATRIX_MAX_COLUMNS);
    const cols: Column[] = [];

    for (let i = 0; i < numColumns; i++) {
      const isFinal = i === Math.floor(numColumns / 2);
      const randomAnswers = Array.from(
        { length: 8 },
        () => {
          const a = answers[Math.floor(Math.random() * answers.length)];
          return a?.answer.zh || "";
        }
      );

      if (isFinal) {
        randomAnswers[3] = finalAnswer.answer.zh;
      }

      cols.push({
        id: i,
        x: i * ANIM.MATRIX_COLUMN_SPACING_PX + Math.floor(ANIM.MATRIX_COLUMN_SPACING_PX / 2),
        speed: 0.5 + Math.random() * 1.5,
        texts: randomAnswers,
        opacity: isFinal ? 1 : 0.3 + Math.random() * 0.4,
        isFinal,
      });
    }

    setColumns(cols);
    startTimeRef.current = Date.now();

    const timer = setTimeout(() => {
      setFinalRevealed(true);
      setTimeout(onComplete, ANIM.MATRIX_REVEAL_TRANSITION_MS);
    }, ANIM.MATRIX_REVEAL_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [answers, finalAnswer, onComplete]);

  if (!mounted || columns.length === 0) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-5 overflow-hidden pointer-events-none">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute"
          style={{
            left: `${col.x}px`,
            writingMode: "vertical-rl",
            textOrientation: "upright",
            fontSize: col.isFinal && finalRevealed ? "28px" : "16px",
            color: col.isFinal && finalRevealed ? color : `${color}90`,
            opacity: col.isFinal && finalRevealed ? 1 : col.opacity,
            lineHeight: "1.5",
            animation: `matrixFall ${ANIM.MATRIX_FALL_BASE_DURATION_S / col.speed}s linear forwards`,
            fontWeight: col.isFinal ? "bold" : "normal",
            transition: "font-size 0.5s, opacity 0.5s",
          }}
        >
          {col.texts.map((text, i) => (
            <span
              key={i}
              style={{
                opacity: col.isFinal && finalRevealed
                  ? i === 3 ? 1 : 0.1
                  : 1 - i * 0.08,
              }}
            >
              {text}
            </span>
          ))}
        </div>
      ))}

      {/* Final answer center display */}
      {finalRevealed && finalAnswer && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-4xl font-bold text-center answer-reveal px-8"
            style={{ color }}
          >
            {finalAnswer.answer.zh}
          </div>
        </div>
      )}
    </div>
  );
}
