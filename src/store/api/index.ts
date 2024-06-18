import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi } from '@reduxjs/toolkit/query/react';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';
import i18n from '../../i18n';

import { IUser } from '../slices/user.slice';
import { setIsErrorHandled, showNotification } from '../slices/app.slice';
import { baseQuery, sendRequest } from './utils';
import { RootState } from '..';

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  api.dispatch(setIsErrorHandled(false));

  const data = await sendRequest(args, api, extraOptions);

  if (data.error && data.error.status === 401) {
    const refreshData = await baseQuery({ url: '/refresh', method: 'POST', credentials: 'include' }, api, extraOptions);

    if (refreshData.error) {
      await api.dispatch(logout());
      return refreshData;
    }

    const retryData = await sendRequest(args, api, extraOptions);

    if (retryData.error) {
      console.log('Retry error', retryData.error);
      return { error: retryData.error };
    }

    return retryData;
  }

  if (data.error && data.error.status === 500) {
    const { app } = api.getState() as RootState;
    if (!app.isErrorHandled) {
      api.dispatch(showNotification({ message: i18n.t('Something went wrong'), type: 'error' }));
    }
  }

  if (data.error) {
    console.log('Error', data.error);
    return { error: data.error };
  }

  return data;
};

export const reset = createAction('reset');

export const logout = createAsyncThunk('logout', async (navigate: NavigateFunction | undefined = undefined, thunkApi) => {
  try {
    await fetch(`${process.env.BACK_END_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    thunkApi.dispatch(reset());
    if (window.location.pathname !== '/signin') {
      navigate ? navigate('/signin') : window.location.replace('/signin');
    }
  } catch (error) {
    thunkApi.dispatch(showNotification({ message: i18n.t('Something went wrong'), type: 'error' }));
    thunkApi.dispatch(reset());
  }
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getUser: build.query<IUser, void>({
      query: () => '/user',
    }),
    signin: build.mutation<{ email: string; name: string }, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/signin',
        method: 'POST',
        body: { email, password },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    signinGoogle: build.mutation<{ email: string; name: string }, { credential: string }>({
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

export const {
  useLazyGetUserQuery,

  useSigninMutation,
  useSigninGoogleMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api;
