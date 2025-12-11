import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcolatore Forfettario - White Label",
  description: "Calcolatore Regime Forfettario embedabile white label",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WhiteLabelEmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-transparent min-h-screen">{children}</div>;
}
