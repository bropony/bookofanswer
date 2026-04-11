"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Answer, AnswerCategory, AppPhase } from "@/types/answer";
import StartButton from "@/components/StartButton";
import MatrixRain from "@/components/MatrixRain";
import AnswerDisplay from "@/components/AnswerDisplay";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CATEGORY_COLORS, HINTS, ALL_CATEGORIES, pickRandomAnswer, pickRandomCategory, getNextCategory, loadAllAnswers } from "@/lib/answers";
import { ANIM } from "@/lib/constants";
import { reportPhaseError } from "@/lib/monitoring";

export default function Page() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  );
}

function Home() {
  const [phase, setPhase] = useState<AppPhase>("loading");
  const [currentCategory, setCurrentCategory] = useState<AnswerCategory>("buddhist");
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [allAnswers, setAllAnswers] = useState<Record<AnswerCategory, Answer[]>>({
    buddhist: [],
    confucian: [],
    taoist: [],
    metaphysical: [],
  });
  const [isReversing, setIsReversing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const categoryCycleRef = useRef<NodeJS.Timeout | null>(null);

  // Load answers on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const loaded = await loadAllAnswers();
        if (!cancelled) {
          setAllAnswers(loaded);
          setPhase("idle");
        }
      } catch (err) {
        reportPhaseError("loading", err as Error);
        if (!cancelled) setPhase("error");
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Cycle through categories on idle
  useEffect(() => {
    if (phase === "idle" && !isReversing) {
      categoryCycleRef.current = setInterval(() => {
        setCurrentCategory((prev) => getNextCategory(prev));
      }, ANIM.CATEGORY_CYCLE_MS);
    }
    return () => {
      if (categoryCycleRef.current) clearInterval(categoryCycleRef.current);
    };
  }, [phase, isReversing]);

  const selectAnswer = useCallback(
    (category: AnswerCategory): Answer => {
      return pickRandomAnswer(allAnswers[category]);
    },
    [allAnswers]
  );

  const handleStart = useCallback(() => {
    if (phase === "idle") {
      const randomCat = pickRandomCategory();
      setCurrentCategory(randomCat);
      setSelectedAnswer(selectAnswer(randomCat));
      setPhase("dropping");
    }
  }, [phase, selectAnswer]);

  const handleDropComplete = useCallback(() => {
    setPhase("revealed");
  }, []);

  const handleAskAgain = useCallback(() => {
    setIsReversing(true);
    // Phase 1: shrink out the answer content
    setTimeout(() => {
      setPhase("idle");
      setSelectedAnswer(null);
      setIsReversing(false);
      setIsEntering(true);
      // Phase 2: zoom in the start button
      setTimeout(() => {
        setIsEntering(false);
      }, ANIM.ZOOM_IN_MS);
    }, ANIM.SHRINK_OUT_MS);
  }, []);

  const handleRetry = useCallback(() => {
    setPhase("loading");
    loadAllAnswers()
      .then((loaded) => {
        setAllAnswers(loaded);
        setPhase("idle");
      })
      .catch((err) => {
        reportPhaseError("retry", err as Error);
        setPhase("error");
      });
  }, []);

  const glowColor = CATEGORY_COLORS[currentCategory];
  const hint = HINTS[currentCategory];

  return (
    <main
      className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-black"
      style={{
        transition: "background-color 1s ease",
      }}
      role="main"
    >
      {/* Screen reader announcements for phase changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {phase === "loading" && "载入中 Loading..."}
        {phase === "idle" && hint.zh}
        {phase === "dropping" && "答案正在来临 The answer is coming"}
        {phase === "revealed" && selectedAnswer && `${selectedAnswer.answer.zh}。${selectedAnswer.interpretation.zh}`}
        {phase === "error" && "载入失败，请重试 Failed to load. Please try again."}
      </div>
      {/* Background gradient that changes with category */}
      <div
        className="absolute inset-0 opacity-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Loading state */}
      {phase === "loading" && (
        <div className="flex flex-col items-center gap-4 z-10">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${glowColor}40`, borderTopColor: "transparent" }}
          />
          <p className="text-sm opacity-50 text-gray-400">
            载入中...
            <br />
            <span className="text-xs">Loading...</span>
          </p>
        </div>
      )}

      {/* Error state */}
      {phase === "error" && (
        <div className="flex flex-col items-center gap-6 z-10">
          <p className="text-lg text-gray-400 text-center">
            载入失败，请重试
            <br />
            <span className="text-sm opacity-60">Failed to load. Please try again.</span>
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 rounded-lg text-gray-300 border border-gray-600 hover:border-gray-400 transition-colors cursor-pointer"
          >
            重试 Retry
          </button>
        </div>
      )}

      {/* Matrix rain during dropping phase */}
      {phase === "dropping" && (
        <MatrixRain
          answers={Object.values(allAnswers).flat()}
          finalAnswer={selectedAnswer}
          color={glowColor}
          onComplete={handleDropComplete}
        />
      )}

      {/* Start / Dropping / Revealed button */}
      {phase === "idle" && !isReversing && (
        <div className={`flex flex-col items-center gap-8 z-10 ${isEntering ? "zoom-in" : ""}`}>
          <StartButton
            glowColor={glowColor}
            onClick={handleStart}
          />
          <p
            className="text-lg opacity-70 transition-all duration-1000 text-center max-w-md"
            style={{ color: glowColor }}
          >
            {hint.zh}
            <br />
            <span className="text-base opacity-90">{hint.en}</span>
          </p>
        </div>
      )}

      {/* Dropping button */}
      {phase === "dropping" && <DroppingButton color={glowColor} />}

      {/* Revealed answer — also visible during shrink-out */}
      {phase === "revealed" && selectedAnswer && (
        <div className={`relative z-10 ${isReversing ? "shrink-out" : ""}`}>
          <AnswerDisplay
            answer={selectedAnswer}
            color={glowColor}
            category={currentCategory}
            onAskAgain={handleAskAgain}
          />
        </div>
      )}
    </main>
  );
}

function DroppingButton({ color }: { color: string }) {
  return (
    <div
      className="fixed z-20 px-8 py-4 rounded-lg text-xl font-bold text-center transition-all"
      style={{
        color,
        border: `2px solid ${color}`,
        backgroundColor: `${color}15`,
        animation: `dropToBottom ${ANIM.DROP_TO_BOTTOM_MS / 1000}s ease-in forwards`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      答案随心而晓
      <br />
      <span className="text-sm">Answers arise from within</span>
    </div>
  );
}
