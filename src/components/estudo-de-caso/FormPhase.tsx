import { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { FormData, AnswerLetter, QuestionDef } from './types';
import { FORM_STEPS, STEP_FIELDS, getEmptyFormData, ALL_QUESTIONS } from './types';

interface FormPhaseProps {
  onSubmit: (data: FormData) => void;
}

type FieldFormat = 'text' | 'currency' | 'percent' | 'number' | 'telefone';

const BASIC_FIELDS: Record<string, { label: string; placeholder: string; format?: FieldFormat }> = {
  nomeClinica: { label: 'Nome da clínica', placeholder: 'Ex: Clínica Dra. Camila' },
  responsavel: { label: 'Responsável', placeholder: 'Ex: Dra. Camila Souza' },
  telefone: { label: 'Telefone', placeholder: '44999999999', format: 'telefone' },
  instagram: { label: 'Instagram', placeholder: 'Ex: @clinicadracamila' },
  googleMaps: { label: 'Google Maps (link)', placeholder: 'https://maps.google.com/...' },
  ticketMedio: { label: 'Ticket médio por procedimento', placeholder: '12.000', format: 'currency' },
  faturamentoMensal: { label: 'Faturamento mensal', placeholder: '180.000', format: 'currency' },
  conversaoProcedimentos: { label: 'Conversão em procedimentos (%)', placeholder: '10', format: 'percent' },
};

const LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D', 'E'];

const formatCurrency = (value: string): string => {
  const nums = value.replace(/\D/g, '');
  if (!nums) return '';
  return parseInt(nums, 10).toLocaleString('pt-BR');
};

const formatNumber = (value: string): string => value.replace(/\D/g, '');

const formatTelefone = (value: string): string => {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 2) return nums.length ? `(${nums}` : '';
  if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  if (nums.length <= 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
};

const formatPercent = (value: string): string => {
  const nums = value.replace(/[^\d.,]/g, '').replace(',', '.');
  if (!nums) return '';
  const match = nums.match(/^(\d+\.?\d{0,2})/);
  return match ? match[1].replace('.', ',') : '';
};

const FormPhase = ({ onSubmit }: FormPhaseProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(getEmptyFormData());
  const topRef = useRef<HTMLDivElement>(null);

  const currentFields = STEP_FIELDS[step] || [];
  const allFilled = currentFields.every((f) => {
    const val = data[f];
    if (typeof val !== 'string') return false;
    return val.trim().length >= 1;
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleBasicChange = (field: keyof FormData, value: string, format?: FieldFormat) => {
    let formatted = value;
    if (format === 'currency') formatted = formatCurrency(value);
    else if (format === 'number') formatted = formatNumber(value);
    else if (format === 'percent') formatted = formatPercent(value);
    else if (format === 'telefone') formatted = formatTelefone(value);
    setData((prev) => ({ ...prev, [field]: formatted }));
  };

  const handleAnswer = (field: keyof FormData, letter: AnswerLetter) => {
    setData((prev) => ({ ...prev, [field]: letter }));
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setTimeout(scrollToTop, 50);
    } else {
      onSubmit(data);
    }
  };

  const stepInfo = FORM_STEPS[step];

  const renderBasicInput = (field: string) => {
    const config = BASIC_FIELDS[field];
    if (!config) return null;
    const key = field as keyof FormData;
    const format = config.format || 'text';

    return (
      <div key={field}>
        <label className="block text-[13px] font-semibold text-foreground mb-1.5">{config.label}</label>
        {format === 'currency' ? (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">R$</span>
            <input type="text" inputMode="numeric" value={data[key] as string}
              onChange={(e) => handleBasicChange(key, e.target.value, 'currency')}
              placeholder={config.placeholder}
              className="w-full border border-border rounded-lg pl-11 pr-4 py-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors" />
          </div>
        ) : format === 'percent' ? (
          <div className="relative">
            <input type="text" inputMode="decimal" value={data[key] as string}
              onChange={(e) => handleBasicChange(key, e.target.value, 'percent')}
              placeholder={config.placeholder}
              className="w-full border border-border rounded-lg px-4 pr-10 py-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">%</span>
          </div>
        ) : format === 'telefone' ? (
          <input type="text" inputMode="numeric" value={data[key] as string}
            onChange={(e) => handleBasicChange(key, e.target.value, 'telefone')}
            placeholder={config.placeholder} maxLength={15}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors" />
        ) : (
          <input type="text" value={data[key] as string}
            onChange={(e) => handleBasicChange(key, e.target.value)}
            placeholder={config.placeholder}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors" />
        )}
      </div>
    );
  };

  const renderQuestion = (q: QuestionDef) => {
    if (q.isPercent) {
      return (
        <div key={q.id} className="mb-6">
          <p className="text-[13px] font-semibold text-foreground mb-3">
            <span className="text-muted-foreground mr-1.5">{q.num}.</span>{q.text}
          </p>
          <div className="relative max-w-[200px]">
            <input type="text" inputMode="decimal" value={data[q.id] as string}
              onChange={(e) => handleBasicChange(q.id, e.target.value, 'percent')}
              placeholder="Ex: 8"
              className="w-full border border-border rounded-lg px-4 pr-10 py-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">%</span>
          </div>
        </div>
      );
    }

    const selected = data[q.id] as AnswerLetter;
    return (
      <div key={q.id} className="mb-6">
        <p className="text-[13px] font-semibold text-foreground mb-3">
          <span className="text-muted-foreground mr-1.5">{q.num}.</span>{q.text}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {LETTERS.map((letter, idx) => {
            const isSelected = selected === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => handleAnswer(q.id, letter)}
                className={`
                  text-center px-2 py-3 rounded-lg border text-xs transition-all
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-foreground font-bold'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                  }
                `}
              >
                <span className={`block text-sm font-bold mb-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground/60'}`}>{letter}</span>
                <span className="block text-[10px] leading-tight">{q.options[idx]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Get questions for current step (steps 1-4)
  const currentQuestions = step > 0
    ? ALL_QUESTIONS.filter((q) => currentFields.includes(q.id))
    : [];

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4 py-12">
      <div ref={topRef} className="w-full max-w-[760px] bg-card rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-border">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-6 md:p-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
            {stepInfo.badge}
          </span>

          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 font-display">{stepInfo.title}</h2>

          <div className="space-y-4 mt-6">
            {step === 0
              ? currentFields.map((f) => renderBasicInput(f))
              : currentQuestions.map(renderQuestion)
            }
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleNext}
              disabled={!allFilled}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground font-semibold py-4 px-6 rounded-xl text-base transition-colors"
            >
              {step < 4 ? 'PRÓXIMA ETAPA' : 'GERAR ESTUDO DE CASO'}
            </button>

            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); setTimeout(scrollToTop, 50); }}
                className="w-full flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground text-sm py-2 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Etapa anterior
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPhase;
