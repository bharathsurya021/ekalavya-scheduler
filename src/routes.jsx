import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import ContentManager from './pages/ContentManager';
import Calender from './pages/Calender';
const Router = () => {
  const routes = useRoutes([
    {
      path: '/auth',
      element: <PublicLayout />,
      children: [
        { path: '/auth/login', element: <SignIn /> },
        { path: '404', element: <Error /> },
        { path: '/auth/register', element: <SignUp /> },
        { path: '*', element: <Navigate to="/auth/404" /> },
      ],
    },
    {
      path: '/',
      element: <PrivateLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/cms', element: <ContentManager /> },
        { path: '/calendar', element: <Calender /> },
      ],
    },
  ]);

  return routes;
};

export default Router;
