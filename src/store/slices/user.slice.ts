import { createSlice } from '@reduxjs/toolkit';
import { reset } from '../api';
import { api } from '../api';

export interface IUser {
  email: string;
}

export interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(reset, () => {
      return initialState;
    });
    builder.addMatcher(api.endpoints.getUser.matchFulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
      }
    });
  },
});

export const userReducer = userSlice.reducer;
