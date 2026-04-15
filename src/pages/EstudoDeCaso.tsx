import { useState, useCallback } from 'react';
import type { Phase, FormData, Relatorio } from '@/components/estudo-de-caso/types';
import { gerarRelatorio } from '@/components/estudo-de-caso/analysis';
import WelcomePhase from '@/components/estudo-de-caso/WelcomePhase';
import FormPhase from '@/components/estudo-de-caso/FormPhase';
import ProcessingPhase from '@/components/estudo-de-caso/ProcessingPhase';
import ReportPhase from '@/components/estudo-de-caso/ReportPhase';

const EstudoDeCaso = () => {
  const [phase, setPhase] = useState<Phase>('WELCOME');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);

  const handleFormSubmit = useCallback((data: FormData) => {
    setFormData(data);
    setRelatorio(gerarRelatorio(data));
    setPhase('PROCESSING');
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setPhase('REPORT');
  }, []);

  return (
    <>
      {phase === 'WELCOME' && <WelcomePhase onStart={() => setPhase('FORM')} />}
      {phase === 'FORM' && <FormPhase onSubmit={handleFormSubmit} />}
      {phase === 'PROCESSING' && formData && (
        <ProcessingPhase nomeClinica={formData.nomeClinica} onComplete={handleProcessingComplete} />
      )}
      {phase === 'REPORT' && relatorio && <ReportPhase relatorio={relatorio} />}
    </>
  );
};

export default EstudoDeCaso;
