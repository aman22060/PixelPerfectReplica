import { MoreVertical, ExternalLink, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionCellProps {
  tokenId: string;
}

export default function ActionCell({ tokenId }: ActionCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="w-8 h-8" 
          onClick={(e) => e.stopPropagation()}
          data-testid={`button-actions-${tokenId}`}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log('View details', tokenId)}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('Add to watchlist', tokenId)}>
          <Star className="w-4 h-4 mr-2" />
          Add to Watchlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log('Share', tokenId)}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
