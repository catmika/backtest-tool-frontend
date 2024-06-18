import React, { ReactNode } from 'react';

import { Button as MuiButton, CircularProgress, Box, ButtonProps } from '@mui/material';

interface IButton extends ButtonProps {
  isLoading?: boolean;
  children?: ReactNode | string | number;
}

export const Button: React.FC<IButton> = ({ children, isLoading, ...props }) => {
  return (
    <MuiButton {...props}>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: '25%', ml: 'auto', mr: 'auto' }}>
          <CircularProgress color='secondary' size={16} />
        </Box>
      )}
      <Box sx={isLoading ? { opacity: 0 } : {}}>{children}</Box>
    </MuiButton>
  );
};
