"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { ONE_TIME_CREDITS } from "@/lib/plans";

interface UsageData {
  used: number;
  limit: number;
  bonusCredits: number;
  canDecode: boolean;
  planName: string;
}

export default function UsageCard() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/usage");
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    setCheckoutLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: ONE_TIME_CREDITS.stripePriceId,
          type: "payment",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Errore durante il checkout");
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Errore di connessione. Riprova.");
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!usage) return null;

  const totalAvailable =
    usage.limit === Infinity ? "∞" : usage.limit + usage.bonusCredits;
  const percentage =
    usage.limit === Infinity
      ? 0
      : Math.min((usage.used / (usage.limit + usage.bonusCredits)) * 100, 100);

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6" />
        <h2 className="text-xl font-black uppercase bg-cyan-300 px-2 border-2 border-black">
          Utilizzo Mensile
        </h2>
      </div>

      {/* Usage Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-3xl font-black">{usage.used}</span>
          <span className="text-lg font-bold text-gray-600">
            / {totalAvailable}
          </span>
        </div>

        {usage.limit !== Infinity && (
          <div className="w-full h-4 bg-gray-200 border-2 border-black overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage >= 90
                  ? "bg-red-500"
                  : percentage >= 70
                  ? "bg-yellow-400"
                  : "bg-green-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}

        {usage.bonusCredits > 0 && (
          <p className="text-sm mt-2 font-bold text-green-700">
            ⭐ {usage.bonusCredits} crediti bonus disponibili!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {usage.limit !== Infinity && percentage >= 80 && (
          <div className="bg-red-100 border-2 border-red-600 p-3 text-sm font-bold text-red-900">
            ⚠️ Stai per esaurire le decodifiche!
          </div>
        )}

        {usage.limit !== Infinity && (
          <>
            <button
              onClick={handleBuyCredits}
              disabled={checkoutLoading}
              className="w-full bg-red-500 text-white px-4 py-3 font-black uppercase border-2 border-black hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Caricamento...
                </>
              ) : (
                <>
                  ⚡ Compra {ONE_TIME_CREDITS.amount} Crediti (€
                  {ONE_TIME_CREDITS.price})
                </>
              )}
            </button>

            <Link
              href="/#pricing"
              className="block w-full bg-yellow-300 text-black px-4 py-3 font-black uppercase border-2 border-black hover:bg-yellow-400 transition-colors text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Upgrade Piano
            </Link>
          </>
        )}

        {usage.limit === Infinity && (
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-black p-4 text-center">
            <p className="font-black uppercase text-white">
              🎉 Decodifiche Illimitate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
