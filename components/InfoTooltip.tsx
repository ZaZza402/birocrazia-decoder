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
  const wrapRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click (mobile tap-away)
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

  const positionClass =
    side === "top" ? "bottom-full left-0 mb-2" : "top-full left-0 mt-2";

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex items-center ml-1.5"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={startClose}
    >
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Informazioni"
        className="w-3.5 h-3.5 rounded-full border border-zinc-400 text-zinc-400 hover:border-zinc-700 hover:text-zinc-700 transition-colors flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ fontSize: "9px", lineHeight: 1, fontWeight: 700 }}
      >
        i
      </button>

      {/* Popup */}
      {open && (
        <span
          className={`absolute z-50 w-64 bg-zinc-950 text-white text-[11px] leading-relaxed p-3 shadow-xl ${positionClass}`}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        >
          {content}
          {/* Arrow */}
          <span
            className={`absolute left-3 w-2 h-2 bg-zinc-950 rotate-45 ${
              side === "top" ? "bottom-[-4px]" : "top-[-4px]"
            }`}
          />
        </span>
      )}
    </span>
  );
}
