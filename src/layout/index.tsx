import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';

import ProtectedRoute from './ProtectedRoute';
import { BackdropLoader } from '@/components/BackdropLoader';
import { Sidebar } from '@/layout/Sidebar';

const Layout = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100%', flex: 1, flexDirection: 'row' }}>
        <Sidebar isSmallScreen={isSmallScreen} />
        <div
          style={{
            width: isSmallScreen ? '100vw' : 'calc(100vw - 224px)',
            padding: 15,
            position: 'relative',
          }}
        >
          <Suspense fallback={<BackdropLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
