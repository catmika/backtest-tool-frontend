import React, { lazy, useMemo, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CssBaseline, PaletteMode, Switch, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import Layout from './layout';
import { Notification } from './components/Notification';

const About = lazy(() => import('@/pages/About'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Signin = lazy(() => import('@/pages/Signin'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode | undefined>(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [prefersDarkMode, mode],
  );

  const handleThemeChange = () => {
    setMode(theme.palette.mode === 'dark' ? 'light' : 'dark');
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/about', element: <About /> },
        { path: '/dashboard', element: <Dashboard /> },
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
        <Switch sx={{ position: 'absolute', top: 10, left: '90%', zIndex: 100 }} checked={mode === 'light'} onChange={handleThemeChange} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
};

export default App;
