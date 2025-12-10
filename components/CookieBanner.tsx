"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const accepted = localStorage.getItem("buro_cookie_consent");
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("buro_cookie_consent", "true");
    setIsVisible(false);
    // Initialize Analytics here if you have them (e.g., Vercel Analytics)
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 text-white p-6 rounded-2xl shadow-2xl z-50 border border-slate-700 animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg">🍪 Solo Cookie Tecnici</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Chiudi banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        Non ci interessa tracciarti. Usiamo cookie e local storage solo per
        salvare i tuoi calcoli sul dispositivo e far funzionare l'app.
      </p>
      <div className="flex gap-3">
        <button
          onClick={acceptCookies}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-bold text-sm transition-colors"
        >
          Ho capito
        </button>
        <Link
          href="/privacy"
          className="flex-1 flex items-center justify-center border border-slate-600 hover:bg-slate-800 text-slate-300 py-2 px-4 rounded-lg font-bold text-sm transition-colors"
        >
          Info
        </Link>
      </div>
    </div>
  );
}
