import { MONTHS, TIMEFRAMES, TIMEZONES, TIME_SESSIONS, WEEKDAYS, WEEKS } from '@/utils/constants';
import { api } from '.';

export type TTimeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

export type TTimeRanges = (typeof TIME_SESSIONS)[number]['name']

export type TWeekdays = (typeof WEEKDAYS)[keyof typeof WEEKDAYS];

export type TWeeks = (typeof WEEKS)[keyof typeof WEEKS];

export type TMonths = (typeof MONTHS)[keyof typeof MONTHS];

export type TTimezone = (typeof TIMEZONES)[keyof typeof TIMEZONES];

export type TTimezoneCities = keyof typeof TIMEZONES;

export type TInstrument = null | 'consecutiveCandles';

export type TTimeFilterType = 'day' | 'week' | 'month' | 'year';

export type TTimeRangeNameOptions = TTimeRanges | TWeekdays | TWeeks | TMonths

export interface ITimeFilter {
  id: string | number;
  type: TTimeFilterType;
  timeRange: string;
  timeRangeName?: TTimeRangeNameOptions;
}

export interface IInstrumentParams extends Record<string, string | string[]> {
  symbol: string;
  timeframe: TTimeframe;
  startDate: string;
  endDate: string;
  timezone: TTimezoneCities;
  timeFiltersDay: string[];
  timeFiltersWeek: string[];
  timeFiltersMonth: string[];
  timeFiltersYear: string[];
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
