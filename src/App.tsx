import React, { lazy, useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import Layout from './layout';
import { Notification } from './components/Notification';
import { useAppSelector } from './store';

const Library = lazy(() => import('@/pages/Library'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Lab = lazy(() => import('@/pages/Lab'));
const Signin = lazy(() => import('@/pages/Signin'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const App = () => {
  const { mode } = useAppSelector((state) => state.app);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/library', element: <Library /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/lab', element: <Lab /> },
      ],
    },
    {
      path: '/signin',
      element: <Signin />,
    },
    {
      path: '/reset-password',
      element: <ResetPassword />,
    },
    {
      path: '*',
      element: <Signin />,
    },
  ]);

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Notification />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
};

export default App;
