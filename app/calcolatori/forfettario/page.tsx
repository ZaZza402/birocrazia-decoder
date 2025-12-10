"use client";

import { useState, useEffect } from "react";
import ForfettarioCalculator from "@/components/ForfettarioCalculator";
import LoadingScreen from "@/components/LoadingScreen";

export default function ForfettarioPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen
          type="calculator"
          minDuration={2500}
          onComplete={() => setIsLoading(false)}
        />
      )}
      {!isLoading && <ForfettarioCalculator />}
    </>
  );
}
