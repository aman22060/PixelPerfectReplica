import { formatCurrency } from '@/utils/format';

interface VolumeCellProps {
  volume: number;
}

export default function VolumeCell({ volume }: VolumeCellProps) {
  return (
    <span className="font-mono text-sm" data-testid="volume-cell">
      {formatCurrency(volume)}
    </span>
  );
}
