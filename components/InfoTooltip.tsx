"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  content: string;
  side?: "bottom" | "top";
}

interface PopupPos {
  top: number;
  left: number;
  arrowLeft: number;
  width: number;
  openUp: boolean;
}

const POPUP_W = 256;
const POPUP_MIN_W = 180;
const ESTIMATED_POPUP_H = 168;
const MARGIN = 8;

export default function InfoTooltip({
  content,
  side = "bottom",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopupPos | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click / tap-away
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        popupRef.current &&
        !popupRef.current.contains(target)
      ) {
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

  const computePos = useCallback((): PopupPos | null => {
    if (!buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const popupW = Math.max(POPUP_MIN_W, Math.min(POPUP_W, vw - MARGIN * 2));

    // Center around trigger and clamp into viewport.
    let left = rect.left + rect.width / 2 - popupW / 2;
    left = Math.min(left, vw - popupW - MARGIN);
    left = Math.max(left, MARGIN);

    // Arrow points to trigger center, still clamped within popup body.
    const arrowLeft = Math.max(
      6,
      Math.min(rect.left + rect.width / 2 - left - 4, popupW - 14),
    );

    const spaceBelow = vh - rect.bottom - MARGIN;
    const spaceAbove = rect.top - MARGIN;
    const preferUp = side === "top";

    const canOpenUp = spaceAbove >= ESTIMATED_POPUP_H;
    const canOpenDown = spaceBelow >= ESTIMATED_POPUP_H;

    let openUp = preferUp;
    if (preferUp && !canOpenUp) openUp = spaceAbove > spaceBelow;
    if (!preferUp && !canOpenDown) openUp = spaceAbove > spaceBelow;

    let top = openUp ? rect.top - 10 - ESTIMATED_POPUP_H : rect.bottom + 10;
    top = Math.max(MARGIN, Math.min(top, vh - ESTIMATED_POPUP_H - MARGIN));

    return { top, left, arrowLeft, width: popupW, openUp };
  }, [side]);

  const handleOpen = () => {
    const p = computePos();
    setPos(p);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const syncPosition = () => {
      const next = computePos();
      if (next) setPos(next);
    };
    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);
    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [open, computePos]);

  const popup =
    open && pos
      ? createPortal(
          <span
            ref={popupRef}
            role="tooltip"
            style={{
              position: "fixed",
              zIndex: 9999,
              width: pos.width,
              left: pos.left,
              top: pos.top,
              maxHeight: `calc(100vh - ${MARGIN * 2}px)`,
              overflowY: "auto",
            }}
            className="bg-zinc-950 text-white text-[11px] leading-relaxed p-3 shadow-xl"
            onMouseEnter={cancelClose}
            onMouseLeave={startClose}
          >
            {content}
            <span
              className={`absolute w-2 h-2 bg-zinc-950 rotate-45 ${pos.openUp ? "bottom-[-4px]" : "top-[-4px]"}`}
              style={{ left: pos.arrowLeft }}
            />
          </span>,
          document.body,
        )
      : null;

  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          handleOpen();
        }}
        onMouseEnter={() => {
          cancelClose();
          handleOpen();
        }}
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
