"use client";

import { useEffect, useState } from "react";
import { Calculator, Sparkles, TrendingUp, Shield } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
  type?: "calculator" | "pdf";
}

export default function LoadingScreen({
  onComplete,
  minDuration = 1200,
  type = "calculator",
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const calculatorSteps = [
    { icon: Calculator, text: "Caricamento motore fiscale...", progress: 25 },
    { icon: Shield, text: "Verifica normativa 2025...", progress: 50 },
    { icon: TrendingUp, text: "Preparazione algoritmi IRPEF...", progress: 75 },
    { icon: Sparkles, text: "Ottimizzazione interfaccia...", progress: 100 },
  ];

  const pdfSteps = [
    { icon: Calculator, text: "Elaborazione dati fiscali...", progress: 30 },
    { icon: Shield, text: "Validazione calcoli...", progress: 60 },
    { icon: Sparkles, text: "Generazione documento PDF...", progress: 100 },
  ];

  const steps = type === "calculator" ? calculatorSteps : pdfSteps;

  useEffect(() => {
    const stepDuration = minDuration / steps.length;
    let stepIndex = 0;
    let completed = false;

    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        setProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        if (!completed) {
          completed = true;
          clearInterval(stepInterval);
          setTimeout(onComplete, 300);
        }
      }
    }, stepDuration);

    return () => {
      clearInterval(stepInterval);
      completed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CurrentIcon = steps[currentStep]?.icon || Calculator;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 z-50 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl mb-4 animate-in zoom-in duration-500">
            <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Bur<span className="text-indigo-300 font-mono">0</span>
          </h1>
          <p className="text-indigo-200 text-sm font-medium">
            {type === "calculator"
              ? "Simulatore Fiscale Professionale"
              : "Generazione Report Avanzato"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-white/90 text-sm font-medium animate-in fade-in duration-300">
          {steps[currentStep]?.text}
        </div>

        {/* Percentage */}
        <div className="mt-4 text-indigo-300 text-2xl font-black">
          {progress}%
        </div>

        {/* Security Badge */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full text-xs text-white/60">
          <Shield className="w-3 h-3" />
          <span>Calcoli verificati • Normativa 2025</span>
        </div>
      </div>
    </div>
  );
}
