import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { ITimeFilter, TTimezone } from '@/store/api/instruments.api';
import { Button } from '@/components/Button';
import { DayFilter } from './components/DayFilter';

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
  timezone: TTimezone;
  ampmTimeFormat: boolean;
  setAmpmTimeFormat: Dispatch<SetStateAction<boolean>>;
  handleCloseTimeFiltersModal: () => void;
}) => {
  const { t } = useTranslation();

  const [selectedFilterType, setSelectedFilterType] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const renderFilterByType = () => {
    switch (selectedFilterType) {
      case 'day':
        return <DayFilter {...{ timeFilters, setTimeFilters, timezone, ampmTimeFormat, setAmpmTimeFormat }} />;
      case 'week':
        return <div>HUY</div>;
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
          <ToggleButton value='day'>
            <Typography sx={{ fontSize: 14 }}>{t('Day')}</Typography>
          </ToggleButton>
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
      {renderFilterByType()}
      <Typography variant='body2' color='text.secondary' sx={{ mt: 1, display: 'inline' }}>
        {`*${t('Selected time ranges will be excluded from testing')}`}
      </Typography>
      <Button variant='text' sx={{ display: 'block', width: 150, mt: 4, ml: 'auto' }} onClick={handleCloseTimeFiltersModal}>
        {t('Close')}
      </Button>
    </Box>
  );
};
