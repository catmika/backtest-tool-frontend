import { createSlice } from '@reduxjs/toolkit';
import { reset } from '../api';
import { api } from '../api';

export interface IUser {
  email: string;
  name: string;
}

export interface IUserState {
  userData: IUser | null;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  userData: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(reset, () => {
      return initialState;
    });
    builder.addMatcher(api.endpoints.signin.matchFulfilled, (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    });
    builder.addMatcher(api.endpoints.signinGoogle.matchFulfilled, (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export const userReducer = userSlice.reducer;
