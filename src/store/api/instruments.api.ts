import { TIMEFRAMES, TIMEZONES, TIME_SESSIONS } from '@/utils/constants';
import { api } from '.';

export type TTimeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

export type TTimezone = (typeof TIMEZONES)[keyof typeof TIMEZONES];

export type TTimezoneCities = keyof typeof TIMEZONES;

export type TInstrument = null | 'consecutiveCandles';

export interface ITimeFilter {
  id: string;
  orderNumber: number;
  timeRange: string;
  timeRangeName?: (typeof TIME_SESSIONS)[number]['name'];
}

export interface IInstrumentParams extends Record<string, string | string[]> {
  symbol: string;
  timeframe: TTimeframe;
  startDate: string;
  endDate: string;
  timezone: TTimezoneCities;
  timeFilters: string[];
}

export interface IStats {
  amount: number;
  percentage: number;
}

export interface ITestResults {
  bullish: Record<string, IStats>;
  bearish: Record<string, IStats>;
  overall: Record<string, IStats>;
}

const instrumentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEarliestTimestamp: build.query<{ datetime: string }, { symbol: string; timeframe: TTimeframe }>({
      query: (params) => ({
        url: '/instruments/earliest-timestamp',
        params,
      }),
    }),
    testConsecutiveCandles: build.query<ITestResults, IInstrumentParams>({
      query: (params) => ({
        url: '/instruments/consecutive-candles',
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetEarliestTimestampQuery, useLazyTestConsecutiveCandlesQuery } = instrumentApi;
