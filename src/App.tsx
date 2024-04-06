import React, { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import { Notification } from './components/Notification';

const About = lazy(() => import('@/pages/About'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const App = () => {
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
      path: '/login',
      element: <Login />,
    },
    { path: '/reset-password', element: <ResetPassword /> },
    {
      path: '*',
      element: <Login />,
    },
  ]);

  return (
    <div className='App justify-center'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
