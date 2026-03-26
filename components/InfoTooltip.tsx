"use client";
import { useState, useEffect, useRef } from "react";

interface InfoTooltipProps {
  content: string;
  side?: "bottom" | "top";
}

export default function InfoTooltip({
  content,
  side = "bottom",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click / tap-away
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const startClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Measure button position and decide whether popup should open leftward
  const computeAlignment = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // 272 = 256px popup width + 16px safety margin
      setAlignRight(rect.left + 272 > window.innerWidth);
    }
  };

  const verticalClass = side === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const horizontalClass = alignRight ? "right-0" : "left-0";
  const arrowClass = alignRight ? "right-3" : "left-3";

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex items-center ml-1.5"
      onMouseEnter={() => {
        cancelClose();
        computeAlignment();
        setOpen(true);
      }}
      onMouseLeave={startClose}
    >
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!open) computeAlignment();
          setOpen((v) => !v);
        }}
        aria-label="Informazioni"
        className="w-3.5 h-3.5 rounded-full border border-zinc-400 text-zinc-400 hover:border-zinc-700 hover:text-zinc-700 transition-colors flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ fontSize: "9px", lineHeight: 1, fontWeight: 700 }}
      >
        i
      </button>

      {/* Popup */}
      {open && (
        <span
          className={`absolute z-50 w-64 bg-zinc-950 text-white text-[11px] leading-relaxed p-3 shadow-xl ${verticalClass} ${horizontalClass}`}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        >
          {content}
          {/* Arrow — tracks horizontal alignment */}
          <span
            className={`absolute ${arrowClass} w-2 h-2 bg-zinc-950 rotate-45 ${
              side === "top" ? "bottom-[-4px]" : "top-[-4px]"
            }`}
          />
        </span>
      )}
    </span>
  );
}
