import { MARKETS } from '@/utils/constants';
import { api } from '.';

export type TMarket = (typeof MARKETS)[keyof typeof MARKETS]['value'];

export type TMarketLabels = 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'ETF';

export interface ISymbol {
  shortName: string;
  fullName: string;
  market: TMarket;
  exchanges: string[];
}

export interface IPagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  market?: string;
}

const symbolApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSymbols: build.query<{ results: ISymbol[]; totalCount?: number }, IPagination>({
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
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetSymbolsQuery, useLazyGetSymbolsQuery } = symbolApi;
