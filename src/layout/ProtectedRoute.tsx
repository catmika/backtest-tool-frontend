import React, { ReactNode, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useLazyGetUserQuery } from '@/store/api';
import { BackdropLoader } from '@/components/BackdropLoader';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [getUser] = useLazyGetUserQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      getUser()
        .unwrap()
        .catch(() => {
          navigate('/signin');
        });
    }
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <BackdropLoader />;
};

export default ProtectedRoute;
