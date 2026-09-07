import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  ATECO_BY_SLUG,
  ATECO_DATA,
  ATECO_CATALOG_NOMENCLATURE_YEAR,
  getAtecoSlug,
  type AtecoEntry,
} from "@/lib/ateco-data";
import {
  ATECO_RULESET_YEAR,
  resolveAtecoCoefficient,
} from "@/lib/ateco-rules-2026";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return ATECO_DATA.map((entry) => ({ slug: getAtecoSlug(entry) }));
}

function relatedEntries(entry: AtecoEntry): AtecoEntry[] {
  return ATECO_DATA.filter(
    (e) => e.sector === entry.sector && e.code !== entry.code,
  ).slice(0, 6);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = ATECO_BY_SLUG[slug];
  if (!entry) return {};

  const pct = (resolveAtecoCoefficient(entry) * 100).toFixed(0);
  const title = `Codice ATECO ${entry.code}: ${entry.description} ${ATECO_RULESET_YEAR} | ${pct}% | BurZero`;
  const description = `Trova il codice ATECO ${entry.code} per ${entry.description.toLowerCase()}: coefficiente di redditività ${pct}% nel Forfettario ${ATECO_RULESET_YEAR}. Calcola il tuo netto e le tasse.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/calcolatori/ateco/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.bur0.click/calcolatori/ateco/${slug}`,
      type: "website",
    },
  };
}

export default async function AtecoCodePage({ params }: { params: Params }) {
  const { slug } = await params;
  const entry = ATECO_BY_SLUG[slug];

  if (!entry) notFound();

  const pct = (resolveAtecoCoefficient(entry) * 100).toFixed(0);
  const related = relatedEntries(entry);
  const exampleTax = Math.round(50000 * resolveAtecoCoefficient(entry) * 0.15);

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5 mb-4 text-[10px] uppercase tracking-editorial font-semibold">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-700 transition-colors"
          >
            BurZero
          </Link>
          <ChevronRight className="w-2.5 h-2.5 text-zinc-500" />
          <Link
            href="/calcolatori/ateco"
            className="text-zinc-600 hover:text-zinc-700 transition-colors"
          >
            ATECO
          </Link>
          <ChevronRight className="w-2.5 h-2.5 text-zinc-500" />
          <span className="text-zinc-700">{entry.code}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
          Codice ATECO {entry.code}
        </h1>
        <p className="mt-2 text-lg text-zinc-700">{entry.description}</p>
        <p className="mt-1 text-[11px] uppercase tracking-editorial text-zinc-600">
          {entry.sector} - nomenclatura {ATECO_CATALOG_NOMENCLATURE_YEAR}
        </p>

        <div className="mt-8 bg-zinc-950 text-white p-6">
          <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-4">
            Coefficiente di redditività forfettario
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-4xl font-black font-mono leading-none">
                {pct}%
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                del fatturato è tassabile
              </p>
            </div>
            <div>
              <p className="text-4xl font-black font-mono leading-none">15%</p>
              <p className="text-[11px] text-zinc-500 mt-1">
                aliquota flat (5% startup)
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <p className="text-[11px] uppercase tracking-editorial font-semibold text-zinc-500 mb-1">
              Imposta effettiva su €50.000
            </p>
            <p className="text-2xl font-black font-mono leading-none">
              €{exampleTax.toLocaleString("it-IT")}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              = €50.000 × {pct}% × 15% (solo imposta sostitutiva, senza INPS)
            </p>
          </div>
        </div>

        <p className="mt-6 text-stone-600 leading-relaxed">
          Se operi nel settore <strong>{entry.sector}</strong> con attività di{" "}
          <strong>{entry.description.toLowerCase()}</strong>, il tuo
          coefficiente di redditività in Regime Forfettario per il{" "}
          {ATECO_RULESET_YEAR} è del <strong>{pct}%</strong>: solo questa quota
          del fatturato lordo concorre a formare il reddito imponibile su cui si
          applica l&apos;imposta sostitutiva.
        </p>

        <Link
          href={`/calcolatori/forfettario?ateco=${entry.code}`}
          className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-editorial px-6 py-3.5 transition-colors group"
        >
          Simula il netto completo con questo codice
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="text-sm font-black uppercase tracking-editorial text-stone-900 mb-4">
              Altri codici nel settore {entry.sector}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {related.map((r) => (
                <li key={r.code}>
                  <Link
                    href={`/calcolatori/ateco/${getAtecoSlug(r)}`}
                    className="flex items-center gap-2 text-sm text-stone-600 hover:text-zinc-950 border border-stone-200 hover:border-zinc-400 px-3 py-2 transition-colors"
                  >
                    <span className="font-mono text-xs text-zinc-600">
                      {r.code}
                    </span>
                    <span className="truncate">{r.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/calcolatori/ateco"
            className="text-xs font-bold uppercase tracking-editorial text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            ← Cerca un altro codice ATECO
          </Link>
        </div>
      </div>
    </div>
  );
}
