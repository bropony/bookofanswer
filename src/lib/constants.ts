/** Animation durations in milliseconds */
export const ANIM = {
  /** Category cycling interval (page.tsx) */
  CATEGORY_CYCLE_MS: 5000,

  /** MatrixRain delay before final reveal */
  MATRIX_REVEAL_DELAY_MS: 1800,

  /** MatrixRain transition after final reveal before onComplete */
  MATRIX_REVEAL_TRANSITION_MS: 600,

  /** MatrixRain base fall duration (seconds, divided by column speed) */
  MATRIX_FALL_BASE_DURATION_S: 2.5,

  /** MatrixRain column spacing in px */
  MATRIX_COLUMN_SPACING_PX: 50,

  /** Max matrix columns (performance cap for wide screens) */
  MATRIX_MAX_COLUMNS: 40,

  /** DroppingButton fall animation */
  DROP_TO_BOTTOM_MS: 2000,

  /** Answer shrink-out on "ask again" */
  SHRINK_OUT_MS: 500,

  /** Start button zoom-in after shrink */
  ZOOM_IN_MS: 500,

  /** AnswerDisplay reveal animation (globals.css .answer-reveal) */
  ANSWER_REVEAL_MS: 600,

  /** StartButton pulse glow cycle (globals.css .start-button) */
  PULSE_GLOW_MS: 3000,
} as const;
