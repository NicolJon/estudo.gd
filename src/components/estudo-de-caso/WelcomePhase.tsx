import logoGd from '@/assets/logo-gd.png';
import { CheckCircle } from 'lucide-react';

interface WelcomePhaseProps {
  onStart: () => void;
}

const WelcomePhase = ({ onStart }: WelcomePhaseProps) => {
  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-[640px] bg-card rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <a href="https://guellesdelgado.lovable.app"><img src={logoGd} alt="GD Co." className="h-16 w-16 mx-auto mb-6 rounded-lg" /></a>

        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
          Ferramenta Interna — GD Co.
        </span>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-display">
          Estudo de Caso
        </h1>

        <p className="text-muted-foreground font-body text-sm md:text-base mb-8 max-w-md mx-auto">
          Preencha os dados da clínica e gere um estudo completo para apresentar ao cliente.
        </p>

        <div className="space-y-3 text-left max-w-sm mx-auto mb-10">
          {[
            'Análise por 3 pilares (30 indicadores)',
            'Mapeamento de gargalos operacionais',
            'Narrativa de venda estruturada',
            'Orçamento PDF com logo GD Co.',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground font-body">{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-4 px-6 rounded-xl text-base transition-colors"
        >
          INICIAR ESTUDO DE CASO
        </button>
      </div>
    </div>
  );
};

export default WelcomePhase;
