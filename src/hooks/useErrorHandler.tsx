import React, { useEffect } from 'react';
import { setIsErrorHandled, showNotification } from '@/store/slices/app.slice';
import { useAppDispatch } from '@/store';

interface ErrorResponse {
  status: number;
  data: {
    message: string;
  };
}

export const useErrorHandler = (error?: ErrorResponse | null) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error?.status === 400) {
      dispatch(showNotification({ type: 'error', message: error.data.message }));
      dispatch(setIsErrorHandled(true));
    }
  }, [error, dispatch]);
};
