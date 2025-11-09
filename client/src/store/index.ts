import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import tableReducer from './tableSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    table: tableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
