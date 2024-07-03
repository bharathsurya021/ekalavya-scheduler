import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import CalendarScheduler from './pages/Scheduler';
import CollectionManager from './pages/ContentManager';
import CollectionViewPage from './pages/CollectionView';
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
        { path: '/collection', element: <CollectionManager /> },
        { path: "/collectionview", element: <CollectionViewPage /> },

        { path: '/scheduler', element: <CalendarScheduler /> },
        { path: '/contentmanager', element: <CollectionManager /> },
      ],
    },
  ]);

  return routes;
};

export default Router;
