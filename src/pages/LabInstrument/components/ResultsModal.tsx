import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { BarChartOutlined, PieChartRounded } from '@mui/icons-material';

import { TMarket } from '@/store/api/symbols.api';
import { ITestResults, ITimeFilter, TInstrument, TTimeframe, TTimezone, TTimezoneCities } from '@/store/api/instruments.api';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { Button } from '@/components/Button';

export const ResultsModal = ({
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
}: {
  testData: ITestResults | null;
  handleCloseResultsModal: () => void;
  market: { value: TMarket; label: string } | null;
  symbol: string | null;
  instrument: { value: TInstrument; label: string } | null;
  timeframe: { value: TTimeframe; label: string } | null;
  startDate: Moment | null;
  endDate: Moment | null;
  timezone: { value: TTimezoneCities; label: TTimezone };
  ampmTimeFormat: boolean;
  timeFilters: ITimeFilter[];
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState(testData?.overall);
  const [selectedChart, setSelectedChart] = useState('pie');
  const [dataFilter, setDataFilter] = useState<'bullish' | 'bearish' | 'overall'>('overall');

  const handleChangeDataFilter = (_: any, v: 'bullish' | 'bearish' | 'overall') => {
    if (v && testData) {
      setDataFilter(v);
      setData(testData[v]);
    }
  };

  const formatTimeRange = (timeFilters: ITimeFilter[]) => {
    let result = '';

    timeFilters.forEach((filter) => {
      const [startTime, endTime] = filter.timeRange.split('-');
      const formattedStartTime = ampmTimeFormat ? moment(startTime, 'HH:mm').format('hh:mm A') : startTime;
      const formattedEndTime = ampmTimeFormat ? moment(endTime, 'HH:mm').format('hh:mm A') : endTime;
      result += `${formattedStartTime} - ${formattedEndTime}${filter?.timeRangeName ? ` (${filter.timeRangeName})` : ''}; `;
    });

    return result;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'pie':
        return (
          <Grid xs={12} sx={{ height: 400 }}>
            <PieChart data={data} />
          </Grid>
        );
      case 'bar':
        return (
          <Grid xs={12} sx={{ height: 400 }}>
            <BarChart data={data} />
          </Grid>
        );
    }
  };

  return (
    <Box
      sx={{
        ml: 'auto',
        mr: 'auto',
        mt: '7vh',
        minWidth: 340,
        maxWidth: 630,
        p: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Grid container spacing={5}>
        <Grid xs={6} sx={{ textAlign: 'center' }}>
          <ToggleButtonGroup
            exclusive
            size='small'
            color='primary'
            value={selectedChart}
            onChange={(_, v) => v && setSelectedChart(v)}
            aria-label='Chart style'
          >
            <ToggleButton value='pie'>
              <PieChartRounded />
            </ToggleButton>
            <ToggleButton value='bar'>
              <BarChartOutlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid xs={6} sx={{ textAlign: 'center' }}>
          <ToggleButtonGroup
            exclusive
            size='small'
            color='primary'
            value={dataFilter}
            onChange={handleChangeDataFilter}
            aria-label='Bullish/Bearish/Overall chart data'
          >
            <ToggleButton value='overall'>{t('Overall')}</ToggleButton>
            <ToggleButton value='bullish'>{t('Bullish')}</ToggleButton>
            <ToggleButton value='bearish'>{t('Bearish')}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid container xs={12}>
          <Grid xs={7}>{market ? <Typography variant='body1' color='text.secondary'>{`${t('Market')}: ${market.label}`}</Typography> : null}</Grid>
          <Grid xs={5}>
            <Typography variant='body1' color='text.secondary'>{`${t('Symbol')}: ${symbol}`}</Typography>
          </Grid>
          <Grid xs={7}>
            <Typography variant='body1' color='text.secondary'>{`${t('Instrument')}: ${instrument?.label}`}</Typography>
          </Grid>
          <Grid xs={5}>
            <Typography variant='body1' color='text.secondary'>{`${t('Timeframe')}: ${timeframe?.label}`}</Typography>
          </Grid>
          <Grid xs={7}>
            <Typography variant='body1' color='text.secondary'>{`${t('Time range')}: ${startDate?.format('YYYY/MM/DD')} - ${endDate?.format(
              'YYYY/MM/DD',
            )}`}</Typography>
          </Grid>
          <Grid xs={5}>
            <Typography variant='body1' color='text.secondary'>{`${t('Timezone')}: ${timezone.label}`}</Typography>
          </Grid>
          <Grid xs={12}>
            {timeFilters?.length ? (
              <Typography variant='body1' color='text.secondary'>{`${t('Time filters')}: ${formatTimeRange(timeFilters)}`}</Typography>
            ) : null}
          </Grid>
        </Grid>
        {renderChart()}
      </Grid>
      <Grid container xs={12}>
        <Button variant='text' sx={{ display: 'block', width: 130, ml: 'auto' }} onClick={handleCloseResultsModal}>
          {t('Close')}
        </Button>
      </Grid>
    </Box>
  );
};
