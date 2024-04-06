import React, { Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { Sidebar } from '@/components/Sidebar';

const Layout = () => {
  return (
    <ProtectedRoute>
      <div className='flex h-full flex-1 flex-row'>
        <Sidebar />
        <div
          style={{
            width: 'calc(100vw - 224px)',
            position: 'relative',
          }}
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
