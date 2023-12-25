import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = 'token';

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  return <>{children}</>;
};

export default ProtectedRoute;
