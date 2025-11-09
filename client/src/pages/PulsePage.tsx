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
import type { SortColumn, SortDirection } from '@shared/schema';
import { useTokens } from '@/hooks/useTokens';
import { useTokenDetail } from '@/hooks/useTokenDetail';
import { useWebSocket } from '@/hooks/useWebSocket';
import { queryClient } from '@/lib/queryClient';

export default function PulsePage() {
  const dispatch = useDispatch();
  const { activeTab, sortConfigs, searchQuery, pinnedTokenIds } = useSelector(
    (state: RootState) => state.table
  );
  const { density, selectedTokenId } = useSelector(
    (state: RootState) => state.ui
  );

  const [priceFlashes, setPriceFlashes] = useState<Map<string, 'gain' | 'loss'>>(new Map());

  const { data: tokensData, isLoading } = useTokens({
    tab: activeTab,
    page: 1,
    pageSize: 50,
    search: searchQuery,
    sort: sortConfigs,
  });

  const { data: tokenDetail } = useTokenDetail(selectedTokenId);

  useWebSocket({
    onPriceUpdate: useCallback((update) => {
      queryClient.setQueryData(
        ['/api/tokens', activeTab, 1, 50, searchQuery, sortConfigs],
        (old: any) => {
          if (!old) return old;
          
          const tokenIndex = old.data.findIndex((t: any) => t.id === update.id);
          if (tokenIndex === -1) return old;
          
          const token = old.data[tokenIndex];
          const isGain = update.price > token.price;
          
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
          
          const newData = [...old.data];
          newData[tokenIndex] = { ...token, price: update.price };
          
          return { ...old, data: newData };
        }
      );
    }, [activeTab, searchQuery, sortConfigs]),
    enabled: true,
  });

  const tokens = useMemo(() => tokensData?.data || [], [tokensData]);

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
