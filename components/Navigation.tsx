"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import MobileJourneyDrawer from "@/components/MobileJourneyDrawer";

export default function Navigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <>
      <MobileJourneyDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <div className="fixed top-3 z-50 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2">
        <nav className="bg-white border border-zinc-200 shadow-sm rounded-full">
          {/* MAIN ROW */}
          <div className="flex items-center px-3 py-2 gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/android-chrome-512x512.png?v=2"
                alt="BurZero"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm text-zinc-950 tracking-tight leading-none">
                <span className="font-normal">Bur</span>
                <span className="font-black text-red-600">Zero</span>
              </span>
            </Link>

            {/* Divider */}
            <span className="hidden md:block w-px h-3.5 bg-zinc-200 mx-1 flex-shrink-0" />

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">
              <Link
                href="/calcolatori/forfettario"
                className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Forfettario
              </Link>
              <Link
                href="/calcolatori/ateco"
                className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                ATECO
              </Link>
              <Link
                href="/calcolatori/cliff"
                className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Tax Cliff
              </Link>
              <Link
                href="/calcolatori/acconto"
                className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Acconto
              </Link>
              <Link
                href="/calcolatori/fattura"
                className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Pro-Forma
              </Link>
              {isInstallable && (
                <button
                  onClick={installApp}
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-editorial border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-950 rounded-full px-3 py-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  App
                </button>
              )}
            </div>

            {/* Spacer */}
            <div className="hidden md:block flex-1 min-w-3" />

            {/* Mobile spacer + hamburger */}
            <div className="flex-1 md:hidden" />
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-1 text-zinc-700 hover:text-zinc-950 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
