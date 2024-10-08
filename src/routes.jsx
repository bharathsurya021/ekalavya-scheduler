import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import CalendarScheduler from './pages/Scheduler';
const Router = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { path: '/', element: <SignIn /> },
        { path: '404', element: <Error /> },
        { path: '/register', element: <SignUp /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/',
      element: <PrivateLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/scheduler', element: <CalendarScheduler /> },
      ],
    },
  ]);

  return routes;
};

export default Router;
