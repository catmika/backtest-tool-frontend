import React, { useState } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';

import Grid from '@mui/material/Unstable_Grid2';
import { Autocomplete, Box, CircularProgress, Divider, FormControl, Modal, TextField, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

import { useAppDispatch } from '@/store';
import { TMarket, useLazyGetSymbolsQuery } from '@/store/api/symbols.api';
import {
  IInstrumentParams,
  ITimeFilter,
  TInstrument,
  TTimeframe,
  TTimezone,
  TTimezoneCities,
  useGetEarliestTimestampQuery,
  useLazyTestConsecutiveCandlesQuery,
} from '@/store/api/instruments.api';
import { MARKETS, TIMEFRAMES, TIMEZONES } from '@/utils/constants';
import { debounce, isOptionEqualToValue } from '@/utils/helpers';
import { Button } from '@/components/Button';
import { BackdropLoader } from '@/components/BackdropLoader';
import { TimeFiltersModal } from './components/TimeFiltersModal';
import { ResultsModal } from './components/ResultsModal';
import InstrumentSpecifics from './InstrumentSpecifics';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const LabInstrument = () => {
  const { t } = useTranslation();

  const [instrument, setInstrument] = useState<{ value: TInstrument; label: string } | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [market, setMarket] = useState<{ value: TMarket; label: string } | null>(null);
  const [timeframe, setTimeframe] = useState<{ value: TTimeframe; label: string } | null>(null);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [timezone, setTimezone] = useState<{ value: TTimezoneCities; label: TTimezone }>({ value: 'Exchange', label: t('Exchange') });
  const [timeFiltersModalOpen, setTimeFiltersModalOpen] = useState(false);
  const [specifics, setSpecifics] = useState<Record<string, string>>({});
  const [ampmTimeFormat, setAmpmTimeFormat] = useState(true);
  const [timeFilters, setTimeFilters] = useState<ITimeFilter[]>([]);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [testData, setTestData] = useState({});

  const {
    data: earliestTimestampData,
    error: earliestTimestampError,
    isFetching: earliestTimestampIsFetching,
  } = useGetEarliestTimestampQuery({ symbol: symbol as string, timeframe: timeframe?.value as TTimeframe }, { skip: !symbol || !timeframe?.value });
  const [getSymbols, { error: symbolsError, isFetching: isSymbolsFetching }] = useLazyGetSymbolsQuery();
  const [testConsecutiveCandles, { error: consecutiveCandlesError, isFetching: isConsecutiveCandlesFetching }] = useLazyTestConsecutiveCandlesQuery();

  const markets = Object.values(MARKETS).map((market) => {
    return { value: market.value as TMarket, label: t(market.label) };
  });
  const timeframes = Object.entries(TIMEFRAMES).map((tf) => {
    return { value: tf[1], label: tf[0] };
  });
  const timezones = Object.entries(TIMEZONES).map((tz) => {
    return { value: tz[0] as TTimezoneCities, label: t(tz[1]) as TTimezone };
  });
  const instruments = [{ label: 'Consecutive candles', value: 'consecutiveCandles' }];

  const isIntraday = timeframe?.value !== '1day' && timeframe?.value !== '1week' && timeframe?.value !== '1month';
  const isLoading = isConsecutiveCandlesFetching;

  useErrorHandler(consecutiveCandlesError as ErrorResponse);

  const handleSymbolSearch = async (event: React.ChangeEvent<object>, value: string) => {
    if (value) {
      const response = await getSymbols({ search: value, market: market?.value, page: 1, limit: 100 });
      setSymbols(
        response?.data?.results?.map((symbol) => {
          if (!symbol.exchanges.length || symbol.exchanges.length > 1) {
            return symbol.shortName;
          } else {
            return `${symbol.exchanges[0]}:${symbol.shortName}`;
          }
        }) || [],
      );
    }
  };
  const debouncedHandleSymbolSearch = debounce(handleSymbolSearch, 300);

  const handleCloseTimeFiltersModal = () => {
    setTimeFiltersModalOpen(false);
  };

  const handleCloseResultsModal = () => {
    setResultsModalOpen(false);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (symbol && timeframe?.value && startDate && endDate) {
      const params: IInstrumentParams = {
        symbol,
        timeframe: timeframe?.value,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        timezone: timezone.value,
        timeFilters: timeFilters.map((filter) => filter.timeRange),
        ...specifics,
      };

      let response;

      switch (instrument?.value) {
        case 'consecutiveCandles':
          response = await testConsecutiveCandles(params);
          break;
        default:
          return;
      }

      if (response.data) {
        setResultsModalOpen(true);
        setTestData(response.data.overall);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid xs={12}>
          <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
            {t('Common settings')}
          </Typography>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <Autocomplete
              isOptionEqualToValue={isOptionEqualToValue}
              id='marketSelect'
              options={markets}
              value={market}
              onChange={(_, v) => setMarket(v)}
              renderInput={(params) => <TextField {...params} id='market' name='market' label={t('Market')} />}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <FormControl fullWidth>
            <Autocomplete
              noOptionsText={t('Start typing...')}
              id='symbolSelect'
              filterOptions={(x) => x}
              loading={isSymbolsFetching}
              options={symbols}
              value={symbol}
              onInputChange={debouncedHandleSymbolSearch}
              onChange={(_, v) => setSymbol(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  name='symbol'
                  label={t('Symbol')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isSymbolsFetching ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <Autocomplete
              isOptionEqualToValue={isOptionEqualToValue}
              id='instrumentSelect'
              options={instruments}
              value={instrument}
              onChange={(_, v) => setInstrument(v)}
              renderInput={(params) => <TextField {...params} required name='instrument' label={t('Instrument')} />}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={2}>
          <FormControl fullWidth>
            <Autocomplete
              isOptionEqualToValue={isOptionEqualToValue}
              id='timeframeSelect'
              options={timeframes}
              value={timeframe}
              onChange={(_, v) => setTimeframe(v)}
              renderInput={(params) => <TextField {...params} required name='timeframe' label={t('Timeframe')} />}
            />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Divider orientation='horizontal' flexItem />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid xs={12}>
          <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
            {t('Time')}
          </Typography>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <DatePicker
              minDate={moment(earliestTimestampData?.datetime)}
              maxDate={(endDate as Moment | undefined) || moment()}
              label={t('Start date')}
              disabled={!symbol || !timeframe}
              loading={earliestTimestampIsFetching}
              value={startDate}
              onChange={(newValue: Moment | null) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  required: true,
                  name: 'startDate',
                },
              }}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <DatePicker
              minDate={(startDate as Moment | undefined) || moment(earliestTimestampData?.datetime)}
              maxDate={moment()}
              label={t('End date')}
              disabled={!symbol || !timeframe}
              loading={earliestTimestampIsFetching}
              value={endDate}
              onChange={(newValue: Moment | null) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  required: true,
                  name: 'endDate',
                },
              }}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth>
            <Autocomplete
              disableClearable
              isOptionEqualToValue={isOptionEqualToValue}
              id='timeframeSelect'
              options={timezones}
              value={timezone}
              onChange={(_, v) => setTimezone(v)}
              renderInput={(params) => <TextField {...params} required name='timezone' label={t('Timezone')} />}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <FormControl fullWidth sx={{ height: '100%' }}>
            <Button variant='outlined' disabled={!isIntraday} sx={{ height: '100%' }} onClick={() => setTimeFiltersModalOpen(true)}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {timeFilters.length ? (
                  <Typography variant='body2' sx={{ textTransform: 'none' }}>
                    {timeFilters.length > 3
                      ? `${timeFilters
                          .slice(0, 3)
                          .map((filter) => `${filter.timeRangeName || filter.timeRange}`)
                          .join(', ')} +${timeFilters.length - 3}`
                      : timeFilters.map((filter) => filter.timeRangeName || filter.timeRange).join(', ')}
                  </Typography>
                ) : (
                  <Typography variant='body2'>{t('Add time filters')}</Typography>
                )}
                <Add />
              </Box>
            </Button>
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <Divider orientation='horizontal' flexItem />
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ height: '100%' }}>
        <Grid xs={12} sx={{ mb: 2 }}>
          <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
            {t('Instrument specifics')}
          </Typography>
        </Grid>
        <Grid container xs={12} sx={{ height: '100%' }}>
          <InstrumentSpecifics instrument={instrument ? instrument.value : null} setSpecifics={setSpecifics} />
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ justifyContent: 'flex-end' }}>
        <Button type='submit' variant='contained' sx={{ width: 150, height: 'max-content' }}>
          {t('Start')}
        </Button>
      </Grid>
      <Modal sx={{ overflow: 'auto' }} open={timeFiltersModalOpen} onClose={handleCloseTimeFiltersModal}>
        <TimeFiltersModal
          {...{ timeFilters, setTimeFilters, handleCloseTimeFiltersModal, timezone: timezone.label, ampmTimeFormat, setAmpmTimeFormat }}
        />
      </Modal>
      <Modal sx={{ overflow: 'auto' }} open={resultsModalOpen} onClose={handleCloseResultsModal}>
        <ResultsModal
          {...{
            testData,
            handleCloseResultsModal,
            market,
            symbol,
            instrument,
            timeframe,
            startDate,
            endDate,
            timezone,
            ampmTimeFormat,
            timeFilters,
          }}
        />
      </Modal>
      {isLoading && <BackdropLoader />}
    </form>
  );
};

export default LabInstrument;
