import { api } from '.';

export type TMarket = 'indices' | 'stocks' | 'crypto' | 'forex' | 'bonds';

export interface ISymbol {
  shortName: string;
  fullName: string;
  market: TMarket;
  exchange: string;
}

export interface IPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  market?: TMarket;
}

export const abortController = new AbortController();

const symbolApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSymbols: build.query<ISymbol[], IPagination>({
      query: (params) => ({
        url: '/symbols',
        params: {
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          search: params.search,
          market: params.market,
        },
        signal: abortController.signal,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetSymbolsQuery, useLazyGetSymbolsQuery } = symbolApi;
