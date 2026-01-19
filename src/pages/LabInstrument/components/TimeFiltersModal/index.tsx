import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment, { Moment, MomentInput } from 'moment';

import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';

import { ITimeFilter, TTimeFilterType, TTimeRangeNameOptions, TTimezone } from '@/store/api/instruments.api';

import { Button } from '@/components/Button';
import { DayFilter } from './components/DayFilter';
import { WeekFilter } from './components/WeekFilter';

import { TIME_SESSIONS } from '@/utils/constants';
import { MonthFilter } from './components/MonthFilter';
import { YearFilter } from './components/YearFilter';

export const TimeFiltersModal = ({
  timeFilters,
  setTimeFilters,
  handleCloseTimeFiltersModal,
  timezone,
  ampmTimeFormat,
  setAmpmTimeFormat,
  isIntraday,
}: {
  timeFilters: ITimeFilter[];
  setTimeFilters: Dispatch<SetStateAction<ITimeFilter[]>>;
  timezone: TTimezone;
  ampmTimeFormat: boolean;
  setAmpmTimeFormat: Dispatch<SetStateAction<boolean>>;
  handleCloseTimeFiltersModal: () => void;
  isIntraday: boolean;
}) => {
  const { t } = useTranslation();

  const [selectedFilterType, setSelectedFilterType] = useState<TTimeFilterType>(isIntraday ? 'day' : 'week');

  const timezoneCorrection = +timezone.split('T')[1];

  const handleDeleteRow = (id: string | number, type: TTimeFilterType) => {
    setTimeFilters((prevRows) => prevRows.filter((row) => row.id !== id && row.type === type));
  };

  const handleAddTimeFilter = ({
    type,
    start,
    end,
    value,
    label
  }: {
    type: TTimeFilterType;
    start?: Moment | null;
    end?: Moment | null;
    value?: number;
    label?: TTimeRangeNameOptions;
  }) => {
    switch (type) {
      case 'day':
        if (start && end) {
          const formattedStartTime = timezoneCorrection ? start.add(timezoneCorrection, 'hours').format('HH:mm') : start.format('HH:mm');
          const formattedEndTime = timezoneCorrection ? end.add(timezoneCorrection, 'hours').format('HH:mm') : end.format('HH:mm');

          const timeRange = `${formattedStartTime}-${formattedEndTime}`;

          handleDeleteRow(timeRange, type);

          const adjustTime = (time: MomentInput) =>
            timezoneCorrection ? moment(time, 'HH:mm').add(timezoneCorrection, 'hours') : moment(time, 'HH:mm');

          const timeRangeName = TIME_SESSIONS.find((session) => adjustTime(session.start).isSame(start) && adjustTime(session.end).isSame(end))?.name;

          setTimeFilters((prev) => [
            ...prev,
            {
              id: timeRange,
              type,
              timeRange,
              timeRangeName,
            },
          ]);
        }
        break;
      case 'week':
      case 'month':
      case 'year':
        if(value) {
          handleDeleteRow(value, type);

          setTimeFilters((prev) => [
            ...prev,
            {
              id: value,
              type,
              timeRange: value.toString(),
              timeRangeName: label,
            },
          ]);
        }
    }
  };

  const columns = [
    {
      field: 'orderNumber',
      headerName: 'Nº',
      width: 90,
      renderCell: (params: GridRenderCellParams) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
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
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => handleDeleteRow(params.id, params.row.type)}>
          <Delete sx={{ width: 20, height: 20 }} />
        </Button>
      ),
    },
  ];

  const renderFilterByType = () => {
    switch (selectedFilterType) {
      case 'day':
        return <DayFilter {...{ timeFilters, ampmTimeFormat, setAmpmTimeFormat, handleAddTimeFilter }} />;
      case 'week':
        return <WeekFilter {...{ timeFilters, handleAddTimeFilter }} />;
      case 'month':
        return <MonthFilter />;
      case 'year':
        return <YearFilter />;
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
        minHeight: 723,
        p: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <ToggleButtonGroup
          exclusive
          size='small'
          color='primary'
          value={selectedFilterType}
          onChange={(_, v) => v && setSelectedFilterType(v)}
          aria-label='Filter type'
        >
          {isIntraday && (
            <ToggleButton value='day'>
              <Typography sx={{ fontSize: 14 }}>{t('Day')}</Typography>
            </ToggleButton>
          )}
          <ToggleButton value='week'>
            <Typography sx={{ fontSize: 14 }}>{t('Week')}</Typography>
          </ToggleButton>
          <ToggleButton value='month'>
            <Typography sx={{ fontSize: 14 }}>{t('Month')}</Typography>
          </ToggleButton>
          <ToggleButton value='year'>
            <Typography sx={{ fontSize: 14 }}>{t('Year')}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 322 }}>{renderFilterByType()}</Box>
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
