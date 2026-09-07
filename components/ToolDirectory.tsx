import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Calendar,
  FileText,
  Search,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tool = {
  eyebrow?: string;
  label?: string;
  title: string;
  description: string;
  href: string;
  action: string;
  Icon: LucideIcon;
};

const utilityTools: Tool[] = [
  {
    label: "Monitora",
    title: "Tax Cliff",
    description: "Tieni sotto controllo la soglia dei €100.000.",
    href: "/calcolatori/cliff",
    action: "Apri",
    Icon: TrendingUp,
  },
  {
    label: "Registra",
    title: "Registro Incassi",
    description: "Segna gli incassi e aggiorna il netto disponibile.",
    href: "/calcolatori/giornale",
    action: "Apri",
    Icon: BookOpen,
  },
  {
    label: "Pianifica",
    title: "Acconto",
    description: "Stima rate, scadenze e importo da versare.",
    href: "/calcolatori/acconto",
    action: "Calcola",
    Icon: Calendar,
  },
  {
    label: "Emetti",
    title: "Pro-Forma",
    description: "Crea un documento di pagamento professionale.",
    href: "/calcolatori/fattura",
    action: "Crea",
    Icon: FileText,
  },
  {
    label: "Ricevi",
    title: "Prestazione Occasionale",
    description: "Prepara la ricevuta e controlla i limiti.",
    href: "/calcolatori/ricevuta",
    action: "Scopri",
    Icon: FileText,
  },
];

function PrimaryTool({
  eyebrow,
  title,
  description,
  href,
  action,
  Icon,
}: Tool) {
  return (
    <Link
      href={href}
      className="group flex min-h-[220px] flex-col justify-between border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 md:p-8"
    >
      <div>
        <div className="mb-7 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-editorial text-zinc-400">
            {eyebrow}
          </span>
          <Icon className="h-5 w-5 text-red-500" />
        </div>
        <h3 className="max-w-sm text-2xl font-black leading-tight text-white md:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">
          {description}
        </p>
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-editorial text-red-400 transition-colors group-hover:text-red-300">
        {action}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function ToolDirectory() {
  return (
    <section className="bg-zinc-950 text-white" aria-labelledby="tools-heading">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-editorial text-zinc-400">
          Il tuo percorso fiscale
        </p>
        <h2
          id="tools-heading"
          className="max-w-2xl text-3xl font-black leading-tight text-white md:text-4xl"
        >
          Parti dal dato giusto. Poi fai i conti.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300">
          Trova il codice ATECO, simula il tuo netto e usa gli strumenti
          operativi quando ti servono.
        </p>

        <div className="mt-10 grid gap-px bg-zinc-800 md:grid-cols-2">
          <PrimaryTool
            eyebrow="01 - Identifica"
            title="Codice ATECO 2026"
            description="Cerca la tua attività e trova il codice ufficiale con il coefficiente di redditività corretto."
            href="/calcolatori/ateco"
            action="Cerca un codice"
            Icon={Search}
          />
          <PrimaryTool
            eyebrow="02 - Simula"
            title="Forfettario vs Ordinario"
            description="Confronta il netto con i tuoi numeri reali, considera spese e INPS e scarica il report."
            href="/calcolatori/forfettario"
            action="Apri il simulatore"
            Icon={Calculator}
          />
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-black uppercase tracking-editorial text-zinc-200">
              Altri strumenti
            </h3>
            <span className="text-xs text-zinc-500">
              Per il lavoro di ogni giorno
            </span>
          </div>
          <div className="grid gap-px bg-zinc-800 sm:grid-cols-2 lg:grid-cols-5">
            {utilityTools.map(({ Icon, ...tool }) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex min-h-[150px] flex-col bg-zinc-900 p-4 transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-editorial text-zinc-400">
                    {tool.label}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-red-400" />
                </div>
                <h4 className="mt-5 text-base font-black leading-tight text-white">
                  {tool.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  {tool.description}
                </p>
                <span className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-editorial text-red-400">
                  {tool.action} <ArrowRight className="ml-1 inline h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
