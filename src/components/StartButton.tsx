"use client";

interface StartButtonProps {
  glowColor: string;
  onClick: () => void;
}

export default function StartButton({ glowColor, onClick }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="开始寻求答案"
      className="start-button relative w-40 h-40 rounded-full flex flex-col items-center justify-center cursor-pointer border-none outline-none transition-colors duration-1000"
      style={
        {
          "--glow-color": glowColor,
          backgroundColor: `${glowColor}15`,
          color: glowColor,
          border: `2px solid ${glowColor}50`,
        } as React.CSSProperties
      }
    >
      <span className="text-3xl font-bold">向心而问</span>
      <span className="text-xs opacity-60 mt-1">Inquire</span>

      {/* Inner glow ring */}
      <div
        className="absolute inset-2 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
        }}
      />
    </button>
  );
}
