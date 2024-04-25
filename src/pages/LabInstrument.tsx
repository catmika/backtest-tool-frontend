import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Unstable_Grid2';
import { Autocomplete, Chip, CircularProgress, Divider, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { TMarket, useLazyGetSymbolsQuery } from '@/store/api/symbol.api';
import { MARKETS } from '@/utils/constants';
import { isOptionEqualToValue } from '@/utils/helpers';

const LabInstrument = () => {
  const [getSymbols, { data, isFetching }] = useLazyGetSymbolsQuery();

  const { t } = useTranslation();

  const [instrument, setInstrument] = useState<any>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [market, setMarket] = useState<{ value: TMarket; label: string } | null>(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const markets = Object.values(MARKETS).map((market) => {
    return {
      value: market,
      label: market.charAt(0).toUpperCase() + market.slice(1),
    };
  });
  const instruments = [{ label: 'PM/PW/PD Lows & Highs', value: 'PLH' }];

  let debounce: ReturnType<typeof setTimeout> | null = null;

  const handleSymbolSearch = async (event: any, value: any, reason: string) => {
    if (debounce) {
      clearTimeout(debounce);
    }
    if (value) {
      debounce = setTimeout(async () => {
        const response = await getSymbols({ search: value, market: market?.value });
        setSymbols(response?.data?.map((symbol) => `${symbol.exchange}:${symbol.shortName}`) || []);
      }, 300);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
          {t('Symbol')}
        </Typography>
        {/* <Chip label='Symbol' variant='filled' /> */}
      </Grid>
      <Grid xs={6}>
        <Autocomplete
          autoComplete
          disablePortal
          isOptionEqualToValue={isOptionEqualToValue}
          id='market-select'
          options={markets}
          value={market}
          onChange={(_, v) => setMarket(v)}
          renderInput={(params) => <TextField {...params} label={t('Market')} />}
        />
      </Grid>
      <Grid xs={6}>
        <Autocomplete
          autoComplete
          disablePortal
          noOptionsText={t('Start typing...')}
          id='symbol-select'
          filterOptions={(x) => x}
          loading={isFetching}
          options={symbols}
          value={symbol}
          onInputChange={handleSymbolSearch}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('Symbol')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isFetching ? <CircularProgress color='inherit' size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid xs={12}>
        <Divider orientation='horizontal' flexItem />
      </Grid>
      <Grid xs={12}>
        <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
          {t('Time')}
        </Typography>
      </Grid>
      <Grid xs='auto'>
        <DatePicker label={t('Start date')} value={startDate} onChange={(newValue: any) => setStartDate(newValue)} />
      </Grid>
      <Grid xs='auto'>
        <DatePicker label={t('End date')} value={endDate} onChange={(newValue: any) => setEndDate(newValue)} />
      </Grid>
    </Grid>
  );
};

export default LabInstrument;
