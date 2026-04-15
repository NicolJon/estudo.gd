import type { STEPIMEMatrix, STEPDimension, IMELevel } from './types';
import { STEP_LABELS, IME_LABELS } from './types';

interface STEPIMEGridProps {
  matrix: STEPIMEMatrix;
}

const STEPS: STEPDimension[] = ['S', 'T', 'E', 'P'];
const IMES: IMELevel[] = ['I', 'M', 'E'];

const getCellBg = (score: number): string => {
  if (score >= 66) return 'bg-primary/90';
  if (score >= 36) return 'bg-primary/50';
  return 'bg-primary/20';
};

const getCellTextColor = (score: number): string => {
  if (score >= 66) return 'text-primary-foreground';
  if (score >= 36) return 'text-foreground';
  return 'text-foreground';
};

const getBarColor = (score: number): string => {
  if (score > 75) return 'bg-primary-foreground';
  if (score > 45) return 'bg-primary-foreground/60';
  return 'bg-primary-foreground/40';
};

const STEPIMEGrid = ({ matrix }: STEPIMEGridProps) => {
  const getCell = (step: STEPDimension, ime: IMELevel) =>
    matrix.cells.find(c => c.step === step && c.ime === ime);

  return (
    <section className="bg-surface-dark py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1 font-display uppercase tracking-wide">
          Construção de Hipóteses
        </h2>
        <p className="text-sm text-primary-foreground/50 font-body mb-8">
          Completude por dimensão e fase de maturidade
        </p>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header row: STEP columns */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-1 mb-1">
              <div /> {/* Empty corner cell */}
              {STEPS.map(s => (
                <div key={s} className="bg-primary-foreground/10 rounded-t-lg px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary font-display">{s}</p>
                  <p className="text-[9px] text-primary-foreground/50 font-body leading-tight mt-0.5">
                    {STEP_LABELS[s].full}
                  </p>
                </div>
              ))}
            </div>

            {/* IME rows */}
            {IMES.map(ime => (
              <div key={ime} className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] gap-1 mb-1">
                {/* Row label */}
                <div className="bg-primary-foreground/10 rounded-l-lg px-3 py-4 flex flex-col justify-center">
                  <p className="text-lg font-bold text-primary font-display">{ime}</p>
                  <p className="text-[9px] text-primary-foreground/50 font-body leading-tight">
                    {IME_LABELS[ime].full}
                  </p>
                </div>

                {/* Data cells */}
                {STEPS.map(step => {
                  const cell = getCell(step, ime);

                  if (!cell) {
                    return (
                      <div key={`${step}-${ime}`} className="bg-primary-foreground/5 rounded-lg px-3 py-4 flex items-center justify-center border border-dashed border-primary-foreground/10">
                         <span className="text-[10px] text-primary-foreground/20 font-bold">···</span>
                      </div>
                    );
                  }

                  const score = cell.score;
                  const label = cell.label;

                  return (
                    <div
                      key={`${step}-${ime}`}
                      className={`bg-primary/80 ring-2 ring-primary ring-offset-2 ring-offset-surface-dark rounded-lg px-3 py-4 flex flex-col items-center justify-center relative overflow-hidden`}
                    >
                      <p className={`text-3xl md:text-4xl font-bold font-display text-primary-foreground`}>
                        {score}%
                      </p>
                      <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 text-primary-foreground opacity-80`}>
                        {label}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-black/20 rounded-full mt-3">
                        <div
                          className={`h-full rounded-full ${getBarColor(score)} transition-all duration-1000 ease-out`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default STEPIMEGrid;
