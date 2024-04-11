import React, { useEffect, useState } from 'react';

import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, Box, CircularProgress, IconButton, Zoom } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/store';
import { hideNotification } from '@/store/slices/app.slice';

export const Notification = () => {
  const dispatch = useAppDispatch();
  const {
    isNotificationVisible,
    notificationData: { title, message, type, duration },
  } = useAppSelector((state) => state.app);

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isNotificationVisible && duration) {
      setTimeLeft(duration);
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft: number) => prevTimeLeft - 100);
      }, 100);
    }
    return () => {
      setTimeLeft(duration);
      clearInterval(timer);
    };
  }, [isNotificationVisible]);

  useEffect(() => {
    if (timeLeft === 0 && isNotificationVisible) {
      dispatch(hideNotification());
    }
  }, [timeLeft, isNotificationVisible, dispatch]);

  return (
    <Box sx={{ width: '40%', position: 'fixed', zIndex: 100, left: '30%', top: '5%' }}>
      <Zoom in={isNotificationVisible}>
        <Alert
          variant='outlined'
          severity={type}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                dispatch(hideNotification());
              }}
            >
              {title && <AlertTitle>{title}</AlertTitle>}
              <Close fontSize='inherit' />
              {duration ? (
                <CircularProgress
                  variant='determinate'
                  value={(timeLeft / duration) * 100}
                  size={20}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-10px',
                    marginLeft: '-10px',
                  }}
                />
              ) : null}
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Zoom>
    </Box>
  );
};
