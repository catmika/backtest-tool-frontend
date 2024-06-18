import React from 'react';

import { Chip, FormControl, Input } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NumberInput = ({
  required,
  id,
  aria,
  label,
  min,
  max,
  onChange,
}: {
  required?: boolean;
  id: string;
  aria: string;
  label: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { t } = useTranslation();

  return (
    <FormControl required={required}>
      <Chip id={aria} label={t(label) + (required ? '*' : '')} sx={{ width: '100%', mb: 1 }} />
      <Input id={id} aria-labelledby={aria} type='number' inputProps={{ min, max }} onChange={onChange} sx={{ width: 40, ml: 'auto', mr: 'auto' }} />
    </FormControl>
  );
};
