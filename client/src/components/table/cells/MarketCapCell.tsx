import { formatCurrency } from '@/utils/format';

interface MarketCapCellProps {
  marketCap: number;
}

export default function MarketCapCell({ marketCap }: MarketCapCellProps) {
  return (
    <span className="font-mono text-sm" data-testid="marketcap-cell">
      {formatCurrency(marketCap)}
    </span>
  );
}
