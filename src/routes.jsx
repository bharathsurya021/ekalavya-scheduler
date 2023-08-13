import React, { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Loadable from "./components/Loadable";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";
const DashboardDefault = Loadable(lazy(() => import("./pages/Dashboard")));
const Router = () => {
  //   const isAuthenticated = useSelector(
  //     (state) => state.auth.userInfo && state.auth.userInfo.token !== ""
  //   );

  const isAuthenticated = true;
  const routes = useRoutes([
    {
      element: <PublicLayout />,
      children: [
        { path: "/", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
      ],
    },
    {
      element: <PrivateLayout />,
      children: [
        {
          path: "/auth/home",
          element: isAuthenticated ? (
            <DashboardDefault />
          ) : (
            <Navigate to={"/"} replace={true} />
          ),
        },
      ],
    },
  ]);

  return routes;
};

export default Router;
