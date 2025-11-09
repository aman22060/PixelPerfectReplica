import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RankCellProps {
  rank: number;
  isPinned: boolean;
  onPin: () => void;
}

export default function RankCell({ rank, isPinned, onPin }: RankCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="w-6 h-6"
        onClick={(e) => {
          e.stopPropagation();
          onPin();
        }}
        data-testid={`button-pin-${rank}`}
      >
        <Pin className={`w-3 h-3 ${isPinned ? 'fill-primary text-primary' : ''}`} />
      </Button>
      <span className="text-sm text-muted-foreground font-mono">{rank}</span>
    </div>
  );
}
