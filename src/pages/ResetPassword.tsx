import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useAppDispatch } from '@/store';
import { useResetPasswordMutation } from '@/store/api';
import { showNotification } from '@/store/slices/app.slice';
import { validatePassword } from '@/utils/helpers';
import Button from '@/components/Button';

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') as string;
  const isPasswordSame = newPassword === confirmPassword;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      isPasswordSame && (await resetPassword({ token, newPassword }).unwrap());
      navigate('/signin');
      dispatch(showNotification({ message: t('Password has been succesfully updated'), type: 'success' }));
    } catch (error) {}
  };
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: '30%',
        }}
        component='form'
        onSubmit={onSubmit}
      >
        <Typography color='text.primary' variant='h5'>
          {t('Enter your new password:')}
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder={t('New password')}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword((p) => !p)} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder={t('Confirm new password')}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Typography align='center' width={400} variant='body2' color='text.primary'>
          {!isPasswordSame ? t('Passwords must be the same') : ''}
        </Typography>
        <Typography align='center' width={400} variant='body2' color='text.primary'>
          {!validatePassword(newPassword) ? t('Password must be between 8 and 64 characters and contain at least one numeric digit (0-9)') : ''}
        </Typography>
        <Button
          fullWidth
          type='submit'
          variant='contained'
          color='primary'
          isLoading={isLoading}
          disabled={!isPasswordSame || !validatePassword(newPassword)}
        >
          {t('Confirm')}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
