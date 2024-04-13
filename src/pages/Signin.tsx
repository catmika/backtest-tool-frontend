import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Modal,
  useTheme,
  Avatar,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Tooltip,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/store';
import { useSigninMutation, useSigninGoogleMutation, useSignupMutation, useForgotPasswordMutation, useLazyGetUserQuery } from '@/store/api';
import { validateEmail, validatePassword } from '@/utils/helpers';
import { showNotification } from '@/store/slices/app.slice';
import Button from '@/components/Button';

const Signin = () => {
  const [getUser] = useLazyGetUserQuery();
  const [signin, { isLoading: isLoadingSignin }] = useSigninMutation();
  const [signinGoogle, { isLoading: isLoadingSigninGoogle }] = useSigninGoogleMutation();
  const [signup, { isLoading: isLoadingSignup }] = useSignupMutation();
  const [forgotPassword, { isLoading: isLoadingForgotPassword }] = useForgotPasswordMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const googleAuthRef = useRef(null);
  const passwordRef = useRef(null);

  const isLoading = isLoadingSignin || isLoadingSigninGoogle || isLoadingSignup || isLoadingForgotPassword;

  const onSignin = async () => {
    try {
      await signin({ email, password }).unwrap();
      navigate('/about');
      dispatch(showNotification({ message: 'Succesfully logged in', type: 'success' }));
    } catch (error) {
      /* empty */
    }
  };

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      dispatch(showNotification({ message: 'Invalid email', type: 'error' }));
      return;
    }
    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) {
      dispatch(showNotification({ message: 'Invalid password', type: 'error' }));
      return;
    }
    try {
      await signup({ email, password }).unwrap();
      dispatch(showNotification({ message: 'Confirmation link has been sent to your email', type: 'info' }));
    } catch (error) {
      /* empty */
    }
  };

  const onResetPassword = async (email: string) => {
    onCloseForgotPasswordModal();
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      dispatch(showNotification({ message: 'Invalid email', type: 'error' }));
      return;
    }
    try {
      await forgotPassword({ email }).unwrap();
      dispatch(showNotification({ message: 'Link for updating password has been sent to your email', type: 'info' }));
    } catch (error) {
      /* empty */
    }
  };

  const onCloseForgotPasswordModal = () => {
    setResetEmail('');
    setOpenForgotPasswordModal(false);
  };

  useEffect(() => {
    if (googleAuthRef.current) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID,
        callback: async (res: any, error: any) => {
          try {
            await signinGoogle({ credential: res.credential }).unwrap();
            navigate('/about');
            dispatch(showNotification({ message: 'Succesfully logged in', type: 'success' }));
          } catch (error) {
            /* empty */
          }
        },
      });
      (window as any).google.accounts.id.renderButton(googleAuthRef.current, {
        size: 'large',
        type: 'icon',
        shape: 'circle',
        use_fedcm_for_prompt: 'true',
        theme: theme.palette.mode === 'dark' ? 'outline' : 'filled_blue',
      });
    }
  }, [googleAuthRef.current, theme]);

  useEffect(() => {
    if (!isAuthenticated) {
      getUser()
        .unwrap()
        .then(() => {
          navigate('/about');
        })
        .catch(() => {});
    } else {
      navigate('/about');
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isEmailBeenConfirmed = searchParams.get('emailConfirmed') === 'true';
    if (isEmailBeenConfirmed) {
      dispatch(showNotification({ message: 'Email successfully confirmed. You can sign in now', type: 'success' }));
    }
  }, [location.search, dispatch]);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        component='main'
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, mb: 3, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography sx={{ display: 'flex', gap: 2 }} color='text.secondary' component='h1' variant='h5'>
            Sign in with
            {!isLoading ? <div style={{ marginTop: -3 }} ref={googleAuthRef} /> : <CircularProgress size={38} />}
          </Typography>
          <Typography sx={{ mt: 1 }} color='text.secondary' component='h2' variant='h6'>
            Or
          </Typography>
          <Box component='form' onSubmit={onSignup} sx={{ display: 'flex', flexDirection: 'column', mt: 1, minWidth: '40%' }}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />
            <Tooltip
              title='Password must be between 8 and 64 characters and contain at least one numeric digit (0-9)'
              open={!validatePassword(password) && passwordRef.current === document.activeElement}
              placement='bottom'
              disableHoverListener
            >
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='current-password'
                inputRef={passwordRef}
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
            </Tooltip>
            <Grid container>
              <Grid item xs>
                <Button
                  onClick={onSignin}
                  disabled={!validateEmail(email) || !validatePassword(password) || isLoading}
                  isLoading={isLoadingSignin}
                  variant='outlined'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={!validateEmail(email) || !validatePassword(password) || isLoading}
                  isLoading={isLoadingSignup}
                  type='submit'
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
            <Button onClick={() => setOpenForgotPasswordModal(true)} variant='text' disabled={isLoading}>
              Forgot password?
            </Button>
          </Box>
        </Box>
        <Typography sx={{ mt: 8, mb: 4 }} variant='body2' color='text.secondary' align='center'>
          {'Copyright © '}
          <Link sx={{ mr: 1 }} color='text.secondary' href='mailto:mikatradingtoolkit@gmail.com'>
            Mika Cat Trading Toolkit
          </Link>
          {new Date().getFullYear()}
        </Typography>
      </Box>
      <Modal open={openForgotPasswordModal} onClose={onCloseForgotPasswordModal}>
        <Box sx={{ position: 'absolute', top: '35%', left: '30%', width: '40%', p: 4, bgcolor: 'background.paper' }}>
          <Typography component='h3' variant='h6' color='text.secondary'>
            Enter your email
          </Typography>
          <TextField
            required
            fullWidth
            margin='normal'
            label='Email Address'
            name='email'
            autoComplete='email'
            sx={{ mb: 3 }}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <Button
            fullWidth
            variant='contained'
            disabled={!validateEmail(resetEmail) || isLoadingForgotPassword}
            isLoading={isLoadingForgotPassword}
            onClick={() => onResetPassword(resetEmail)}
          >
            {validateEmail(resetEmail) ? 'Send resetting password link' : 'Enter valid email'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Signin;
