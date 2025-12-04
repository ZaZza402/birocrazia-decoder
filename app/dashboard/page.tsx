import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserPlan, PLANS } from "@/lib/plans";
import { ArrowRight, Lock, Zap } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) return <div>Non sei autorizzato. Vattene.</div>;

  const planType = await getUserPlan(user.id);
  const plan = PLANS[planType];

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-8 pt-24 font-mono text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Area Riservata
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-bold hover:underline decoration-2 underline-offset-4"
            >
              ← Home
            </Link>
          </div>
        </header>

        <main className="grid md:grid-cols-3 gap-8">
          {/* Main Action Card */}
          <section className="md:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black mb-4 bg-yellow-300 inline-block px-2 border-2 border-black uppercase">
                Nuova Decodifica
              </h2>
              <p className="text-lg mb-8">
                Hai ricevuto una lettera minatoria? Un modulo incomprensibile?
                Dallo in pasto all'AI.
              </p>
            </div>
            <Link
              href="/dashboard/decoder"
              className="bg-black text-white px-6 py-4 text-xl font-black uppercase tracking-wide hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] hover:translate-y-1 hover:shadow-none border-2 border-black flex items-center justify-between group"
            >
              Avvia Decoder{" "}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>

          {/* User Profile & Plan */}
          <section className="bg-[#ff90e8] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h2 className="text-xl font-bold mb-4 bg-white inline-block px-2 border-2 border-black uppercase">
              Il tuo Stato
            </h2>
            <div className="space-y-4 mb-8">
              <p>
                <span className="font-bold">Utente:</span> {user.firstName}
              </p>
              <p className="text-xs mt-1 break-all font-mono bg-white/50 p-1 border border-black/20 select-all">
                <span className="font-bold">ID:</span> {user.id}
              </p>
              <p>
                <span className="font-bold">Piano:</span>{" "}
                <span className="bg-black text-white px-2 py-0.5 text-sm uppercase">
                  {plan.name}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-bold">Limiti:</span>{" "}
                {plan.limits.monthlyDecodes === Infinity
                  ? "ILLIMITATI"
                  : `${plan.limits.monthlyDecodes} / mese`}
              </p>
            </div>

            {planType === "FREE" ? (
              <button className="w-full bg-white text-black px-4 py-2 font-bold border-2 border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> UPGRADE
              </button>
            ) : (
              <div className="bg-white/50 p-2 text-center text-sm font-bold border-2 border-black/20">
                SEI UN INTOCCABILE
              </div>
            )}
          </section>

          {/* History (Placeholder) */}
          <section className="md:col-span-3 bg-gray-200 border-4 border-black/20 p-8 opacity-75">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-500 uppercase">
                Cronologia (Presto)
              </h2>
              <Lock className="w-6 h-6 text-gray-500" />
            </div>
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-500 font-bold">
              NESSUNA DECODIFICA SALVATA
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
