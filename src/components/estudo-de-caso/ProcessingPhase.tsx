import { useState, useEffect } from 'react';
import logoGd from '@/assets/logo-gd.png';
import { Check, Loader2 } from 'lucide-react';

interface ProcessingPhaseProps {
  nomeClinica: string;
  onComplete: () => void;
}

const STEPS = [
  { label: "Posicionamento mapeado", delay: 900 },
  { label: "Performance analisada", delay: 1800 },
  { label: "Calculando gargalos de atendimento...", delay: 2700, loading: true },
  { label: "Relatório gerado com sucesso ✓", delay: 3700 },
];

const ProcessingPhase = ({ nomeClinica, onComplete }: ProcessingPhaseProps) => {
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100));
    }, 40);

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (!step.loading) setCompletedSteps((prev) => [...prev, i]);
      }, step.delay);
    });

    // Mark loading step as complete
    setTimeout(() => setCompletedSteps((prev) => [...prev, 2]), 3500);

    const timer = setTimeout(onComplete, 4000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] text-center">
        <img src={logoGd} alt="GD Co." className="h-14 w-14 mx-auto mb-8 rounded-lg animate-pulse-soft" />

        <h2 className="text-lg font-semibold text-primary-foreground mb-6 font-display">
          Analisando a operação da {nomeClinica}...
        </h2>

        {/* Progress bar */}
        <div className="w-full bg-border/20 rounded-full h-2 mb-8">
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i);
            const isActive = activeStep === i && !isCompleted;
            if (activeStep < i) return null;

            return (
              <div key={i} className="flex items-center gap-3 animate-counter-tick">
                {isCompleted ? (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                ) : isActive && step.loading ? (
                  <Loader2 className="h-4 w-4 text-primary flex-shrink-0 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
                <span className={`text-sm font-body ${isCompleted ? 'text-primary-foreground/80' : 'text-primary'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-primary-foreground/40 mt-8 font-body italic">
          "Cruzando com benchmarks de 40+ clínicas de alto valor"
        </p>
      </div>
    </div>
  );
};

export default ProcessingPhase;
