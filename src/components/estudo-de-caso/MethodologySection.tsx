const ETAPAS = [
  {
    num: 1,
    titulo: 'Growth Class',
    descricao: 'Alinhamento completo de cultura, processos e cadência de entregáveis dos primeiros 90 dias.',
    responsavel: 'COO conduz',
  },
  {
    num: 2,
    titulo: 'Kick Off',
    descricao: 'Plataforma enviada ao cliente para preenchimento completo das informações comerciais.',
    responsavel: 'Analista de CRM',
  },
  {
    num: 3,
    titulo: 'Apresentação de Planejamento',
    descricao: 'Estrutura completa do projeto apresentada ao cliente antes da execução começar.',
    responsavel: 'COO + CRM',
  },
  {
    num: 4,
    titulo: 'Início da Execução',
    descricao: 'Semana 1 começa. Time operacional entra em campo com o cronograma de 12 semanas ativo.',
    responsavel: 'Ongoing',
  },
];

const MethodologySection = () => {
  return (
    <section className="bg-card py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-display mb-1">Nossa Metodologia</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">Como transformamos diagnóstico em resultado</h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {ETAPAS.map((etapa, i) => (
              <div key={etapa.num} className="relative flex gap-6 items-start">
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold font-display text-lg">{etapa.num}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-background border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <h3 className="text-base font-bold text-foreground font-display">{etapa.titulo}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {etapa.responsavel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{etapa.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
