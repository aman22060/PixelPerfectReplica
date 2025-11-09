import { LayoutList, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DensityToggleProps {
  density: 'compact' | 'comfortable';
  onToggle: () => void;
}

export default function DensityToggle({ density, onToggle }: DensityToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggle}
          data-testid="button-density-toggle"
        >
          {density === 'compact' ? (
            <List className="w-4 h-4" />
          ) : (
            <LayoutList className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{density === 'compact' ? 'Comfortable view' : 'Compact view'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
