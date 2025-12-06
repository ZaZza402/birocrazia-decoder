"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText } from "lucide-react";
import { trackNavClick } from "@/lib/analytics";

export default function StickyNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-yellow-300 border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-black uppercase tracking-tighter bg-black text-white px-3 py-1 border-2 border-black hover:bg-gray-800 transition-colors"
          >
            BUR0
          </Link>

          {/* Nav Buttons */}
          <div className="flex gap-3">
            <Link
              href="/"
              onClick={() => trackNavClick("home")}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-black uppercase border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none ${
                pathname === "/"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/decoder"
              onClick={() => trackNavClick("decoder")}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-black uppercase border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none ${
                pathname === "/decoder"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">Decoder</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
