import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment, MomentInput } from 'moment';

import { Autocomplete, Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DataGrid } from '@mui/x-data-grid';
import { TimePicker } from '@mui/x-date-pickers';
import { Add, Delete } from '@mui/icons-material';

import { ITimeFilter, TTimezone } from '@/store/api/instruments.api';
import { isOptionEqualToValue } from '@/utils/helpers';
import { TIME_SESSIONS } from '@/utils/constants';
import { Button } from '@/components/Button';

export const TimeFiltersModal = ({
  timeFilters,
  setTimeFilters,
  handleCloseTimeFiltersModal,
  timezone,
  ampmTimeFormat,
  setAmpmTimeFormat,
}: {
  timeFilters: ITimeFilter[];
  setTimeFilters: Dispatch<SetStateAction<ITimeFilter[]>>;
  handleCloseTimeFiltersModal: () => void;
  timezone: TTimezone;
  ampmTimeFormat: boolean;
  setAmpmTimeFormat: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [timeSession, setTimeSession] = useState<{ value: string; label: string; start: Moment; end: Moment } | null>(null);

  const timeSessions = TIME_SESSIONS.map((ts) => {
    return { value: ts.name, label: ts.name, start: moment(ts.start, 'HH:mm'), end: moment(ts.end, 'HH:mm') };
  });

  const timezoneCorrection = +timezone.split('T')[1];

  const columns = [
    { field: 'orderNumber', headerName: 'Nº', width: 90 },
    {
      field: 'timeRange',
      headerName: t('Time range'),
      flex: 1,
      editable: true,
      valueFormatter: (value: string) => {
        if (!value) {
          return '';
        }
        const [startTime, endTime] = value.split('-');
        const start = ampmTimeFormat ? moment(startTime, 'HH:mm').format('hh:mm A') : startTime;
        const end = ampmTimeFormat ? moment(endTime, 'HH:mm').format('hh:mm A') : endTime;
        return `${start}-${end}`;
      },
    },
    {
      field: 'timeRangeName',
      headerName: t('Time range name'),
      flex: 1,
      editable: true,
    },
    {
      field: 'actions',
      headerName: '',
      width: 85,
      hideSortIcons: true,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Button onClick={() => handleDeleteRow(params.id)}>
          <Delete sx={{ width: 20, height: 20 }} />
        </Button>
      ),
    },
  ];

  const handleDeleteRow = (id: string) => {
    setTimeFilters((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleAddTimeRange = (start?: Moment | null, end?: Moment | null, correction?: number) => {
    if (start && end) {
      const formattedStartTime = correction ? start.add(correction, 'hours').format('HH:mm') : start.format('HH:mm');
      const formattedEndTime = correction ? end.add(correction, 'hours').format('HH:mm') : end.format('HH:mm');

      const timeRange = `${formattedStartTime}-${formattedEndTime}`;

      handleDeleteRow(timeRange);

      const adjustTime = (time: MomentInput, correction: number) =>
        correction ? moment(time, 'HH:mm').add(correction, 'hours') : moment(time, 'HH:mm');

      const timeRangeName = TIME_SESSIONS.find(
        (session) => adjustTime(session.start, timezoneCorrection).isSame(start) && adjustTime(session.end, timezoneCorrection).isSame(end),
      )?.name;

      setTimeFilters((prev) => [
        ...prev,
        {
          id: timeRange,
          orderNumber: prev.length + 1,
          timeRange,
          timeRangeName,
        },
      ]);
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
      <Grid container sx={{ mb: 1 }}>
        <Grid container xs={12} md={5} sx={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
          <Grid xs={12}>
            <Typography variant='body1' color='text.primary'>
              {t('Select from pre-defined time sessions')}
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Autocomplete
              isOptionEqualToValue={isOptionEqualToValue}
              id='timeSessionSelect'
              options={timeSessions}
              value={timeSession}
              onChange={(_, v) => setTimeSession(v)}
              renderInput={(params) => <TextField {...params} required name='timeSession' label={t('Time session')} />}
            />
          </Grid>
          <Grid xs={12}>
            <Button
              variant='outlined'
              disabled={!timeSession || timeFilters.length > 9}
              sx={{ width: '100%' }}
              onClick={() => handleAddTimeRange(timeSession?.start, timeSession?.end, timezoneCorrection)}
            >
              <Box display='flex'>
                {t('Add session')}
                <Add />
              </Box>
            </Button>
          </Grid>
          <Grid xs={12}>
            <Typography variant='body2' color='text.secondary'>
              {`*${t('If no timezone selected - time range for sessions calculated according to GMT')}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={12} md={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ mb: 3, mt: 3 }} color='text.secondary' variant='h6'>
            {t('Or')}
          </Typography>
        </Grid>
        <Grid container spacing={1} xs={12} md={5} sx={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
          <Grid>
            <Typography variant='body1' color='text.primary'>
              {t('Enter custom time range')}
            </Typography>
          </Grid>
          <Grid xs={12}>
            <Grid container xs={12} sx={{ justifyContent: 'center', gap: 2 }}>
              <TimePicker
                ampm={ampmTimeFormat}
                label={t('Start time')}
                value={startTime}
                onChange={(newValue: Moment | null) => setStartTime(newValue)}
              />
              <TimePicker ampm={ampmTimeFormat} label={t('End time')} value={endTime} onChange={(newValue: Moment | null) => setEndTime(newValue)} />
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Button
              variant='outlined'
              sx={{ width: '100%' }}
              disabled={!startTime || !endTime || startTime?.isSame(endTime) || timeFilters.length > 9}
              onClick={() => handleAddTimeRange(startTime, endTime)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('Add time range')}
                <Add />
              </Box>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <FormControlLabel
          sx={{ ml: 'auto' }}
          control={<Checkbox value={ampmTimeFormat} disabled={!!timeFilters.length} onChange={() => setAmpmTimeFormat((prev) => !prev)} />}
          label={t('24h format')}
        />
      </Grid>
      <DataGrid
        autoHeight
        columns={columns}
        rows={timeFilters}
        slots={{
          noRowsOverlay: () => (
            <Stack height='100%' alignItems='center' justifyContent='center'>
              {t('No time filters added')}
            </Stack>
          ),
        }}
      />
      <Typography variant='body2' color='text.secondary' sx={{ mt: 1, display: 'inline' }}>
        {`*${t('Selected time ranges will be excluded from testing')}`}
      </Typography>
      <Button variant='text' sx={{ display: 'block', width: 150, mt: 4, ml: 'auto' }} onClick={handleCloseTimeFiltersModal}>
        {t('Close')}
      </Button>
    </Box>
  );
};
