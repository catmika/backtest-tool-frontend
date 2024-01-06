import React, { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './layout';

const About = lazy(() => import('@/pages/About'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));

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
  ]);

  return (
    <Suspense>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </Suspense>
  );
};

export default App;
