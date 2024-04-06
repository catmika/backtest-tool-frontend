import React, { ReactNode } from 'react';
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

  if ((error as any)?.status === 401) {
    dispatch(logout({ navigate }) as any);
  }

  if (!data) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
