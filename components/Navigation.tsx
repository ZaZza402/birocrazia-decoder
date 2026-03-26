"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isInstallable, installApp } = usePWAInstall();
  const navRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={navRef}
      className="fixed top-3 z-50 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2"
    >
      <nav
        className={`bg-white border border-zinc-200 shadow-sm transition-[border-radius] duration-300 ease-in-out ${
          isMobileMenuOpen ? "rounded-2xl" : "rounded-full"
        }`}
      >
        {/* MAIN ROW */}
        <div className="flex items-center px-3 py-2 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/android-chrome-512x512.png"
              alt="Bur0"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-sm font-black text-zinc-950 tracking-tight leading-none">
              Bur<span className="font-mono">0</span>
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
              Codice ATECO
            </Link>
            <Link
              href="/calcolatori/cliff"
              className="text-[11px] font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Tax Cliff
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
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden p-1 text-zinc-700 hover:text-zinc-950 flex-shrink-0"
          >
            <span
              className={`block transition-opacity duration-150 ${
                isMobileMenuOpen ? "opacity-0 absolute" : "opacity-100"
              }`}
            >
              <Menu className="w-5 h-5" />
            </span>
            <span
              className={`block transition-opacity duration-150 ${
                isMobileMenuOpen ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <X className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* MOBILE EXPANDED MENU — CSS grid height animation */}
        <div
          className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-zinc-100 px-4 pb-3 pt-2 space-y-0.5">
              <Link
                href="/calcolatori/forfettario"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-editorial text-zinc-700 hover:text-zinc-950 py-2"
              >
                Simulatore Forfettario
              </Link>
              <Link
                href="/calcolatori/ateco"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-editorial text-zinc-700 hover:text-zinc-950 py-2"
              >
                Codice ATECO
              </Link>
              <Link
                href="/calcolatori/cliff"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-editorial text-zinc-700 hover:text-zinc-950 py-2"
              >
                Tax Cliff
              </Link>
              {isInstallable && (
                <button
                  onClick={() => {
                    installApp();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-700 py-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Installa App
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
