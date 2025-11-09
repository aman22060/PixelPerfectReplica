import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo, useCallback } from 'react';
import type { Token, SortColumn, SortDirection, SortConfig } from '@shared/schema';
import TokenRow from './TokenRow';
import TableHeader from './TableHeader';
import SkeletonRow from './SkeletonRow';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TokenTableProps {
  tokens: Token[];
  isLoading?: boolean;
  pinnedTokenIds: string[];
  onTogglePin: (tokenId: string) => void;
  onTokenClick: (token: Token) => void;
  density: 'compact' | 'comfortable';
  sortConfigs: SortConfig[];
  onSort: (column: SortColumn, shiftKey: boolean) => void;
  priceFlashes: Map<string, 'gain' | 'loss'>;
}

export default function TokenTable({
  tokens,
  isLoading,
  pinnedTokenIds,
  onTogglePin,
  onTokenClick,
  density,
  sortConfigs,
  onSort,
  priceFlashes,
}: TokenTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowHeight = density === 'compact' ? 48 : 64;

  const sortedTokens = useMemo(() => {
    if (sortConfigs.length === 0) return tokens;

    return [...tokens].sort((a, b) => {
      for (const config of sortConfigs) {
        const aVal = a[config.column];
        const bVal = b[config.column];
        
        if (aVal === bVal) continue;
        
        const comparison = aVal > bVal ? 1 : -1;
        return config.direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }, [tokens, sortConfigs]);

  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 15 : sortedTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const handleSort = useCallback((column: SortColumn, shiftKey: boolean) => {
    onSort(column, shiftKey);
  }, [onSort]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center gap-4 px-4 h-10">
          <div className="w-12">
            <span className="text-xs font-medium text-muted-foreground">#</span>
          </div>
          <div className="flex-1 min-w-[180px]">
            <span className="text-xs font-medium">Token</span>
          </div>
          <div className="w-32 flex justify-end">
            <TableHeader
              column="price"
              label="Price"
              sortConfigs={sortConfigs}
              onSort={handleSort}
              align="right"
            />
          </div>
          <div className="w-24">
            <TableHeader
              column="change24h"
              label="24h %"
              sortConfigs={sortConfigs}
              onSort={handleSort}
            />
          </div>
          <div className="w-24">
            <TableHeader
              column="change7d"
              label="7d %"
              sortConfigs={sortConfigs}
              onSort={handleSort}
            />
          </div>
          <div className="w-28 flex justify-end">
            <TableHeader
              column="volume24h"
              label="Volume"
              sortConfigs={sortConfigs}
              onSort={handleSort}
              align="right"
            />
          </div>
          <div className="w-32 flex justify-end">
            <TableHeader
              column="marketCap"
              label="Market Cap"
              sortConfigs={sortConfigs}
              onSort={handleSort}
              align="right"
            />
          </div>
          <div className="w-32">
            <span className="text-xs font-medium">Tags</span>
          </div>
          <div className="w-12"></div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          ref={parentRef}
          className="relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {isLoading ? (
            Array.from({ length: 15 }).map((_, i) => (
              <SkeletonRow key={i} density={density} />
            ))
          ) : (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const token = sortedTokens[virtualRow.index];
              if (!token) return null;

              return (
                <div
                  key={token.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <TokenRow
                    token={token}
                    isPinned={pinnedTokenIds.includes(token.id)}
                    onPin={() => onTogglePin(token.id)}
                    onClick={() => onTokenClick(token)}
                    density={density}
                    priceFlash={priceFlashes.get(token.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
