"use client";

import { useState, useEffect } from "react";
import { Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS (no beforeinstallprompt support)
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !("MSStream" in window);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHint((v) => !v);
      return;
    }
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setPrompt(null);
    }
  };

  // Already installed — show nothing
  if (isStandalone || installed) return null;

  // Chrome/Android/desktop: show only when browser has stashed the prompt
  if (!isIOS && !prompt) return null;

  return (
    <div className="mt-8 pt-6 border-t border-zinc-200">
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-editorial px-5 py-3 transition-colors"
      >
        {isIOS ? (
          <Share className="w-3.5 h-3.5 flex-shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 flex-shrink-0" />
        )}
        Installa l&apos;app — gratis
      </button>

      {/* iOS instruction tooltip */}
      {showIOSHint && (
        <p className="mt-3 text-xs text-zinc-500 leading-relaxed max-w-xs">
          Su iPhone: tocca{" "}
          <span className="font-bold text-zinc-900">
            Condividi{" "}
            <Share className="inline w-3 h-3 mb-0.5" />
          </span>{" "}
          in Safari, poi{" "}
          <span className="font-bold text-zinc-900">
            &ldquo;Aggiungi a schermata Home&rdquo;
          </span>
          .
        </p>
      )}
    </div>
  );
}
