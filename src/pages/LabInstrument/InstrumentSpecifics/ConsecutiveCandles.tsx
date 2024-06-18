import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { NumberInput } from './components/NumberInput';

const ConsecutiveCandles = ({ sx, handleInput }: { sx: object; handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <Grid container gap={2} sx={sx}>
      <Grid container xs='auto'>
        <NumberInput
          required
          id='minConsecutiveCandles'
          aria='minCandlesLabel'
          label='Min candles in a row'
          min={1}
          max={10}
          onChange={handleInput}
        />
      </Grid>
      <Grid container xs='auto'>
        <NumberInput
          required
          id='maxConsecutiveCandles'
          aria='maxCandlesLabel'
          label='Max candles in a row'
          min={1}
          max={10}
          onChange={handleInput}
        />
      </Grid>
    </Grid>
  );
};

export default ConsecutiveCandles;
