import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { TWeeks } from '@/store/api/instruments.api';
import { WEEKS } from '@/utils/constants';

export const MonthFilter = () => {
  const { t } = useTranslation();

  const [selectedWeeks, setSelectedWeeks] = useState<TWeeks[]>([]);

  const handleSelectWeek = (event: React.MouseEvent<HTMLElement>, value: TWeeks[]) => {
    setSelectedWeeks(value)
  };

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Typography variant='body1' color='text.primary'>
        {t('Select week')}
      </Typography>
      <ToggleButtonGroup
        orientation='vertical'
        value={selectedWeeks}
        onChange={handleSelectWeek}
        aria-label='Week Picker'
        sx={{ width: '100%', justifyContent: 'center', mb: 4 }}
      >
        {WEEKS.map((week, index) => (
          <ToggleButton value={index + 1}>{t(week)}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
};
