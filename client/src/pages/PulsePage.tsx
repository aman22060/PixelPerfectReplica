import { useCallback, useState } from 'react';
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
import { generateMockTokens } from '@/utils/mockData';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { useMemo } from 'react';

export default function PulsePage() {
  const dispatch = useDispatch();
  const { activeTab, sortConfigs, searchQuery, pinnedTokenIds } = useSelector(
    (state: RootState) => state.table
  );
  const { density, selectedTokenId } = useSelector(
    (state: RootState) => state.ui
  );

  //todo: remove mock functionality
  const [mockTokens] = useState(() => generateMockTokens(50, activeTab));
  const { tokens: liveTokens, priceFlashes } = usePriceUpdates(mockTokens);

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return liveTokens;
    const query = searchQuery.toLowerCase();
    return liveTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
    );
  }, [liveTokens, searchQuery]);

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

  const selectedToken = liveTokens.find((t) => t.id === selectedTokenId) || null;

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
          tokens={filteredTokens}
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
        token={selectedToken}
        open={!!selectedTokenId}
        onClose={() => dispatch(setSelectedTokenId(null))}
      />
    </div>
  );
}
