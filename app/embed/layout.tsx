import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulatore Regime Forfettario - Embed",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      {children}
    </div>
  );
}
