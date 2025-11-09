import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  density: 'compact' | 'comfortable';
  selectedTokenId: string | null;
}

const initialState: UiState = {
  density: 'comfortable',
  selectedTokenId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDensity: (state, action: PayloadAction<'compact' | 'comfortable'>) => {
      state.density = action.payload;
    },
    setSelectedTokenId: (state, action: PayloadAction<string | null>) => {
      state.selectedTokenId = action.payload;
    },
  },
});

export const { setDensity, setSelectedTokenId } = uiSlice.actions;
export default uiSlice.reducer;
