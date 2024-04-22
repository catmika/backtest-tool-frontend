import React, { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Autocomplete, TextField } from '@mui/material';

const Lab = () => {
  const instruments = [{ label: 'PM/PW/PD Lows & Highs', value: 'PLH' }];

  const [instrument, setInstrument] = useState<any>(null);

  console.log(instrument);

  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Autocomplete
          autoComplete
          value={instrument}
          onChange={(e, v) => setInstrument(v)}
          disablePortal
          id='market-select'
          options={instruments}
          renderInput={(params) => <TextField {...params} label='Market' />}
        />
      </Grid>
      <Grid xs={6}>
        <Autocomplete
          autoComplete
          value={instrument}
          onChange={(e, v) => setInstrument(v)}
          disablePortal
          id='symbol-select'
          options={instruments}
          renderInput={(params) => <TextField {...params} label='Symbol' />}
        />
      </Grid>
      {/* <Grid xs={6}>
        <Autocomplete
          autoComplete
          value={instrument}
          onChange={(e, v) => setInstrument(v)}
          disablePortal
          id='instrument-select'
          options={instruments}
          renderInput={(params) => <TextField {...params} label='Instrument' />}
        />
      </Grid> */}
    </Grid>
  );
};

export default Lab;
