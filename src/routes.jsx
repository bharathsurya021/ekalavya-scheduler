import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Error from './pages/Error';
import ScreenManager from './pages/ScreenManager';
import ContentManager from './pages/ContentManager';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './utilities/AuthContext';

const Router = () => {
  const { isAuthenticated } = useAuth();
  const routes = useRoutes([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { path: '/', element: isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn /> },
        { path: '404', element: <Error /> },
        { path: '/register', element: isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/',
      element: <PrivateLayout />,
      children: [
        { path: '/', element: isAuthenticated && <Navigate to="/dashboard" /> },
        {
          path: '/dashboard',
          element: (
            <PrivateRoute>
              <ScreenManager />
            </PrivateRoute>
          ),
        },
        {
          path: '/screens',
          element: (
            <PrivateRoute>
              <ScreenManager />
            </PrivateRoute>
          ),
        },
        {
          path: '/content',
          element: (
            <PrivateRoute>
              <ContentManager />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
