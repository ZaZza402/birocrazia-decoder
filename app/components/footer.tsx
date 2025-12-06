import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 text-center border-t-4 border-yellow-300">
      <p className="font-bold uppercase tracking-widest mb-4">Bur0 © 2025</p>
      <p className="text-gray-500 text-sm max-w-md mx-auto mb-4 px-4">
        Non siamo avvocati. Se finisci in galera è colpa tua. Questo sito usa AI
        e potrebbe dire cazzate.
      </p>
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/disclaimer"
          className="text-yellow-300 hover:text-yellow-400 font-bold text-sm underline"
        >
          Leggi il Disclaimer Completo
        </Link>
        <p className="text-gray-400 text-sm">
          In collaboration with{" "}
          <a
            href="https://www.alecsdesign.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-300 hover:text-yellow-400 font-bold underline"
          >
            alecsdesign.xyz
          </a>
        </p>
      </div>
    </footer>
  );
}
