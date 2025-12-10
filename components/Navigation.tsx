"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Receipt, Menu, X, Sparkles, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isInstallable, installApp } = usePWAInstall();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/android-chrome-512x512.png"
                alt="Bur0 Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-xl font-black leading-none tracking-tight transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                Bur<span
                  className={`font-mono text-2xl ${
                    isScrolled ? "text-indigo-600" : "text-indigo-300"
                  }`}
                >0
                </span>
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  isScrolled ? "text-gray-500" : "text-slate-300"
                }`}
              >
                Strumenti Fiscali
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/calcolatori/forfettario"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-indigo-50 text-slate-700 hover:text-indigo-600"
            >
              <Image
                src="/android-chrome-512x512.png"
                alt="Calculator"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Forfettario</span>
              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Live
              </span>
            </Link>

            {isInstallable && (
              <button
                onClick={installApp}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-indigo-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Installa App
              </button>
            )}

            <div className="ml-4 pl-4 border-l border-slate-200">
              <Link
                href="/upgrade"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade Pro</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-lg">
            <div className="space-y-2">
              <Link
                href="/calcolatori/forfettario"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <Image
                  src="/android-chrome-512x512.png"
                  alt="Calculator"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Simulatore Forfettario</span>
                <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                  LIVE
                </span>
              </Link>

              {isInstallable && (
                <button
                  onClick={() => {
                    installApp();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Installa App</span>
                </button>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100">
                <Link
                  href="/upgrade"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upgrade Pro</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
