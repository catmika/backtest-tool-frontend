import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IUser } from '../slices/user.slice';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';

const baseQuery = fetchBaseQuery({ baseUrl: process.env.BACK_END_BASE_URL });

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const { dispatch } = api;
  try {
    const options: FetchArgs = {
      ...extraOptions,
      ...(typeof args === 'string' ? { url: process.env.BACK_END_BASE_URL + args } : args),
      credentials: 'include',
    };
    const data = await baseQuery(options, api, extraOptions);
    if (data.error) {
      throw data.error;
    }
    return data;
  } catch (error: any) {
    if (error.status === 401) {
      try {
        await baseQuery(
          {
            url: '/refresh',
            method: 'POST',
            credentials: 'include',
          },
          api,
          extraOptions,
        );
        const options: FetchArgs = {
          ...extraOptions,
          ...(typeof args === 'string' ? { url: process.env.BACK_END_BASE_URL + args } : args),
          credentials: 'include',
        };
        return await baseQuery(options, api, extraOptions);
      } catch (refreshError) {
        dispatch(logout({}));
        throw refreshError;
      }
    }
    throw error;
  }
};

export const reset = createAction('reset');

export const logout = createAsyncThunk('logout', async ({ navigate }: { navigate?: NavigateFunction }, thunkApi) => {
  await fetch(`${process.env.BACK_END_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  thunkApi.dispatch(reset());
  if (window.location.pathname !== '/login') {
    navigate ? navigate('/login') : window.location.replace('/login');
  }
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getUser: build.query<IUser, void>({
      query: () => '/user',
    }),
    signin: build.mutation<void, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/signin',
        method: 'POST',
        body: { email, password },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    signinGoogle: build.mutation<void, { credential: string }>({
      query: ({ credential }) => ({
        url: '/signin-google',
        method: 'POST',
        body: { credential },
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    }),
    signup: build.mutation<void, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/signup',
        method: 'POST',
        body: { email, password },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    forgotPassword: build.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/forgot-password',
        method: 'POST',
        body: { email },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    resetPassword: build.mutation<void, { token: string; newPassword: string }>({
      query: ({ token, newPassword }) => ({
        url: `/reset-password?token=${token}`,
        method: 'POST',
        body: { newPassword },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useGetUserQuery, useSigninMutation, useSigninGoogleMutation, useSignupMutation, useForgotPasswordMutation, useResetPasswordMutation } =
  api;
