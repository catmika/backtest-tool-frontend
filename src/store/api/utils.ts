import { FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export function isErrorWithMessage(error: unknown): error is {
  status: any;
  data: { message: string };
} {
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
