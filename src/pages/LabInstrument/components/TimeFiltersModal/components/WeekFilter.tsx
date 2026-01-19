import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { WEEKDAYS } from '@/utils/constants';
import { ITimeFilter, TTimeFilterType, TWeekdays } from '@/store/api/instruments.api';
import { Moment } from 'moment';

export const WeekFilter = ({
  timeFilters,
  handleAddTimeFilter,
}: {
  timeFilters: ITimeFilter[];
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

  const [selectedDays, setSelectedDays] = useState<number[]>(timeFilters.filter(timeFilter => timeFilter.type === 'week').map((filter) => +filter.timeRange));

  const handleSelectDay = (event: React.MouseEvent<HTMLElement>, value: number[]) => {
    handleAddTimeFilter({ type: 'week', value})
    setSelectedDays(value);
  };

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Typography variant='body1' color='text.primary'>
        {t('Select week days')}
      </Typography>
      <ToggleButtonGroup
        size='small'
        orientation='vertical'
        value={selectedDays}
        onChange={handleSelectDay}
        aria-label='Week Day Picker'
        sx={{ width: '100%', justifyContent: 'center', mb: 4 }}
      >
        {WEEKDAYS.map((day, index) => (
          <ToggleButton value={index + 1}>{t(day)}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
};
