"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, Loader2 } from "lucide-react";

interface ReferralData {
  referralCode: string;
  bonusCredits: number;
  referralCount: number;
}

export default function ReferralCard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [applyCode, setApplyCode] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch("/api/referral/stats");
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralData) return;

    const link = `${window.location.origin}/?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyCode.trim()) return;

    setApplyLoading(true);
    setApplyMessage("");

    try {
      const response = await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: applyCode.toUpperCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setApplyMessage(data.message || "✅ Codice applicato!");
        setApplyCode("");
        fetchReferralData(); // Refresh data
      } else {
        setApplyMessage(`❌ ${data.error || "Errore"}`);
      }
    } catch {
      setApplyMessage("❌ Errore di connessione");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-300 to-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6" />
        <h2 className="text-xl font-black uppercase bg-white px-2 border-2 border-black">
          Referral
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-black p-3 text-center">
          <div className="text-2xl font-black">
            {referralData?.bonusCredits || 0}
          </div>
          <div className="text-xs font-bold uppercase">Crediti Bonus</div>
        </div>
        <div className="bg-white border-2 border-black p-3 text-center">
          <div className="text-2xl font-black">
            {referralData?.referralCount || 0}
          </div>
          <div className="text-xs font-bold uppercase">Amici Referiti</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-6">
        <p className="text-sm font-bold mb-2">Il tuo codice:</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-black text-white font-mono text-lg font-black px-4 py-3 border-2 border-black text-center">
            {referralData?.referralCode || "LOADING"}
          </div>
          <button
            onClick={copyReferralLink}
            className="bg-white border-2 border-black px-4 hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs mt-2 font-bold">
          ⭐ Tu ricevi 3 crediti, il tuo amico ne riceve 2!
        </p>
      </div>

      {/* Apply Code Form */}
      {!referralData?.referralCount && (
        <form
          onSubmit={handleApplyCode}
          className="border-t-2 border-black/20 pt-4"
        >
          <p className="text-sm font-bold mb-2">Hai un codice da applicare?</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
              placeholder="CODICE"
              maxLength={25}
              className="flex-1 border-2 border-black px-3 py-2 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={applyLoading || !applyCode.trim()}
              className="bg-black text-white px-6 py-2 font-bold border-2 border-black hover:bg-gray-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-50 w-full sm:w-auto min-w-[80px] flex items-center justify-center"
            >
              {applyLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "OK"
              )}
            </button>
          </div>
          {applyMessage && (
            <p className="text-xs mt-2 font-bold">{applyMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
