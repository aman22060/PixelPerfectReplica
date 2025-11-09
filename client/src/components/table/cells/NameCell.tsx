import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NameCellProps {
  icon: string;
  symbol: string;
  name: string;
}

export default function NameCell({ icon, symbol, name }: NameCellProps) {
  return (
    <div className="flex items-center gap-3" data-testid={`name-cell-${symbol}`}>
      <Avatar className="w-6 h-6">
        <AvatarImage src={icon} alt={symbol} />
        <AvatarFallback className="text-xs">{symbol.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{symbol}</span>
        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
    </div>
  );
}
