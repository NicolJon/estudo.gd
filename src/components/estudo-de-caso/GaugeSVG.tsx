import { useCountUp } from '@/hooks/useCountUp';
import type { Status } from './types';

interface GaugeSVGProps {
  score: number;
  label: string;
  status: Status;
  highlight?: boolean;
}

const STATUS_COLORS: Record<Status, string> = {
  ok: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const GaugeSVG = ({ score, label, status, highlight }: GaugeSVGProps) => {
  const animatedScore = useCountUp(score, 1200);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = STATUS_COLORS[status];

  return (
    <div className={`bg-card rounded-2xl p-6 text-center ${highlight ? 'ring-2 ring-destructive/50 bg-destructive/5' : 'border border-border'}`}>
      <svg width="150" height="150" viewBox="0 0 150 150" className="mx-auto">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
          className="transition-all duration-1000 ease-out"
        />
        <text x="75" y="70" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
          {animatedScore}
        </text>
        <text x="75" y="90" textAnchor="middle" fill={color} fontSize="12" fontFamily="'Plus Jakarta Sans', sans-serif">
          /100
        </text>
      </svg>
      <h3 className="font-semibold text-foreground mt-3 font-display">{label}</h3>
      <span
        className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mt-2"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {status === 'ok' ? 'BOM' : status === 'warning' ? 'ATENÇÃO' : 'CRÍTICO'}
      </span>
    </div>
  );
};

export default GaugeSVG;
