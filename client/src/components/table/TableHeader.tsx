import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SortColumn, SortDirection } from '@shared/schema';

interface TableHeaderProps {
  column: SortColumn;
  label: string;
  sortConfigs: Array<{ column: SortColumn; direction: SortDirection }>;
  onSort: (column: SortColumn, shiftKey: boolean) => void;
  align?: 'left' | 'right';
}

export default function TableHeader({ column, label, sortConfigs, onSort, align = 'left' }: TableHeaderProps) {
  const sortConfig = sortConfigs.find(c => c.column === column);
  const sortIndex = sortConfig ? sortConfigs.indexOf(sortConfig) : -1;
  
  const SortIcon = !sortConfig ? ArrowUpDown : sortConfig.direction === 'asc' ? ArrowUp : ArrowDown;
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 gap-1 text-xs font-medium hover-elevate ${align === 'right' ? 'justify-end' : 'justify-start'}`}
      onClick={(e) => onSort(column, e.shiftKey)}
      data-testid={`header-${column}`}
    >
      <span>{label}</span>
      <SortIcon className="w-3 h-3" />
      {sortIndex >= 0 && sortConfigs.length > 1 && (
        <span className="text-xs text-muted-foreground">
          {sortIndex + 1}
        </span>
      )}
    </Button>
  );
}
