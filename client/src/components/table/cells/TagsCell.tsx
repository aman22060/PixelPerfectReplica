import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TagsCellProps {
  tags: string[];
}

export default function TagsCell({ tags }: TagsCellProps) {
  if (tags.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  
  const displayTag = tags[0];
  const remainingCount = tags.length - 1;
  
  return (
    <div className="flex items-center gap-1" data-testid="tags-cell">
      <Badge variant="secondary" className="text-xs">
        {displayTag}
      </Badge>
      {remainingCount > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge variant="outline" className="text-xs cursor-pointer hover-elevate" data-testid="button-more-tags">
              +{remainingCount}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-2">
              <p className="text-sm font-medium">All Tags</p>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
