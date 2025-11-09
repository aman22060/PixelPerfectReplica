import { formatPrice } from '@/utils/format';

interface PriceCellProps {
  price: number;
  flash?: 'gain' | 'loss' | null;
}

export default function PriceCell({ price, flash }: PriceCellProps) {
  return (
    <span 
      className={`font-mono text-sm ${flash === 'gain' ? 'price-flash-gain' : flash === 'loss' ? 'price-flash-loss' : ''}`}
      data-testid="price-cell"
    >
      ${formatPrice(price)}
    </span>
  );
}
