import { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import {
  setActiveTab,
  setSortConfigs,
  setSearchQuery,
  togglePinToken,
} from '@/store/tableSlice';
import { setDensity, setSelectedTokenId } from '@/store/uiSlice';
import TokenTable from '@/components/table/TokenTable';
import TabNav from '@/components/toolbar/TabNav';
import SearchBox from '@/components/toolbar/SearchBox';
import DensityToggle from '@/components/toolbar/DensityToggle';
import TokenDetailModal from '@/components/modals/TokenDetailModal';
import ThemeToggle from '@/components/ThemeToggle';
import type { SortColumn, SortDirection, Token } from '@shared/schema';
import { useTokens } from '@/hooks/useTokens';
import { useTokenDetail } from '@/hooks/useTokenDetail';
import { useWebSocket } from '@/hooks/useWebSocket';
import { queryClient } from '@/lib/queryClient';

type Flash = 'gain' | 'loss';

type TokensResponseUI = {
  items: any[];
  page: number;
  pageSize: number;
  total: number;
};

const toStringNum = (v: unknown) =>
  typeof v === 'string' ? v : String(v ?? '0');

export default function PulsePage() {
  const dispatch = useDispatch();
  const { activeTab, sortConfigs, searchQuery, pinnedTokenIds } = useSelector(
    (state: RootState) => state.table
  );
  const { density, selectedTokenId } = useSelector(
    (state: RootState) => state.ui
  );

  const [priceFlashes, setPriceFlashes] = useState<Map<string, Flash>>(new Map());

  const uiTab = activeTab === 'final' ? 'final-stretch' : activeTab;

  const { data: tokensData, isLoading } = useTokens({
    tab: uiTab as any,          
    page: 1,
    pageSize: 50,
    search: searchQuery,
    sort: sortConfigs,
  });


  const { data: tokenDetail } = useTokenDetail(selectedTokenId || undefined);

  useWebSocket({
    onPriceUpdate: useCallback((update) => {
   
      queryClient.setQueryData(
        ['/api/tokens', uiTab, 1, 50, searchQuery, sortConfigs],
        (old: TokensResponseUI | undefined) => {
          if (!old || !Array.isArray(old.items)) return old;

          const idx = old.items.findIndex((t: any) => t.id === update.id);
          if (idx === -1) return old;

          const curr = old.items[idx];
          const currPriceNum = Number(curr.price ?? 0);
          const isGain = Number(update.price) > currPriceNum;

     
          setPriceFlashes(prev => {
            const next = new Map(prev);
            next.set(update.id, isGain ? 'gain' : 'loss');
            return next;
          });
          setTimeout(() => {
            setPriceFlashes(prev => {
              const next = new Map(prev);
              next.delete(update.id);
              return next;
            });
          }, 600);

          const newItems = [...old.items];
    
          newItems[idx] = { ...curr, price: String(update.price) };

          return { ...old, items: newItems };
        }
      );
    }, [uiTab, searchQuery, sortConfigs]),
    enabled: true,
  });


  const tokens = useMemo<Token[]>(() => {
    const src = tokensData?.items || [];
    return src.map((t: any) => ({
      symbol: String(t.symbol ?? ''),
      id: String(t.id ?? ''),
      rank: Number(t.rank ?? 0),
      name: String(t.name ?? ''),
      icon: String(t.icon ?? ''),
      price: toStringNum(t.price),
      change24h: toStringNum(t.change24h),
      change7d: toStringNum(t.change7d),
      volume24h: toStringNum(t.volume24h),
      marketCap: toStringNum(t.marketCap),
      tags: Array.isArray(t.tags) ? t.tags : [],
      status: (t.status === 'final-stretch' ? 'final' : t.status) ?? 'new',
      description: t.description ?? null,
      website: t.website ?? null,
      twitter: t.twitter ?? null,
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt : new Date(),
    }));
  }, [tokensData]);

  const handleSort = useCallback((column: SortColumn, shiftKey: boolean) => {
    if (shiftKey) {
      dispatch(setSortConfigs([
        ...sortConfigs.filter(c => c.column !== column),
        {
          column,
          direction: (sortConfigs.find(c => c.column === column)?.direction === 'asc' ? 'desc' : 'asc') as SortDirection
        }
      ]));
    } else {
      const existingConfig = sortConfigs.find(c => c.column === column);
      dispatch(setSortConfigs([{
        column,
        direction: (existingConfig?.direction === 'asc' ? 'desc' : 'asc') as SortDirection
      }]));
    }
  }, [dispatch, sortConfigs]);

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Pulse</h1>
            <p className="text-sm text-muted-foreground">Token discovery & market insights</p>
          </div>
          <div className="flex items-center gap-2">
            <DensityToggle
              density={density}
              onToggle={() => dispatch(setDensity(density === 'compact' ? 'comfortable' : 'compact'))}
            />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <TabNav
            activeTab={activeTab}
            onTabChange={(tab) => dispatch(setActiveTab(tab))}
          />
          <SearchBox
            value={searchQuery}
            onChange={(value) => dispatch(setSearchQuery(value))}
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <TokenTable
          tokens={tokens}
          isLoading={isLoading}
          pinnedTokenIds={pinnedTokenIds}
          onTogglePin={(id) => dispatch(togglePinToken(id))}
          onTokenClick={(token) => dispatch(setSelectedTokenId(token.id))}
          density={density}
          sortConfigs={sortConfigs}
          onSort={handleSort}
          priceFlashes={priceFlashes}
        />
      </main>

      <TokenDetailModal
        token={tokenDetail || null}
        open={!!selectedTokenId}
        onClose={() => dispatch(setSelectedTokenId(null))}
      />
    </div>
  );
}
