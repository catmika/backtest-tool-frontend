import React, { lazy, useEffect, useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ukUA, enUS } from '@mui/material/locale';
import { ukUA as datePickerUkUA, enUS as datePickerEnUS } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CssBaseline, PaletteMode, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';

import Layout from './layout';
import { Notification } from './components/Notification';
import { useAppDispatch, useAppSelector } from './store';
import { setMode } from './store/slices/app.slice';
import { useTranslation } from 'react-i18next';

const Library = lazy(() => import('@/pages/Library'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const LabInstrument = lazy(() => import('@/pages/LabInstrument'));
const Signin = lazy(() => import('@/pages/Signin'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const App = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const localStorageMode = localStorage.getItem('mode');

  const { mode } = useAppSelector((state) => state.app);

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: (mode as PaletteMode) ?? 'dark',
          },
        },
        i18n.language === 'ukUA' ? ukUA : enUS,
        i18n.language === 'ukUA' ? datePickerUkUA : datePickerEnUS,
      ),
    [mode, i18n.language],
  );

  useEffect(() => {
    if (!localStorageMode) {
      prefersDarkMode ? dispatch(setMode('dark')) : dispatch(setMode('light'));
    } else {
      dispatch(setMode(localStorageMode as 'dark' | 'light'));
    }
  }, [mode]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/library', element: <Library /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/instrument', element: <LabInstrument /> },
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
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-gb'>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Notification />
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
};

export default App;
