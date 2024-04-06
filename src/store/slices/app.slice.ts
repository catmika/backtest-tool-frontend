import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reset } from '../api';

export interface IAppState {
  isModalActive: boolean;
}

const initialState: IAppState = {
  isModalActive: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsModalActive: (state, action: PayloadAction<boolean>) => {
      state.isModalActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reset, () => {
      return initialState;
    });
  },
});

export const { setIsModalActive } = appSlice.actions;

export const appReducer = appSlice.reducer;
