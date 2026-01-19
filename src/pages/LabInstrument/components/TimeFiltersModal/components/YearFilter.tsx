import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { TMonths } from '@/store/api/instruments.api';

export const YearFilter = () => {
  const { t } = useTranslation();

  const [selectedMonths, setSelectedMonths] = useState<TMonths[]>([]);

  const quarters = [
    ['January', 'February', 'March'],
    ['April', 'May', 'June'],
    ['July', 'August', 'September'],
    ['October', 'November', 'December'],
  ];

  const handleSelectMonth = (event: React.MouseEvent<HTMLElement>, value: TMonths[]) => {
    setSelectedMonths(value);
  };

  return (
    <Stack spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
      <Typography variant='body1' color='text.primary'>
        {t('Select month')}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: ['column', 'row'], width: ['100%', 'auto'] }}>
        {quarters.map((quarter, qIndex) => {
          return (
            <Stack spacing={1}>
              <Typography variant='body1' color='text.primary'>
                {`Q${qIndex + 1}`}
              </Typography>
              {quarter.map((month, mIndex) => (
                <ToggleButtonGroup
                  value={selectedMonths}
                  onChange={handleSelectMonth}
                  aria-label='Month Picker'
                  sx={{ width: '100%', justifyContent: 'center', mb: 4 }}
                >
                  <ToggleButton sx={{ minWidth: 114, width: '100%' }} value={mIndex + 1 + qIndex * 3}>
                    {t(month)}
                  </ToggleButton>
                </ToggleButtonGroup>
              ))}
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
};
