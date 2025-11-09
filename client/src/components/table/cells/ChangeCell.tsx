import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercentage } from '@/utils/format';

interface ChangeCellProps {
  change: number;
}

export default function ChangeCell({ change }: ChangeCellProps) {
  const isPositive = change >= 0;
  
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-gain' : 'text-loss'}`} data-testid="change-cell">
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span className="font-mono text-sm">{formatPercentage(change)}</span>
    </div>
  );
}
