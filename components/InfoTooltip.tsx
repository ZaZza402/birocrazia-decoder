"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  content: string;
  side?: "bottom" | "top";
}

interface PopupPos {
  top: number;
  left: number;
  arrowLeft: number;
  openUp: boolean;
}

const POPUP_W = 256;
const MARGIN = 8;

export default function InfoTooltip({
  content,
  side = "bottom",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopupPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close on outside click / tap-away
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const startClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const computePos = (): PopupPos | null => {
    if (!buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: clamp so popup stays inside viewport with MARGIN on each side
    let left = rect.left;
    left = Math.min(left, vw - POPUP_W - MARGIN);
    left = Math.max(left, MARGIN);

    // Arrow position relative to popup left edge (points at the button center)
    const arrowLeft = Math.max(6, Math.min(rect.left + rect.width / 2 - left - 4, POPUP_W - 14));

    // Vertical: prefer side prop, but flip if not enough space
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = side === "top"
      ? spaceAbove >= 120 || spaceAbove > spaceBelow
      : spaceBelow < 120 && spaceAbove > spaceBelow;

    const top = openUp
      ? rect.top - 8   // will be shifted up by CSS (bottom: calc(100vh - top))
      : rect.bottom + 8;

    return { top, left, arrowLeft, openUp };
  };

  const handleOpen = () => {
    const p = computePos();
    setPos(p);
    setOpen(true);
  };

  const popup = open && pos && mounted ? createPortal(
    <span
      role="tooltip"
      style={{
        position: "fixed",
        zIndex: 9999,
        width: POPUP_W,
        left: pos.left,
        ...(pos.openUp
          ? { bottom: window.innerHeight - pos.top }
          : { top: pos.top }),
      }}
      className="bg-zinc-950 text-white text-[11px] leading-relaxed p-3 shadow-xl pointer-events-none"
      onMouseEnter={cancelClose}
      onMouseLeave={startClose}
    >
      {content}
      <span
        className={`absolute w-2 h-2 bg-zinc-950 rotate-45 ${pos.openUp ? "bottom-[-4px]" : "top-[-4px]"}`}
        style={{ left: pos.arrowLeft }}
      />
    </span>,
    document.body
  ) : null;

  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { open ? setOpen(false) : handleOpen(); }}
        onMouseEnter={() => { cancelClose(); handleOpen(); }}
        onMouseLeave={startClose}
        aria-label="Informazioni"
        className="w-3.5 h-3.5 rounded-full border border-zinc-400 text-zinc-400 hover:border-zinc-700 hover:text-zinc-700 transition-colors flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ fontSize: "9px", lineHeight: 1, fontWeight: 700 }}
      >
        i
      </button>
      {popup}
    </span>
  );
}

