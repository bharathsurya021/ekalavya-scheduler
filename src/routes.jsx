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
import { useAuth } from './components/AuthContext';
import EditCollection from './pages/ContentEdit';
import Events from './pages/Events';

const Router = () => {
  const { isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: isAuthenticated ? <Navigate to={'/dashboard'} /> : <SignIn /> },
        { path: 'register', element: isAuthenticated ? <Navigate to={'/dashboard'} /> : <SignUp /> },
        { path: '*', element: <Error /> },
      ],
    },
    {
      path: '/dashboard',
      element: <PrivateLayout />,
      children: [
        { index: true, element: <ScreenManager /> },
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
        {
          path: 'content/edit/:collectionName',
          element: < EditCollection />,
        },
        {
          path: 'content/view/:collectionName',
          element: < EditCollection />,
        },
        {
          path: 'events',
          element: < Events />,
        },
        {
          path: '*',
          element: < Error />,
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
