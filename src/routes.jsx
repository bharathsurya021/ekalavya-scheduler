import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Error from './pages/Error';
import ScreenManager from './pages/ScreenManager';
import CreateScreen from './pages/ScreenCreate';
import CreateCollection from './pages/ContentCreate';
import ContentManager from './pages/ContentManager';
import { useAuth } from './utilities/AuthContext';

const Router = () => {
  const { isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { path: '/', element: isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn /> },
        { path: '/register', element: isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp /> },
        { path: '404', element: <Error /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/',
      element: (
        <PrivateLayout />
      ),
      children: [
        { path: 'dashboard', element: <Navigate to="/screens" /> },
        {
          path: 'screens',
          element: <ScreenManager />,
        },
        {
          path: 'screens/create',
          element: <CreateScreen />,
        },

        {
          path: 'content',
          element: <ContentManager />,
        },
        {
          path: 'content/create',
          element: < CreateCollection />,
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
