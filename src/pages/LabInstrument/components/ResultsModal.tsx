import React from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';

import { PieChart } from '@/components/charts/PieChart';
import { IStats } from '@/store/api/instruments.api';
import { Button } from '@/components/Button';

export const ResultsModal = ({ data, handleCloseResultsModal }: { data: Record<string, IStats>; handleCloseResultsModal: () => void }) => {
  const { t } = useTranslation();

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
      <Grid container>
        <Grid xs={12} sx={{ height: 400 }}>
          <PieChart data={data} />
        </Grid>
      </Grid>
      <Button variant='text' sx={{ display: 'block', width: 150, mt: 4, ml: 'auto' }} onClick={handleCloseResultsModal}>
        {t('Close')}
      </Button>
    </Box>
  );
};
