import React, { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Typography } from '@mui/material';

import { TInstrument } from '@/store/api/instruments.api';
import ConsecutiveCandles from './ConsecutiveCandles';

const componentMap = {
  consecutiveCandles: ConsecutiveCandles,
};

const InstrumentSpecifics = ({
  instrument,
  setSpecifics,
  ...props
}: {
  instrument: TInstrument;
  setSpecifics: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  props?: HTMLAttributes<HTMLElement>;
}) => {
  const { t } = useTranslation();

  const ComponentToRender = instrument && componentMap[instrument];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecifics((specifics) => {
      return { ...specifics, ...{ [e.target.id]: e.target.value } };
    });
  };

  if (!ComponentToRender) {
    return (
      <Container sx={{ alignSelf: 'center' }}>
        <Typography color='text.secondary' variant='h4' sx={{ opacity: 0.2, textAlign: 'center' }}>
          {t('Select instrument to see more')}
        </Typography>
      </Container>
    );
  }

  return <ComponentToRender {...{ ...props, handleInput, sx: { height: 'max-content' } }} />;
};

export default InstrumentSpecifics;
