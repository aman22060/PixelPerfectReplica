import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortConfig, TabType } from '@shared/schema';

interface TableState {
  activeTab: TabType;
  sortConfigs: SortConfig[];
  searchQuery: string;
  pinnedTokenIds: string[];
}

const initialState: TableState = {
  activeTab: 'new',
  sortConfigs: [],
  searchQuery: '',
  pinnedTokenIds: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabType>) => {
      state.activeTab = action.payload;
    },
    setSortConfigs: (state, action: PayloadAction<SortConfig[]>) => {
      state.sortConfigs = action.payload;
    },
    addSortConfig: (state, action: PayloadAction<SortConfig>) => {
      const existingIndex = state.sortConfigs.findIndex(
        c => c.column === action.payload.column
      );
      if (existingIndex >= 0) {
        state.sortConfigs[existingIndex] = action.payload;
      } else {
        state.sortConfigs.push(action.payload);
      }
    },
    clearSort: (state) => {
      state.sortConfigs = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    togglePinToken: (state, action: PayloadAction<string>) => {
      const index = state.pinnedTokenIds.indexOf(action.payload);
      if (index >= 0) {
        state.pinnedTokenIds.splice(index, 1);
      } else {
        state.pinnedTokenIds.push(action.payload);
      }
    },
  },
});

export const {
  setActiveTab,
  setSortConfigs,
  addSortConfig,
  clearSort,
  setSearchQuery,
  togglePinToken,
} = tableSlice.actions;
export default tableSlice.reducer;
