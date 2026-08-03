"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div
      key={pathname}
      style={{ animation: "page-enter 0.3s ease-in-out forwards" }}
    >
      {children}
    </div>
  );
}
