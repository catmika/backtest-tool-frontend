import React, { ReactNode, useEffect } from 'react';
import { Loader } from '../components/Loader';
import { logout, useGetUserQuery } from '@/store/api';
import { useAppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { data, error } = useGetUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ((error as any)?.status === 401) {
      dispatch(logout({ navigate }) as any);
    }
  }, [error, dispatch, navigate]);

  if (!data) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
