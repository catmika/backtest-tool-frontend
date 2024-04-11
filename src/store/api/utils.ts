import { FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { showNotification } from '../slices/app.slice';

export function isErrorWithMessage(error: unknown): error is { data: { message: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as any).data === 'object' &&
    (error as any).data !== null &&
    'message' in (error as any).data &&
    typeof (error as any).data.message === 'string'
  );
}

export const baseQuery = fetchBaseQuery({ baseUrl: process.env.BACK_END_BASE_URL });

export async function sendRequest(args: string | FetchArgs, api: any, extraOptions: any) {
  const options: FetchArgs = {
    ...extraOptions,
    ...(typeof args === 'string' ? { url: process.env.BACK_END_BASE_URL + args } : args),
    credentials: 'include',
  };

  return await baseQuery(options, api, extraOptions);
}

export function displayNotification(api: any, error: any) {
  if (isErrorWithMessage(error)) {
    api.dispatch(showNotification({ message: error.data.message, type: 'error' }));
  } else {
    api.dispatch(showNotification({ message: 'Something went wrong', type: 'error' }));
  }
}
