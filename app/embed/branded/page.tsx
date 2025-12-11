"use client";

import ForfettarioCalculator from "@/components/ForfettarioCalculator";

export default function BrandedEmbedPage() {
  return (
    <div className="embed-wrapper-branded">
      <ForfettarioCalculator />
      {/* Branding Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 shadow-lg z-50">
        <div className="flex items-center justify-center gap-2 text-sm font-bold">
          <span>Powered by</span>
          <a
            href="https://bur0.click"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1"
          >
            Bur<span className="font-mono text-lg">0</span>
          </a>
          <span className="text-indigo-200 text-xs">• Strumenti Fiscali Gratuiti</span>
        </div>
      </div>
    </div>
  );
}
