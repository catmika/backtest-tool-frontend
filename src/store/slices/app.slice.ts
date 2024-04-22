import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reset } from '../api';

interface INotificationData {
  title?: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number | null;
}

export interface IAppState {
  isNotificationVisible: boolean;
  notificationData: INotificationData;
  mode: 'dark' | 'light';
}

const initialState: IAppState = {
  isNotificationVisible: false,
  notificationData: {
    title: '',
    message: '',
    type: 'warning',
    duration: 5000,
  },
  mode: 'dark',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<INotificationData>) => {
      state.isNotificationVisible = true;
      state.notificationData = action.payload;
      if (!action.payload.duration && action.payload.duration !== null) {
        state.notificationData.duration = 5000;
      }
    },
    hideNotification: (state) => {
      state.isNotificationVisible = false;
      state.notificationData = { ...state.notificationData, title: '', message: '', duration: 5000 };
    },
    setMode: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => {
      return initialState;
    });
  },
});

export const { showNotification, hideNotification, setMode } = appSlice.actions;

export const appReducer = appSlice.reducer;
