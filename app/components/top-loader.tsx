"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(10);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(90), 600);

    // Complete loading
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-black/10"
      style={{ opacity: isLoading ? 1 : 0, transition: "opacity 0.2s" }}
    >
      <div
        className="h-full bg-yellow-400 border-r-2 border-black shadow-[2px_0px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
