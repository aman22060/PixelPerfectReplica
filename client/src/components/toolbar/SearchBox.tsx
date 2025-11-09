import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative w-64 flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />

      <Input
        type="search"
        placeholder="Search tokens..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-9 pr-9"
        data-testid="input-search"
      />
      {localValue && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 flex items-center justify-center"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          data-testid="button-clear-search"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
