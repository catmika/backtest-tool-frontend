import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Autocomplete, Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers';

import { Button } from '@/components/Button';
import { isOptionEqualToValue } from '@/utils/helpers';
import { TIME_SESSIONS } from '@/utils/constants';
import { ITimeFilter, TTimeFilterType } from '@/store/api/instruments.api';

export const DayFilter = ({
  timeFilters,
  ampmTimeFormat,
  setAmpmTimeFormat,
  handleAddTimeFilter,
}: {
  timeFilters: ITimeFilter[];
  ampmTimeFormat: boolean;
  setAmpmTimeFormat: Dispatch<SetStateAction<boolean>>;
  handleAddTimeFilter: ({
    type,
    start,
    end,
    value,
  }: {
    type: TTimeFilterType;
    start?: Moment | null;
    end?: Moment | null;
    value?: number;
  }) => void;
}) => {
  const { t } = useTranslation();

  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [timeSession, setTimeSession] = useState<{ value: string; label: string; start: Moment; end: Moment } | null>(null);

  const timeSessions = TIME_SESSIONS.map((ts) => {
    return { value: ts.name, label: ts.name, start: moment(ts.start, 'HH:mm'), end: moment(ts.end, 'HH:mm') };
  });

  return (
    <>
      <Grid container>
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
              onClick={() => handleAddTimeFilter({ type: 'day', start: timeSession?.start, end: timeSession?.end })}
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
              onClick={() => handleAddTimeFilter({ type: 'day', start: startTime, end: endTime })}
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
          sx={{ ml: 'auto', marginY: 2 }}
          control={<Checkbox value={ampmTimeFormat} disabled={!!timeFilters.length} onChange={() => setAmpmTimeFormat((prev) => !prev)} />}
          label={t('24h format')}
        />
      </Grid>
    </>
  );
};
