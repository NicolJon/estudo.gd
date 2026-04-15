import { useCountUp } from '@/hooks/useCountUp';

interface FunnelChartProps {
  leadsMes: number;
  cirurgiasAtuais: number;
  cirurgiasPotencial: number;
  cirurgiasPerdidas: number;
}

const FunnelChart = ({ leadsMes, cirurgiasAtuais, cirurgiasPotencial, cirurgiasPerdidas }: FunnelChartProps) => {
  const animLeads = useCountUp(leadsMes);
  const animAtuais = useCountUp(cirurgiasAtuais);
  const animPotencial = useCountUp(cirurgiasPotencial);
  const animPerdidas = useCountUp(cirurgiasPerdidas);

  const maxWidth = 100;
  const atualRespondidos = Math.round(leadsMes * 0.6);
  const atualAgendados = Math.round(atualRespondidos * 0.4);
  const potRespondidos = leadsMes;
  const potAgendados = Math.round(potRespondidos * 0.65);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Funil Atual */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Funil Atual</h4>
          <div className="space-y-3">
            <FunnelBar label={`${animLeads} leads/mês`} width={maxWidth} color="hsl(var(--border))" textColor="text-muted-foreground" />
            <FunnelBar label={`${atualRespondidos} respondidos`} width={(atualRespondidos / leadsMes) * maxWidth} color="hsl(var(--muted))" textColor="text-muted-foreground" />
            <FunnelBar label={`${atualAgendados} agendados`} width={(atualAgendados / leadsMes) * maxWidth} color="hsl(var(--muted))" textColor="text-muted-foreground" />
            <FunnelBar label={`${animAtuais} cirurgias/mês`} width={(cirurgiasAtuais / leadsMes) * maxWidth} color="hsl(var(--muted-foreground))" textColor="text-foreground" bold />
          </div>
        </div>

        {/* Funil Potencial */}
        <div>
          <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 text-center">Funil Potencial</h4>
          <div className="space-y-3">
            <FunnelBar label={`${animLeads} leads/mês`} width={maxWidth} color="hsl(var(--primary) / 0.3)" textColor="text-primary" />
            <FunnelBar label={`${potRespondidos} respondidos (100%)`} width={(potRespondidos / leadsMes) * maxWidth} color="hsl(var(--primary) / 0.5)" textColor="text-primary" />
            <FunnelBar label={`${potAgendados} agendados`} width={(potAgendados / leadsMes) * maxWidth} color="hsl(var(--primary) / 0.7)" textColor="text-primary" />
            <FunnelBar label={`${animPotencial} cirurgias/mês`} width={(cirurgiasPotencial / leadsMes) * maxWidth} color="hsl(var(--primary))" textColor="text-primary" bold />
          </div>
        </div>
      </div>

      {/* Gap text */}
      <div className="text-center py-4 bg-destructive/5 rounded-xl border border-destructive/20">
        <p className="text-status-critical font-semibold text-lg font-display">
          {animPerdidas} cirurgias/mês não realizadas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <KPICard value={animAtuais} label="Cirurgias realizadas hoje" color="text-muted-foreground" />
        <KPICard value={animPerdidas} label="Cirurgias perdidas por mês" color="text-status-critical" />
        <KPICard value={animPotencial} label="Potencial com GD Co." color="text-primary" />
      </div>
    </div>
  );
};

const FunnelBar = ({ label, width, color, textColor, bold }: { label: string; width: number; color: string; textColor: string; bold?: boolean }) => (
  <div>
    <div className="h-10 rounded-lg flex items-center px-3 transition-all duration-700" style={{ width: `${Math.max(width, 30)}%`, backgroundColor: color }}>
      <span className={`text-xs ${bold ? 'font-bold' : 'font-medium'} ${textColor} truncate`}>{label}</span>
    </div>
  </div>
);

const KPICard = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="bg-card rounded-xl border border-border p-4 text-center">
    <p className={`text-2xl md:text-3xl font-bold font-display ${color}`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-1 font-body">{label}</p>
  </div>
);

export default FunnelChart;
