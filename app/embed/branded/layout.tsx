import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcolatore Forfettario - Versione Embedabile con Brand",
  description: "Calcolatore Regime Forfettario embedabile con brand Bur0",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BrandedEmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-transparent min-h-screen">{children}</div>;
}
