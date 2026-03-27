"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Search,
  Calculator,
  TrendingUp,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import type { LucideIcon } from "lucide-react";

type Step = {
  num: string;
  label: string;
  title: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    num: "01",
    label: "Identifica",
    title: "Codice ATECO",
    desc: "Il coefficiente che determina il tuo netto",
    href: "/calcolatori/ateco",
    Icon: Search,
  },
  {
    num: "02",
    label: "Simula",
    title: "Forfettario vs Ordinario",
    desc: "Il netto con i tuoi numeri reali",
    href: "/calcolatori/forfettario",
    Icon: Calculator,
  },
  {
    num: "03",
    label: "Monitora",
    title: "Tax Cliff Monitor",
    desc: "Traccia il limite mensile dei €100k",
    href: "/calcolatori/cliff",
    Icon: TrendingUp,
  },
  {
    num: "04",
    label: "Pianifica",
    title: "Acconto Imposta",
    desc: "Calcola le rate di Novembre",
    href: "/calcolatori/acconto",
    Icon: Calendar,
  },
  {
    num: "05",
    label: "Emetti",
    title: "Pro-Forma / Avviso di Parcella",
    desc: "Documento di pagamento — fattura solo a incasso",
    href: "/calcolatori/fattura",
    Icon: FileText,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileJourneyDrawer({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const { isInstallable, installApp } = usePWAInstall();

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const activeIdx = STEPS.findIndex((s) => pathname?.startsWith(s.href));

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[199] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Navigazione percorso"
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[200] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-[10px] uppercase tracking-editorial font-semibold text-zinc-400 mb-0.5">
              Percorso guidato
            </p>
            <p className="text-sm text-zinc-950">
              <span className="font-normal">Bur</span>
              <span className="font-black text-red-600">Zero</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi menu"
            className="p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {STEPS.map((s, i) => {
            const isActive = activeIdx === i;
            return (
              <Link
                key={s.num}
                href={s.href}
                onClick={onClose}
                className={`flex items-start gap-3 px-3 py-3.5 border-l-2 transition-colors ${
                  isActive
                    ? "border-red-500 bg-red-50"
                    : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                }`}
              >
                <s.Icon
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isActive ? "text-red-500" : "text-zinc-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[9px] font-mono font-black ${
                        isActive ? "text-red-500" : "text-zinc-400"
                      }`}
                    >
                      {s.num}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-editorial font-semibold ${
                        isActive ? "text-red-600" : "text-zinc-400"
                      }`}
                    >
                      {s.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-[9px] uppercase tracking-wider font-black text-red-500">
                        ← qui
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm font-black leading-tight ${
                      isActive ? "text-zinc-950" : "text-zinc-700"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                    {s.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-100 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className="block text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 py-1 transition-colors"
          >
            ← Home
          </Link>
          {isInstallable && (
            <button
              onClick={() => {
                installApp();
                onClose();
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 transition-colors py-1"
            >
              <Download className="w-3.5 h-3.5" />
              Installa App
            </button>
          )}
        </div>
      </div>
    </>
  );
}
