import React, { ReactNode, useEffect } from 'react';
import { logout } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user?.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(logout(navigate) as any);
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default ProtectedRoute;
