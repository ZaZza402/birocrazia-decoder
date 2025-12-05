import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Briefcase,
  Quote,
  MessageSquareQuote,
  FileText,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;

  const item = await prisma.decodeHistory.findUnique({
    where: { id },
  });

  if (!item || item.userId !== user.id) {
    return <div>Non trovato o non autorizzato.</div>;
  }

  const response = item.response as any;

  const getRiskColor = (level?: "BASSO" | "MEDIO" | "ALTO") => {
    switch (level) {
      case "ALTO":
        return "bg-red-600 text-white border-black";
      case "MEDIO":
        return "bg-yellow-400 text-black border-black";
      case "BASSO":
        return "bg-green-500 text-black border-black";
      default:
        return "bg-gray-200 text-black border-black";
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-8 pt-24 font-mono text-black">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-bold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Torna alla Dashboard
        </Link>

        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b-4 border-black pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-black text-white px-3 py-1 font-black uppercase text-sm">
                  {item.persona}
                </span>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.createdAt.toLocaleDateString("it-IT")}
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase">
                Dettaglio Decodifica
              </h1>
            </div>
            <div
              className={cn(
                "px-4 py-2 font-black text-lg uppercase border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]",
                getRiskColor(response.livello_di_rischio)
              )}
            >
              Rischio: {response.livello_di_rischio}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Input & Image */}
            <div className="space-y-6">
              <div>
                <h3 className="font-black uppercase text-sm mb-2 bg-gray-200 inline-block px-2">
                  Il tuo Input
                </h3>
                <div className="bg-gray-50 p-4 border-2 border-black text-sm whitespace-pre-wrap">
                  {item.prompt}
                </div>
              </div>

              {item.image && (
                <div>
                  <h3 className="font-black uppercase text-sm mb-2 bg-gray-200 inline-block px-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Documento Originale
                  </h3>
                  <div className="border-2 border-black p-2 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt="Documento caricato"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Output */}
            <div className="space-y-6">
              {/* The Truth */}
              <div>
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> La Verità
                </h3>
                <p className="font-mono text-lg leading-relaxed bg-yellow-50 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  {response.la_verita}
                </p>
              </div>

              {/* Action Plan */}
              <div>
                <h3 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Cosa Devi Fare
                </h3>
                <div className="font-mono text-sm bg-white p-4 border-l-4 border-black">
                  {response.cosa_devi_fare}
                </div>
              </div>

              {/* Bureaucrat Note */}
              <div className="pt-4 border-t-2 border-black/20">
                <div className="flex gap-2 text-xs text-gray-500 font-mono italic">
                  <Quote className="w-4 h-4 rotate-180" />
                  <p>{response.nota_del_burocrate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
