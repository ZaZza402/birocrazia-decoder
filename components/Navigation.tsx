"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/android-chrome-512x512.png"
              alt="Bur0"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="text-lg font-black text-zinc-950 tracking-tight leading-none">
              Bur<span className="font-mono">0</span>
            </span>
            <span className="hidden sm:block text-xs uppercase tracking-editorial font-semibold text-zinc-400 border-l border-zinc-200 pl-3 ml-1">
              Strumenti Fiscali
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/calcolatori/forfettario"
              className="text-xs font-bold uppercase tracking-editorial text-zinc-600 hover:text-zinc-950 px-4 py-2 transition-colors"
            >
              Simulatore Forfettario
            </Link>

            {isInstallable && (
              <button
                onClick={installApp}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-editorial border border-zinc-300 text-zinc-600 hover:border-zinc-700 hover:text-zinc-950 px-4 py-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Installa
              </button>
            )}

            <Link
              href="/upgrade"
              className="text-xs font-bold uppercase tracking-editorial border border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800 px-4 py-2 transition-colors"
            >
              Pro
            </Link>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-zinc-950"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 py-4 space-y-1">
            <Link
              href="/calcolatori/forfettario"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-editorial text-zinc-700 hover:text-zinc-950 py-2"
            >
              Simulatore Forfettario
            </Link>
            {isInstallable && (
              <button
                onClick={() => { installApp(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-zinc-700 py-2"
              >
                <Download className="w-3.5 h-3.5" />
                Installa App
              </button>
            )}
            <Link
              href="/upgrade"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-editorial text-zinc-700 hover:text-zinc-950 py-2"
            >
              Pro
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
