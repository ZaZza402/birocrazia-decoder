import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getUserPlan, PLANS } from "@/lib/plans";
import prisma from "@/lib/db";
import { ArrowRight, Lock, Zap, FileText, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { DecodeHistory } from "@prisma/client";
import ReferralCard from "../components/referral-card";
import UsageCard from "../components/usage-card";
import { DeleteAllHistoryButton } from "../components/delete-history";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const planType = await getUserPlan(user.id);
  const plan = PLANS[planType];

  const history = await prisma.decodeHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 sm:p-6 md:p-8 pt-20 md:pt-24 font-mono text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12 border-b-4 border-black pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">
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

        <main className="grid md:grid-cols-3 gap-4 md:gap-8">
          {/* Main Action Card */}
          <section className="md:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 bg-yellow-300 inline-block px-2 border-2 border-black uppercase">
                Nuova Decodifica
              </h2>
              <p className="text-base sm:text-lg mb-6 md:mb-8">
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
          <section className="bg-[#ff90e8] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 bg-white inline-block px-2 border-2 border-black uppercase break-words max-w-full">
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
              <Link
                href="/#pricing"
                className="w-full bg-white text-black px-4 py-2 font-bold border-2 border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> UPGRADE
              </Link>
            ) : (
              <div className="bg-white/50 p-2 text-center text-sm font-bold border-2 border-black/20">
                SEI UN INTOCCABILE
              </div>
            )}
          </section>

          {/* Usage Card */}
          <section className="md:col-span-2">
            <UsageCard />
          </section>

          {/* Referral Card */}
          <section>
            <ReferralCard />
          </section>

          {/* History */}
          <section className="md:col-span-3 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase bg-cyan-300 px-2 border-2 border-black inline-block">
                Cronologia Recente
              </h2>
              <div className="flex items-center gap-3">
                {history.length > 0 && <DeleteAllHistoryButton />}
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {history.length === 0 ? (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-black/20 text-gray-500 font-bold">
                ANCORA NESSUNA VITTIMA (DECODIFICA)
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item: DecodeHistory) => (
                  <Link
                    href={`/dashboard/history/${item.id}`}
                    key={item.id}
                    className="block border-2 border-black p-4 hover:bg-yellow-100 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold uppercase text-sm bg-black text-white px-2 py-0.5">
                        {item.persona}
                      </div>
                      <div className="text-xs font-mono text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.createdAt.toLocaleDateString("it-IT")}
                      </div>
                    </div>
                    <p className="font-mono text-sm line-clamp-2 mb-2 font-bold">
                      {item.prompt}
                    </p>
                    <div className="text-xs text-gray-600 line-clamp-1 italic">
                      &quot;{(item.response as any)?.la_verita || "..."}&quot;
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
