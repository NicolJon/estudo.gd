import { Check, Star, Shield } from 'lucide-react';
import { formatarMoeda } from './analysis';

interface ProductCatalogProps {
  nivelRecomendado: 1 | 2 | 3;
  retornoEstimado: number;
}

const PRODUTOS = [
  {
    nivel: 1 as const,
    nome: 'IMPLEMENTAÇÃO',
    prazo: '90 Dias',
    investimento: 15000,
    items: [
      'Estudo da Base Atual',
      'Treinamento Secretária',
      'Treinamento Gestora Comercial',
      'Desenvolvimento de Funil de Vendas',
      'Treinamento CRM',
      'Prova de Capacitação',
      'Trabalho na Base de Leads',
    ],
    inclui: null,
  },
  {
    nivel: 2 as const,
    nome: 'MANUTENÇÃO',
    prazo: '06 Meses',
    investimento: 24000,
    items: [
      'Otimização de Processos',
      'One a One',
      'PDI',
      'Plano de Metas',
      'Metrificação de Processos',
      'Novo Estudo de Caso Comercial',
    ],
    inclui: 'Inclui tudo do Nível 01',
  },
  {
    nivel: 3 as const,
    nome: 'ESCALA',
    prazo: '12 Meses',
    investimento: 42000,
    badge: 'ESCALA MÁXIMA',
    items: [
      'Crescimento de Time',
      'Auditoria de Atendimento',
      'Cliente Oculto',
      'Desenvolvimento de Estratégia de Aquisição',
      'Execução de Performance',
    ],
    inclui: 'Inclui tudo dos Níveis 01 e 02',
  },
];

const ProductCatalog = ({ nivelRecomendado, retornoEstimado }: ProductCatalogProps) => {
  return (
    <section className="bg-surface-dark py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/40 font-display mb-1">
            Catálogo de Serviços
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground font-display">
            Soluções Disponíveis
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {PRODUTOS.map((produto) => {
            const isRecommended = produto.nivel === nivelRecomendado;

            return (
              <div
                key={produto.nivel}
                className={`
                  relative rounded-2xl p-8 transition-transform
                  ${isRecommended
                    ? 'bg-primary text-primary-foreground scale-[1.03] shadow-2xl shadow-primary/20'
                    : 'bg-primary-foreground/[0.04] border border-primary-foreground/10 text-primary-foreground'
                  }
                `}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 bg-primary-foreground text-surface-dark text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-display">
                    <Star className="h-3 w-3" />
                    Recomendado para você
                  </div>
                )}

                {produto.badge && !isRecommended && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/60 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full font-display">
                    <Shield className="h-3 w-3" />
                    {produto.badge}
                  </div>
                )}

                <p className={`text-[10px] tracking-[0.15em] uppercase font-display mb-1 mt-2 ${isRecommended ? 'text-primary-foreground/70' : 'text-primary-foreground/40'}`}>
                  Nível {String(produto.nivel).padStart(2, '0')}
                </p>
                <h3 className="text-xl font-bold font-display mb-4 text-primary-foreground">
                  {produto.nome}
                </h3>

                <div className="mb-4">
                  <p className={`text-[10px] uppercase tracking-wider font-display mb-0.5 ${isRecommended ? 'text-primary-foreground/60' : 'text-primary-foreground/40'}`}>Prazo:</p>
                  <p className="text-sm font-bold text-primary-foreground">{produto.prazo}</p>
                </div>

                <div className="mb-6">
                  <p className={`text-[10px] uppercase tracking-wider font-display mb-0.5 ${isRecommended ? 'text-primary-foreground/60' : 'text-primary-foreground/40'}`}>Investimento:</p>
                  <p className="text-2xl font-bold font-display text-primary-foreground">{formatarMoeda(produto.investimento)}</p>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {produto.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isRecommended ? 'text-primary-foreground' : 'text-primary'}`} />
                      <span className={`text-[13px] leading-snug ${isRecommended ? 'text-primary-foreground/90' : 'text-primary-foreground/70'}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                {produto.inclui && (
                  <p className={`text-[11px] font-medium ${isRecommended ? 'text-primary-foreground/70' : 'text-primary/80'}`}>{produto.inclui}</p>
                )}

                {isRecommended && retornoEstimado > 0 && (
                  <div className="mt-6 rounded-xl p-4 text-center bg-primary-foreground/15">
                    <p className="text-[10px] uppercase tracking-wider font-display text-primary-foreground/70 mb-1">Retorno estimado nos primeiros 90 dias</p>
                    <p className="text-lg font-bold font-display text-primary-foreground">{formatarMoeda(retornoEstimado)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
